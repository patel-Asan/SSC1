import express from 'express';
import {
    subscribeNewsletter,
    getSubscribers,
    unsubscribeNewsletter,
    removeSubscriber,
    sendBulkNewsletter
} from "../controllers/subscribercontroller.js";
import { verifyToken } from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const subscribeRouter = express.Router();

// Subscribe to newsletter (requires login)
subscribeRouter.post("/subscribe", verifyToken, subscribeNewsletter);

// Unsubscribe from newsletter (requires login)
subscribeRouter.post("/unsubscribe", verifyToken, unsubscribeNewsletter);

// Get all subscribers (admin only)
subscribeRouter.get("/list", adminAuth, getSubscribers);

// Remove subscriber (admin only)
subscribeRouter.delete("/:id", adminAuth, removeSubscriber);

// Send bulk newsletter email (admin only)
subscribeRouter.post("/send-bulk", adminAuth, sendBulkNewsletter);

export default subscribeRouter;
