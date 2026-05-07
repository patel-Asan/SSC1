import nodemailer from 'nodemailer';

// Email transporter setup
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send order status email
const sendOrderStatusEmail = async (email, orderData) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Order Status Update - Order #${orderData.orderId?.slice(-8)}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #8b5cf6;">Order Status Updated</h2>
                    <p>Dear Customer,</p>
                    <p>Your order status has been updated to: <strong>${orderData.status}</strong></p>
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Order ID:</strong> #${orderData.orderId?.slice(-8)}</p>
                        <p><strong>Amount:</strong> ₹${orderData.amount}</p>
                        <p><strong>Status:</strong> ${orderData.status}</p>
                    </div>
                    <p>Thank you for shopping with us!</p>
                    <p style="color: #6b7280; font-size: 12px;">This is an automated email. Please do not reply.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email} for order #${orderData.orderId?.slice(-8)}`);
        return true;
    } catch (error) {
        console.error("❌ Email send error:", error);
        return false;
    }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Our Store!',
            html: `
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
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("❌ Welcome email error:", error);
        return false;
    }
};

// Send promotional email
const sendPromotionalEmail = async (email, subject, message) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: `
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
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Promotional email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("❌ Promotional email error:", error);
        return false;
    }
};

// Send order confirmation email (when order is placed)
const sendOrderConfirmationEmail = async (email, orderData) => {
    try {
        const transporter = createTransporter();

        const itemsList = orderData.items?.map(item =>
            `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">${item.name}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center">x${item.quantity || 1}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right">₹${item.price}</td></tr>`
        ).join('') || '';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Order Confirmed - Order #${orderData.orderId?.slice(-8)}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">🎉 Order Confirmed!</h1>
                        <p style="margin: 8px 0 0 0; opacity: 0.9;">Thank you for your purchase</p>
                    </div>
                    <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                        <p>Dear Customer,</p>
                        <p>Your order has been placed successfully.</p>
                        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0 0 4px 0;"><strong>Order ID:</strong> #${orderData.orderId?.slice(-8)}</p>
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
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Order confirmation sent to ${email} for order #${orderData.orderId?.slice(-8)}`);
        return true;
    } catch (error) {
        console.error("❌ Order confirmation email error:", error);
        return false;
    }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const transporter = createTransporter();
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset - Your Store',
            html: `
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
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("❌ Password reset email error:", error);
        return false;
    }
};

export {
    sendOrderStatusEmail,
    sendWelcomeEmail,
    sendPromotionalEmail,
    sendOrderConfirmationEmail,
    sendPasswordResetEmail
};
