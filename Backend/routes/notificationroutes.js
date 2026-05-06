import express from 'express';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from "../controllers/notificationcontroller.js";
import adminAuth from '../middleware/adminAuth.js';

const notificationRouter = express.Router();

// Get all notifications (admin only)
notificationRouter.get("/list", adminAuth, getNotifications);

// Mark single notification as read
notificationRouter.put("/read/:id", adminAuth, markAsRead);

// Mark all notifications as read
notificationRouter.put("/read-all", adminAuth, markAllAsRead);

// Delete notification
notificationRouter.delete("/delete/:id", adminAuth, deleteNotification);

export default notificationRouter;
