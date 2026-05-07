import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/usermodel.js";
import orderModel from "../models/orderModel.js";
import reviewModel from "../models/reviewModel.js";
import { notifyNewUser } from "./notificationcontroller.js";
import { sendWelcomeEmail } from "./emailcontroller.js";

// Token creation function
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, phone, address } = req.body;

        // Validate input
        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        const updateData = {
            name: name.trim(),
            phone: phone || "",
            address: {
                street: address?.street || "",
                city: address?.city || "",
                state: address?.state || "",
                zipcode: address?.zipcode || "",
                country: address?.country || ""
            }
        };

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address
            }
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// User login route
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Please enter a valid email" 
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            res.status(200).json({ 
                success: true, 
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// User registration route
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Name, email, and password are required" 
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Please enter a valid email" 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: "Password must be at least 6 characters" 
            });
        }

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ 
                success: false, 
                message: "User already exists" 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();
        
        // Create notification for new user
        await notifyNewUser({
            userId: user._id,
            name: user.name,
            email: user.email
        });

        // Send welcome email
        try {
            await sendWelcomeEmail(user.email, user.name);
        } catch (emailErr) {
            console.error("Failed to send welcome email:", emailErr);
        }
        
        const token = createToken(user._id);

        res.status(201).json({ 
            success: true, 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Admin login route
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.status(200).json({ 
                success: true, 
                token,
                user: {
                    email: email,
                    role: 'admin'
                }
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: "Invalid admin credentials" 
            });
        }
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Get user stats
const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const userIdString = userId.toString();

        const ordersCount = await orderModel.countDocuments({ userId: userIdString });
        const reviewsCount = await reviewModel.countDocuments({ userId });

        const user = await userModel.findById(userId);
        const wishlistCount = user?.wishlistData ? Object.keys(user.wishlistData).length : 0;

        const recentOrders = await orderModel.find({ userId: userIdString })
            .sort({ date: -1 })
            .limit(5);

        const totalSpent = await orderModel.aggregate([
            { $match: { userId: userIdString, payment: true } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                orders: ordersCount,
                wishlist: wishlistCount,
                reviews: reviewsCount,
                totalSpent: totalSpent[0]?.total || 0,
                recentOrders
            }
        });
    } catch (error) {
        console.error("Get user stats error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Add new address
const addAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { label, street, city, state, zipcode, country, phone, isDefault } = req.body;

        if (!street || !city || !state || !zipcode) {
            return res.status(400).json({
                success: false,
                message: "Street, city, state and pin code are required"
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // If this is set as default, unset others
        if (isDefault) {
            user.addresses.forEach(addr => { addr.isDefault = false; });
        }

        // If first address, make it default
        if (user.addresses.length === 0) {
            user.addresses.push({ label, street, city, state, zipcode, country, phone, isDefault: true });
        } else {
            user.addresses.push({ label, street, city, state, zipcode, country, phone, isDefault: isDefault || false });
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Address added successfully",
            addresses: user.addresses
        });
    } catch (error) {
        console.error("Add address error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update address
const updateAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { addressId } = req.params;
        const { label, street, city, state, zipcode, country, phone, isDefault } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        if (isDefault) {
            user.addresses.forEach(addr => { addr.isDefault = false; });
        }

        address.label = label || address.label;
        address.street = street !== undefined ? street : address.street;
        address.city = city !== undefined ? city : address.city;
        address.state = state !== undefined ? state : address.state;
        address.zipcode = zipcode !== undefined ? zipcode : address.zipcode;
        address.country = country !== undefined ? country : address.country;
        address.phone = phone !== undefined ? phone : address.phone;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            addresses: user.addresses
        });
    } catch (error) {
        console.error("Update address error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Delete address
const deleteAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { addressId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        const wasDefault = address.isDefault;
        user.addresses.pull(addressId);

        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            addresses: user.addresses
        });
    } catch (error) {
        console.error("Delete address error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const addToRecentlyViewed = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.recentlyViewed = user.recentlyViewed || [];
        
        const existingIndex = user.recentlyViewed.findIndex(p => p.productId.toString() === productId);
        if (existingIndex !== -1) {
            user.recentlyViewed.splice(existingIndex, 1);
        }

        user.recentlyViewed.unshift({ productId, viewedAt: new Date() });

        if (user.recentlyViewed.length > 20) {
            user.recentlyViewed = user.recentlyViewed.slice(0, 20);
        }

        await user.save();
        res.status(200).json({ success: true, message: "Added to recently viewed" });
    } catch (error) {
        console.error("Add to recently viewed error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getRecentlyViewed = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId).populate('recentlyViewed.productId');
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const products = (user.recentlyViewed || []).map(item => item.productId).filter(Boolean);
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("Get recently viewed error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const clearRecentlyViewed = async (req, res) => {
    try {
        const userId = req.user._id;
        await userModel.findByIdAndUpdate(userId, { recentlyViewed: [] });
        res.status(200).json({ success: true, message: "Recently viewed cleared" });
    } catch (error) {
        console.error("Clear recently viewed error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, getUserStats, addAddress, updateAddress, deleteAddress, addToRecentlyViewed, getRecentlyViewed, clearRecentlyViewed };
