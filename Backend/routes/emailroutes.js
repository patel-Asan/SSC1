import express from 'express';
import {
    sendOrderStatusEmail,
    sendWelcomeEmail,
    sendPromotionalEmail
} from "../controllers/emailcontroller.js";
import adminAuth from '../middleware/adminAuth.js';

const emailRouter = express.Router();

// Send order status email (admin)
emailRouter.post("/order-status", adminAuth, sendOrderStatusEmail);

// Send welcome email (admin)
emailRouter.post("/welcome", adminAuth, sendWelcomeEmail);

// Send promotional email (admin)
emailRouter.post("/promotional", adminAuth, sendPromotionalEmail);

export default emailRouter;
