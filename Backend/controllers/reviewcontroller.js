import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productmodel.js";
import userModel from "../models/usermodel.js";

// Get all reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await reviewModel.find({ productId })
      .populate("userId", "name")
      .sort({ date: -1 });
    
    res.json({ success: true, reviews });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Add a review (user must be logged in)
const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;
    
    // Validate product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    
    // Get user name
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    
    // Check if user already reviewed this product
    const existingReview = await reviewModel.findOne({ productId, userId });
    if (existingReview) {
      return res.json({ 
        success: false, 
        message: "You have already reviewed this product. Please edit your existing review." 
      });
    }
    
    // Create new review
    const review = new reviewModel({
      productId,
      userId,
      userName: user.name,
      rating,
      comment,
      date: Date.now()
    });
    
    await review.save();
    
    res.json({ success: true, message: "Review added successfully", review });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Edit/Update a review (only by the creator)
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    
    // Find review
    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.json({ success: false, message: "Review not found" });
    }
    
    // Check if current user is the owner
    if (review.userId.toString() !== userId) {
      return res.json({ 
        success: false, 
        message: "You can only edit your own reviews" 
      });
    }
    
    // Update review
    review.rating = rating;
    review.comment = comment;
    review.date = Date.now();
    
    await review.save();
    
    res.json({ success: true, message: "Review updated successfully", review });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete a review (only by the creator)
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    
    // Find review
    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.json({ success: false, message: "Review not found" });
    }
    
    // Check if current user is the owner
    if (review.userId.toString() !== userId) {
      return res.json({ 
        success: false, 
        message: "You can only delete your own reviews" 
      });
    }
    
    await reviewModel.findByIdAndDelete(reviewId);
    
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Get reviews by current user
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const reviews = await reviewModel.find({ userId })
      .populate("productId", "name image")
      .sort({ date: -1 });
    
    res.json({ success: true, reviews });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Check if user has reviewed a product
const checkUserReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    
    const review = await reviewModel.findOne({ productId, userId });
    
    res.json({ 
      success: true, 
      hasReviewed: !!review,
      review: review || null
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin: Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({})
      .populate("userId", "name email")
      .populate("productId", "name image")
      .sort({ date: -1 });
    
    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Admin: Delete any review
const adminDeleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await reviewModel.findByIdAndDelete(reviewId);
    
    if (!review) {
      return res.json({ success: false, message: "Review not found" });
    }
    
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Admin delete review error:", error);
    res.json({ success: false, message: error.message });
  }
};

export { 
  getProductReviews, 
  addReview, 
  updateReview, 
  deleteReview, 
  getUserReviews, 
  checkUserReview,
  getAllReviews,
  adminDeleteReview
};
