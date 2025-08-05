import express from 'express';
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus
} from '../controllers/ordercontroller.js';

import adminAuth from '../middleware/adminAuth.js';  // ✅ Fixed spacing and path
import { verifyToken } from '../middleware/auth.js';

const orderRouter = express.Router();

// ✅ Admin Routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// ✅ Payment Routes
orderRouter.post('/place', verifyToken, placeOrder);
orderRouter.post('/stripe', verifyToken, placeOrderStripe);
orderRouter.post('/razorpay', verifyToken, placeOrderRazorpay);

// ✅ User Route
orderRouter.post('/userorders', verifyToken, userOrders);

export default orderRouter;
