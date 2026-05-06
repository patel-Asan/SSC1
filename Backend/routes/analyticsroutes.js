import express from 'express';
import {
    getOverallStats,
    getSalesTrends,
    getTopProducts,
    getRecentOrders,
    getCustomerStats
} from "../controllers/analyticscontroller.js";
import adminAuth from '../middleware/adminAuth.js';

const analyticsRouter = express.Router();

// Get overall stats
analyticsRouter.get("/stats", adminAuth, getOverallStats);

// Get sales trends (daily/weekly/monthly)
analyticsRouter.get("/trends", adminAuth, getSalesTrends);

// Get top selling products
analyticsRouter.get("/top-products", adminAuth, getTopProducts);

// Get recent orders
analyticsRouter.get("/recent-orders", adminAuth, getRecentOrders);

// Get customer stats
analyticsRouter.get("/customer-stats", adminAuth, getCustomerStats);

export default analyticsRouter;
