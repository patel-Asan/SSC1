import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_USER || 'noreply@sscstore.com';

const sendEmail = async (to, subject, html) => {
    if (process.env.SENDGRID_API_KEY) {
        await sgMail.send({ to, from: fromEmail, subject, html });
        return;
    }
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
    });
    await transporter.sendMail({ from: fromEmail, to, subject, html });
};

const buildOrderId = (id) => String(id).slice(-8);

const sendOrderStatusEmail = async (email, orderData) => {
    try {
        const orderId = buildOrderId(orderData.orderId);
        await sendEmail(email,
            `Order Status Update - Order #${orderId}`,
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #8b5cf6;">Order Status Updated</h2>
                    <p>Dear Customer,</p>
                    <p>Your order status has been updated to: <strong>${orderData.status}</strong></p>
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Order ID:</strong> #${orderId}</p>
                        <p><strong>Amount:</strong> ₹${orderData.amount}</p>
                        <p><strong>Status:</strong> ${orderData.status}</p>
                    </div>
                    <p>Thank you for shopping with us!</p>
                    <p style="color: #6b7280; font-size: 12px;">This is an automated email. Please do not reply.</p>
                </div>
            `
        );
        console.log(`✅ Email sent to ${email} for order #${orderId}`);
        return true;
    } catch (error) {
        console.error("❌ Email send error:", error);
        return false;
    }
};

const sendWelcomeEmail = async (email, name) => {
    try {
        await sendEmail(email,
            'Welcome to Our Store!',
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #8b5cf6;">Welcome to Our Store!</h2>
                    <p>Dear ${name},</p>
                    <p>Thank you for registering with us. We're excited to have you as part of our community!</p>
                    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0;">Start Shopping</h3>
                        <p style="margin: 10px 0 0 0;">Explore our amazing products and enjoy great deals!</p>
                    </div>
                    <p>If you have any questions, feel free to contact us.</p>
                    <p style="color: #6b7280; font-size: 12px;">This is an automated email. Please do not reply.</p>
                </div>
            `
        );
        console.log(`✅ Welcome email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("❌ Welcome email error:", error);
        return false;
    }
};

const sendPromotionalEmail = async (email, subject, message) => {
    try {
        await sendEmail(email,
            subject,
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="margin: 0;">Special Offer!</h2>
                    </div>
                    <p>${message}</p>
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Shop Now</a>
                    </div>
                    <p style="color: #6b7280; font-size: 12px;">This is an automated email. Please do not reply.</p>
                </div>
            `
        );
        console.log(`✅ Promotional email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("❌ Promotional email error:", error);
        return false;
    }
};

const sendOrderConfirmationEmail = async (email, orderData) => {
    try {
        const orderId = buildOrderId(orderData.orderId);
        const itemsList = orderData.items?.map(item =>
            `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">${item.name}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center">x${item.quantity || 1}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right">₹${item.price}</td></tr>`
        ).join('') || '';

        await sendEmail(email,
            `Order Confirmed - Order #${orderId}`,
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">🎉 Order Confirmed!</h1>
                        <p style="margin: 8px 0 0 0; opacity: 0.9;">Thank you for your purchase</p>
                    </div>
                    <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                        <p>Dear Customer,</p>
                        <p>Your order has been placed successfully.</p>
                        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0 0 4px 0;"><strong>Order ID:</strong> #${orderId}</p>
                            <p style="margin: 0 0 4px 0;"><strong>Total Amount:</strong> ₹${orderData.amount}</p>
                            <p style="margin: 0 0 4px 0;"><strong>Payment Method:</strong> ${orderData.paymentMethod || 'COD'}</p>
                            <p style="margin: 0;"><strong>Status:</strong> ${orderData.status || 'Processing'}</p>
                        </div>
                        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                            <thead><tr><th style="padding:8px;border-bottom:2px solid #8b5cf6;text-align:left">Item</th><th style="padding:8px;border-bottom:2px solid #8b5cf6;text-align:center">Qty</th><th style="padding:8px;border-bottom:2px solid #8b5cf6;text-align:right">Price</th></tr></thead>
                            <tbody>${itemsList}</tbody>
                        </table>
                        <p style="color: #6b7280; font-size: 12px;">You can track your order status in your account.</p>
                        <p style="color: #6b7280; font-size: 12px;">This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            `
        );
        console.log(`✅ Order confirmation sent to ${email} for order #${orderId}`);
        return true;
    } catch (error) {
        console.error("❌ Order confirmation email error:", error);
        return false;
    }
};

const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

        await sendEmail(email,
            'Password Reset - Your Store',
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">🔒 Password Reset</h1>
                    </div>
                    <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                        <p>Dear Customer,</p>
                        <p>We received a request to reset your password. Click the button below to set a new password:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetLink}" style="background: #8b5cf6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; display: inline-block;">Reset Password</a>
                        </div>
                        <p style="color: #6b7280; font-size: 13px;">This link will expire in <strong>15 minutes</strong>.</p>
                        <p style="color: #6b7280; font-size: 13px;">If you didn't request this, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        <p style="color: #6b7280; font-size: 12px;">This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            `
        );
        console.log(`✅ Password reset email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("❌ Password reset email error:", error);
        return false;
    }
};

export {
    sendEmail,
    sendOrderStatusEmail,
    sendWelcomeEmail,
    sendPromotionalEmail,
    sendOrderConfirmationEmail,
    sendPasswordResetEmail
};
