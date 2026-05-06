import express from 'express';
import {
    createCategory,
    getAllCategories,
    getActiveCategories,
    updateCategory,
    deleteCategory
} from "../controllers/categorycontroller.js";
import adminAuth from '../middleware/adminAuth.js';

const categoryRouter = express.Router();

// Create category (admin)
categoryRouter.post("/create", adminAuth, createCategory);

// Get all categories (admin)
categoryRouter.get("/list", adminAuth, getAllCategories);

// Get active categories (public - for users)
categoryRouter.get("/active", getActiveCategories);

// Update category (admin)
categoryRouter.put("/:id", adminAuth, updateCategory);

// Delete category (admin)
categoryRouter.delete("/:id", adminAuth, deleteCategory);

export default categoryRouter;
