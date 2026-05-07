import userModel from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "./emailcontroller.js";

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(200).json({ success: true, message: "If email exists, reset link has been sent" });
        }

        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        // Send password reset email
        try {
            await sendPasswordResetEmail(user.email, resetToken);
        } catch (emailErr) {
            console.error("Failed to send password reset email:", emailErr);
        }

        res.status(200).json({ 
            success: true, 
            message: "Password reset link has been sent to your email"
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: "Token and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);

        if (!user || !user.resetPasswordToken || user.resetPasswordToken !== token) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        if (Date.now() > user.resetPasswordExpires) {
            return res.status(400).json({ success: false, message: "Reset token has expired" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ success: false, message: "Reset token has expired" });
        }
        console.error("Reset password error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Current and new password are required" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { forgotPassword, resetPassword, changePassword };
