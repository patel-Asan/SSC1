import express from 'express';
import {
    createCoupon,
    getAllCoupons,
    getActiveCoupons,
    applyCoupon,
    updateCoupon,
    deleteCoupon
} from "../controllers/couponcontroller.js";
import adminAuth from '../middleware/adminAuth.js';

const couponRouter = express.Router();

// Create new coupon (admin)
couponRouter.post("/create", adminAuth, createCoupon);

// Get all coupons (admin)
couponRouter.get("/list", adminAuth, getAllCoupons);

// Get active coupons (public - for users)
couponRouter.get("/active", getActiveCoupons);

// Apply coupon (public - for users)
couponRouter.post("/apply", applyCoupon);

// Update coupon (admin)
couponRouter.put("/:id", adminAuth, updateCoupon);

// Delete coupon (admin)
couponRouter.delete("/:id", adminAuth, deleteCoupon);

export default couponRouter;
