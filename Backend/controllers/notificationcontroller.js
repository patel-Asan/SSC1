import notificationModel from "../models/notificationmodel.js";

// Create a new notification
const createNotification = async (type, title, message, data = {}) => {
    try {
        const notification = new notificationModel({
            type,
            title,
            message,
            data,
            isRead: false
        });
        await notification.save();
        console.log(`✅ Notification created: ${title}`);
        return notification;
    } catch (error) {
        console.error("❌ Error creating notification:", error);
        return null;
    }
};

// Get all notifications for admin
const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationModel
            .find()
            .sort({ createdAt: -1 })
            .limit(50);
        
        const unreadCount = await notificationModel.countDocuments({ isRead: false });
        
        res.status(200).json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};

// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        
        const notification = await notificationModel.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification
        });
    } catch (error) {
        console.error("Mark as read error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark notification as read"
        });
    }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        await notificationModel.updateMany(
            { isRead: false },
            { isRead: true }
        );
        
        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        console.error("Mark all as read error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark all notifications as read"
        });
    }
};

// Delete notification
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        
        const notification = await notificationModel.findByIdAndDelete(id);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Notification deleted"
        });
    } catch (error) {
        console.error("Delete notification error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete notification"
        });
    }
};

// Helper functions for creating specific notifications
const notifyNewOrder = async (orderData) => {
    const orderIdStr = orderData.orderId?.toString ? orderData.orderId.toString() : orderData.orderId;
    return await createNotification(
        'order',
        '🛍️ New Order Received',
        `Order #${orderIdStr?.slice(-8)} for ₹${orderData.amount}`,
        {
            orderId: orderIdStr,
            userId: orderData.userId,
            amount: orderData.amount
        }
    );
};

const notifyNewUser = async (userData) => {
    return await createNotification(
        'user',
        '👤 New User Registered',
        `${userData.name || 'A new user'} just registered`,
        {
            userId: userData.userId,
            userName: userData.name,
            userEmail: userData.email
        }
    );
};

const notifyOrderCancelled = async (orderData) => {
    const orderIdStr = orderData.orderId?.toString ? orderData.orderId.toString() : orderData.orderId;
    return await createNotification(
        'cancel',
        '❌ Order Cancelled',
        `Order #${orderIdStr?.slice(-8)} was cancelled by customer`,
        {
            orderId: orderIdStr,
            userId: orderData.userId,
            amount: orderData.amount
        }
    );
};

const notifyOrderDelivered = async (orderData) => {
    const orderIdStr = orderData.orderId?.toString ? orderData.orderId.toString() : orderData.orderId;
    return await createNotification(
        'delivery',
        '✅ Order Delivered',
        `Order #${orderIdStr?.slice(-8)} has been delivered`,
        {
            orderId: orderIdStr,
            userId: orderData.userId,
            amount: orderData.amount
        }
    );
};

export {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    notifyNewOrder,
    notifyNewUser,
    notifyOrderCancelled,
    notifyOrderDelivered
};
