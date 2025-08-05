// routes/userRouter.js
import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
  getUserProfile,
  updateUserProfile
} from "../controllers/usercontroller.js"; // ✅ Include .js if using ESM
import { verifyToken } from "../middleware/auth.js";

const userRouter = express.Router();

// User Registration
userRouter.post("/register", registerUser);

// User Login
userRouter.post("/login", loginUser);

// Admin Login
userRouter.post("/admin", adminLogin);

// Profile routes (protected)
userRouter.get("/profile", verifyToken, getUserProfile);
userRouter.put("/profile", verifyToken, updateUserProfile);

export default userRouter;
