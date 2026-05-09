import couponModel from "../models/couponmodel.js";
import subscriberModel from "../models/subscribermodel.js";
import { sendEmail } from "./emailcontroller.js";

// Create new coupon
const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderAmount, maxDiscount, usageLimit, expiryDate } = req.body;

        if (!code || !discountType || !discountValue || !expiryDate) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        const coupon = new couponModel({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            minOrderAmount: minOrderAmount || 0,
            maxDiscount: maxDiscount || null,
            usageLimit: usageLimit || null,
            expiryDate,
            isActive: true
        });

        await coupon.save();

        // Send coupon notification to all active subscribers
        try {
            const activeSubscribers = await subscriberModel.find({ status: 'active' });
            const discountText = coupon.discountType === 'percentage'
                ? coupon.discountValue + '% OFF'
                : '₹' + coupon.discountValue + ' OFF';
            const minOrderText = coupon.minOrderAmount > 0 ? ' | Min order: ₹' + coupon.minOrderAmount : '';
            const usageText = coupon.usageLimit ? 'Limited to ' + coupon.usageLimit + ' uses' : 'Unlimited uses';

            for (const sub of activeSubscribers) {
                try {
                    await sendEmail(sub.email,
                        '🎉 New Coupon: ' + coupon.code + ' - ' + discountText,
                        '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">' +
                            '<div style="background: linear-gradient(135deg, #8b5cf6, #ff6f61); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">' +
                                '<h1 style="color: white; margin: 0; font-size: 28px;">🎉 New Offer!</h1>' +
                                '<p style="color: rgba(255,255,255,0.9); font-size: 16px;">Exclusive coupon just for you</p>' +
                            '</div>' +
                            '<div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">' +
                                '<p style="color: #1f2937; font-size: 16px;">Hi <strong>' + sub.name + '</strong>,</p>' +
                                '<p style="color: #6b7280; line-height: 1.6;">Use the coupon below on your next order and save big!</p>' +
                                '<div style="background: #f3f4f6; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">' +
                                    '<p style="color: #6b7280; margin: 0 0 8px; font-size: 14px;">Your Coupon Code:</p>' +
                                    '<p style="font-size: 32px; font-weight: bold; color: #8b5cf6; margin: 0; letter-spacing: 3px;">' + coupon.code + '</p>' +
                                    '<p style="color: #10b981; margin: 8px 0 0; font-weight: 600;">' + discountText + minOrderText + '</p>' +
                                '</div>' +
                                '<p style="color: #9ca3af; font-size: 13px;">Valid till ' + new Date(coupon.expiryDate).toLocaleDateString() + ' • ' + usageText + '</p>' +
                            '</div>' +
                        '</div>'
                    );
                } catch (err) {
                    console.error('Failed to send coupon email to ' + sub.email + ':', err);
                }
            }
            console.log('Coupon ' + coupon.code + ' notification sent to ' + activeSubscribers.length + ' subscribers');
        } catch (err) {
            console.error("Failed to notify subscribers about coupon:", err);
        }

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists"
            });
        }
        console.error("Create coupon error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create coupon"
        });
    }
};

// Get all coupons
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find({}).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            coupons
        });
    } catch (error) {
        console.error("Get all coupons error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch coupons"
        });
    }
};

// Get active coupons
const getActiveCoupons = async (req, res) => {
    try {
        const now = new Date();
        const coupons = await couponModel.find({
            isActive: true,
            expiryDate: { $gt: now }
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            coupons
        });
    } catch (error) {
        console.error("Get active coupons error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch active coupons"
        });
    }
};

// Apply coupon
const applyCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;

        if (!code || !orderAmount) {
            return res.status(400).json({
                success: false,
                message: "Coupon code and order amount are required"
            });
        }

        const coupon = await couponModel.findOne({ 
            code: code.toUpperCase(),
            isActive: true 
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Invalid coupon code"
            });
        }

        // Check expiry
        if (new Date(coupon.expiryDate) < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Coupon has expired"
            });
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({
                success: false,
                message: "Coupon usage limit reached"
            });
        }

        // Check minimum order amount
        if (orderAmount < coupon.minOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount ₹${coupon.minOrderAmount} required`
            });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (orderAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        const finalAmount = orderAmount - discount;

        res.status(200).json({
            success: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discount,
                finalAmount
            }
        });
    } catch (error) {
        console.error("Apply coupon error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to apply coupon"
        });
    }
};

// Update coupon
const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const coupon = await couponModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            coupon
        });
    } catch (error) {
        console.error("Update coupon error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update coupon"
        });
    }
};

// Delete coupon
const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon = await couponModel.findByIdAndDelete(id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully"
        });
    } catch (error) {
        console.error("Delete coupon error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete coupon"
        });
    }
};

// Increment coupon usage
const incrementCouponUsage = async (code) => {
    try {
        await couponModel.findOneAndUpdate(
            { code: code.toUpperCase() },
            { $inc: { usedCount: 1 } }
        );
    } catch (error) {
        console.error("Increment coupon usage error:", error);
    }
};

export {
    createCoupon,
    getAllCoupons,
    getActiveCoupons,
    applyCoupon,
    updateCoupon,
    deleteCoupon,
    incrementCouponUsage
};
