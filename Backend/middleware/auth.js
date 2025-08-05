import jwt from "jsonwebtoken";
import userModel from "../models/usermodel.js";

// Verify user token
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. User not found."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid token."
        });
    }
};

// Verify admin token
export const verifyAdminToken = async (req, res, next) => {
    try {
        const token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // For admin, we check if the token matches the admin credentials
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const expectedToken = jwt.sign(adminEmail + adminPassword, process.env.JWT_SECRET);
        
        if (token === expectedToken) {
            req.admin = { email: adminEmail, role: 'admin' };
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid admin token."
            });
        }
    } catch (error) {
        console.error("Admin token verification error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid admin token."
        });
    }
};
