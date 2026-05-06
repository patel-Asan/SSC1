import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['order', 'user', 'cancel', 'delivery', 'review'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        orderId: { type: String, default: null },
        userId: { type: String, default: null },
        amount: { type: Number, default: null },
        userName: { type: String, default: null },
        userEmail: { type: String, default: null }
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const notificationModel = mongoose.model("Notification", notificationSchema);

export default notificationModel;
