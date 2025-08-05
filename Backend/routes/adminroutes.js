import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getOrderAnalytics,
  getProductAnalytics,
  getSalesReport,
  getInventoryStatus
} from "../controllers/admincontroller.js";
import { verifyAdminToken } from "../middleware/auth.js";

const adminRouter = express.Router();

// Admin Dashboard
adminRouter.get("/dashboard", verifyAdminToken, getDashboardStats);

// User Management
adminRouter.get("/users", verifyAdminToken, getAllUsers);
adminRouter.put("/users/:id/status", verifyAdminToken, updateUserStatus);
adminRouter.delete("/users/:id", verifyAdminToken, deleteUser);

// Order Management
adminRouter.get("/orders", verifyAdminToken, getAllOrders);
adminRouter.put("/orders/:id/status", verifyAdminToken, updateOrderStatus);

// Analytics
adminRouter.get("/analytics/orders", verifyAdminToken, getOrderAnalytics);
adminRouter.get("/analytics/products", verifyAdminToken, getProductAnalytics);
adminRouter.get("/analytics/sales", verifyAdminToken, getSalesReport);
adminRouter.get("/analytics/inventory", verifyAdminToken, getInventoryStatus);

export default adminRouter; 