import categoryModel from "../models/categorymodel.js";
import productmodel from "../models/productmodel.js";

// Create category
const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const category = new categoryModel({
            name,
            slug,
            description: description || "",
            image: image || "",
            isActive: true
        });

        await category.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }
        console.error("Create category error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create category"
        });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error("Get all categories error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories"
        });
    }
};

// Get active categories
const getActiveCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({ isActive: true }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error("Get active categories error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories"
        });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image, isActive } = req.body;

        const updateData = {};
        if (name) {
            updateData.name = name;
            updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        if (description !== undefined) updateData.description = description;
        if (image !== undefined) updateData.image = image;
        if (isActive !== undefined) updateData.isActive = isActive;

        const category = await categoryModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.error("Update category error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update category"
        });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category has products
        const productsCount = await productmodel.countDocuments({ category: id });
        if (productsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category with ${productsCount} products`
            });
        }

        const category = await categoryModel.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error("Delete category error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete category"
        });
    }
};

export {
    createCategory,
    getAllCategories,
    getActiveCategories,
    updateCategory,
    deleteCategory
};
