// routes/userRouter.js
import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  getUserStats,
  addAddress,
  updateAddress,
  deleteAddress,
  addToRecentlyViewed,
  getRecentlyViewed,
  clearRecentlyViewed
} from "../controllers/usercontroller.js"; // ✅ Include .js if using ESM
import { verifyToken } from "../middleware/auth.js";
import User from "../models/usermodel.js";

const userRouter = express.Router();

// User Registration
userRouter.post("/register", registerUser);

// User Login
userRouter.post("/login", loginUser);

// Admin Login
userRouter.post("/admin", adminLogin);

// Get user count (for stats)
userRouter.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error getting user count:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Profile routes (protected)
userRouter.get("/profile", verifyToken, getUserProfile);
userRouter.put("/profile", verifyToken, updateUserProfile);
userRouter.get("/stats", verifyToken, getUserStats);

// Address routes (protected)
userRouter.post("/address", verifyToken, addAddress);
userRouter.put("/address/:addressId", verifyToken, updateAddress);
userRouter.delete("/address/:addressId", verifyToken, deleteAddress);

// Recently viewed routes (protected)
userRouter.post("/recently-viewed", verifyToken, addToRecentlyViewed);
userRouter.get("/recently-viewed", verifyToken, getRecentlyViewed);
userRouter.delete("/recently-viewed", verifyToken, clearRecentlyViewed);

export default userRouter;
