import express from "express";
import { 
  getProductReviews, 
  addReview, 
  updateReview, 
  deleteReview, 
  getUserReviews, 
  checkUserReview,
  getAllReviews,
  adminDeleteReview
} from "../controllers/reviewcontroller.js";
import { verifyToken } from "../middleware/auth.js";
import adminAuth from '../middleware/adminAuth.js';

const reviewRouter = express.Router();

// Public route - Get all reviews for a product
reviewRouter.get("/product/:productId", getProductReviews);

// Protected routes - Require authentication
reviewRouter.post("/add", verifyToken, addReview);
reviewRouter.put("/update/:reviewId", verifyToken, updateReview);
reviewRouter.delete("/delete/:reviewId", verifyToken, deleteReview);
reviewRouter.get("/user", verifyToken, getUserReviews);
reviewRouter.get("/check/:productId", verifyToken, checkUserReview);

// Admin routes
reviewRouter.get("/admin/all", adminAuth, getAllReviews);
reviewRouter.delete("/admin/:reviewId", adminAuth, adminDeleteReview);

export default reviewRouter;
