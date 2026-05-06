import express from 'express';
import User from '../models/usermodel.js';
import Product from '../models/productmodel.js';
import Review from '../models/reviewModel.js';

const router = express.Router();

// GET /api/stats - Get dashboard statistics
router.get('/', async (req, res) => {
  try {
    // Count total users/customers
    const usersCount = await User.countDocuments();
    
    // Count total products
    const productsCount = await Product.countDocuments();
    
    // Calculate average rating from all reviews
    const reviews = await Review.find();
    let avgRating = 4.8; // Default fallback
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      avgRating = totalRating / reviews.length;
    }
    
    // Get total reviews count
    const reviewsCount = reviews.length;
    
    res.json({
      success: true,
      stats: {
        products: productsCount,
        customers: usersCount,
        rating: avgRating,
        reviews: reviewsCount
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch statistics',
      error: error.message 
    });
  }
});

export default router;
