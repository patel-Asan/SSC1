import wishlistModel from "../models/wishlistmodel.js";
import productModel from "../models/productmodel.js";

const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const wishlist = await wishlistModel.findOne({ userId }).populate('products.productId');
        
        if (!wishlist) {
            return res.status(200).json({ success: true, products: [] });
        }

        const products = wishlist.products.map(item => item.productId);
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("Get wishlist error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        let wishlist = await wishlistModel.findOne({ userId });

        if (!wishlist) {
            wishlist = new wishlistModel({ userId, products: [{ productId }] });
        } else {
            const exists = wishlist.products.some(p => p.productId.toString() === productId);
            if (exists) {
                return res.status(200).json({ success: true, message: "Already in wishlist" });
            }
            wishlist.products.push({ productId });
        }

        await wishlist.save();
        res.status(200).json({ success: true, message: "Added to wishlist" });
    } catch (error) {
        console.error("Add to wishlist error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        const wishlist = await wishlistModel.findOne({ userId });
        if (!wishlist) {
            return res.status(200).json({ success: true, message: "Wishlist is empty" });
        }

        wishlist.products = wishlist.products.filter(p => p.productId.toString() !== productId);
        await wishlist.save();

        res.status(200).json({ success: true, message: "Removed from wishlist" });
    } catch (error) {
        console.error("Remove from wishlist error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const clearWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        await wishlistModel.findOneAndDelete({ userId });
        res.status(200).json({ success: true, message: "Wishlist cleared" });
    } catch (error) {
        console.error("Clear wishlist error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };
