import subscriberModel from "../models/subscribermodel.js";
import couponModel from "../models/couponmodel.js";
import userModel from "../models/usermodel.js";
import { sendEmail } from "./emailcontroller.js";

const subscribeNewsletter = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const existingSubscriber = await subscriberModel.findOne({ userId });
        if (existingSubscriber) {
            if (existingSubscriber.status === 'active') {
                return res.status(400).json({
                    success: false,
                    message: "You are already subscribed"
                });
            } else {
                existingSubscriber.status = 'active';
                existingSubscriber.unsubscribedAt = null;
                await existingSubscriber.save();
                return res.json({ success: true, message: "Re-subscribed successfully", couponCode: existingSubscriber.couponCode });
            }
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const couponCode = `WELCOME-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        const coupon = new couponModel({
            code: couponCode,
            discountType: 'percentage',
            discountValue: 10,
            minOrderAmount: 0,
            maxDiscount: 500,
            usageLimit: 1,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isActive: true
        });
        await coupon.save();

        const subscriber = new subscriberModel({
            userId,
            email: user.email,
            name: user.name,
            couponCode
        });
        await subscriber.save();

        try {
            await sendEmail(user.email,
                `Welcome! Your 10% Off Coupon: ${couponCode}`,
                `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome!</h1>
                            <p style="color: rgba(255,255,255,0.9); font-size: 16px;">Thank you for subscribing to our newsletter</p>
                        </div>
                        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                            <p style="color: #1f2937; font-size: 16px;">Hi <strong>${user.name}</strong>,</p>
                            <p style="color: #6b7280; line-height: 1.6;">Here's your exclusive 10% discount coupon! Use it at checkout on your next order.</p>
                            <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
                                <p style="color: #6b7280; margin: 0 0 8px; font-size: 14px;">Your Coupon Code:</p>
                                <p style="font-size: 32px; font-weight: bold; color: #6366f1; margin: 0; letter-spacing: 3px;">${couponCode}</p>
                                <p style="color: #10b981; margin: 8px 0 0; font-weight: 600;">10% OFF (up to ₹500)</p>
                            </div>
                            <p style="color: #6b7280; font-size: 13px;">Valid for 30 days • One-time use • Minimum order: ₹0</p>
                        </div>
                    </div>
                `
            );
        } catch (emailError) {
            console.error("Welcome email failed:", emailError);
        }

        res.status(201).json({
            success: true,
            message: "Subscribed successfully! Check your email for coupon",
            couponCode
        });
    } catch (error) {
        console.error("Subscribe error:", error);
        res.status(500).json({ success: false, message: "Failed to subscribe" });
    }
};

const getSubscribers = async (req, res) => {
    try {
        const subscribers = await subscriberModel.find({}).sort({ subscribedAt: -1 });
        const activeCount = subscribers.filter(s => s.status === 'active').length;
        const totalRevenue = 0;
        
        res.json({
            success: true,
            subscribers,
            activeCount,
            totalCount: subscribers.length
        });
    } catch (error) {
        console.error("Get subscribers error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch subscribers" });
    }
};

const unsubscribeNewsletter = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const subscriber = await subscriberModel.findOne({ userId });
        if (!subscriber) {
            return res.status(404).json({ success: false, message: "Subscription not found" });
        }

        subscriber.status = 'unsubscribed';
        subscriber.unsubscribedAt = new Date();
        await subscriber.save();

        res.json({ success: true, message: "Unsubscribed successfully" });
    } catch (error) {
        console.error("Unsubscribe error:", error);
        res.status(500).json({ success: false, message: "Failed to unsubscribe" });
    }
};

const removeSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        const subscriber = await subscriberModel.findByIdAndDelete(id);
        
        if (!subscriber) {
            return res.status(404).json({ success: false, message: "Subscriber not found" });
        }

        res.json({ success: true, message: "Subscriber removed" });
    } catch (error) {
        console.error("Remove subscriber error:", error);
        res.status(500).json({ success: false, message: "Failed to remove subscriber" });
    }
};

const sendBulkNewsletter = async (req, res) => {
    try {
        const { subject, message } = req.body;
        
        if (!subject || !message) {
            return res.status(400).json({ success: false, message: "Subject and message required" });
        }

        const activeSubscribers = await subscriberModel.find({ status: 'active' });
        let sent = 0;
        let failed = 0;

        for (const subscriber of activeSubscribers) {
            try {
                await sendEmail(subscriber.email,
                    subject,
                    `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="padding: 30px;">
                                <h2 style="color: #1f2937;">Hi ${subscriber.name},</h2>
                                <div style="color: #6b7280; line-height: 1.6; margin-top: 20px;">
                                    ${message}
                                </div>
                                <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                                    You're receiving this because you subscribed to our newsletter. 
                                    To unsubscribe, visit your account settings.
                                </p>
                            </div>
                        </div>
                    `
                );
                sent++;
            } catch (err) {
                failed++;
                console.error(`Failed to send to ${subscriber.email}:`, err);
            }
        }

        res.json({ success: true, message: `Sent to ${sent} subscribers (${failed} failed)` });
    } catch (error) {
        console.error("Send newsletter error:", error);
        res.status(500).json({ success: false, message: "Failed to send newsletter" });
    }
};

export {
    subscribeNewsletter,
    getSubscribers,
    unsubscribeNewsletter,
    removeSubscriber,
    sendBulkNewsletter
};
