import couponModel from "../models/couponmodel.js";

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
