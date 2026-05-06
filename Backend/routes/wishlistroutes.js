import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } from "../controllers/wishlistcontroller.js";
import { verifyToken } from "../middleware/auth.js";

const wishlistRouter = express.Router();

wishlistRouter.get("/", verifyToken, getWishlist);
wishlistRouter.post("/add", verifyToken, addToWishlist);
wishlistRouter.post("/remove", verifyToken, removeFromWishlist);
wishlistRouter.delete("/clear", verifyToken, clearWishlist);

export default wishlistRouter;
