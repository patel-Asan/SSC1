import productmodel from "../models/productmodel.js";

// Get low stock products
const getLowStockProducts = async (req, res) => {
    try {
        const { threshold = 10 } = req.query;
        
        const lowStockProducts = await productmodel.find({
            $or: [
                { stock: { $lt: parseInt(threshold) } },
                { stock: { $exists: false } }
            ]
        }).sort({ stock: 1 });

        res.status(200).json({
            success: true,
            lowStockProducts,
            count: lowStockProducts.length
        });
    } catch (error) {
        console.error("Get low stock products error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch low stock products"
        });
    }
};

// Get inventory summary
const getInventorySummary = async (req, res) => {
    try {
        const products = await productmodel.find({});
        
        const totalProducts = products.length;
        const outOfStock = products.filter(p => p.stock === 0 || !p.stock).length;
        const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length;
        const inStock = products.filter(p => p.stock >= 10).length;
        
        const totalStockValue = products.reduce((sum, p) => {
            const stock = p.stock || 0;
            const price = p.price || 0;
            return sum + (stock * price);
        }, 0);

        res.status(200).json({
            success: true,
            summary: {
                totalProducts,
                outOfStock,
                lowStock,
                inStock,
                totalStockValue
            }
        });
    } catch (error) {
        console.error("Get inventory summary error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch inventory summary"
        });
    }
};

// Update stock level
const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        if (stock === undefined || stock === null) {
            return res.status(400).json({
                success: false,
                message: "Stock value is required"
            });
        }

        const product = await productmodel.findByIdAndUpdate(
            id,
            { stock: parseInt(stock) },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            product
        });
    } catch (error) {
        console.error("Update stock error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update stock"
        });
    }
};

// Bulk stock update
const bulkUpdateStock = async (req, res) => {
    try {
        const { updates } = req.body; // [{ id: "...", stock: 10 }, ...]

        if (!updates || !Array.isArray(updates)) {
            return res.status(400).json({
                success: false,
                message: "Updates array is required"
            });
        }

        const updatePromises = updates.map(update =>
            productmodel.findByIdAndUpdate(
                update.id,
                { stock: parseInt(update.stock) },
                { new: true }
            )
        );

        const updatedProducts = await Promise.all(updatePromises);

        res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            updatedProducts
        });
    } catch (error) {
        console.error("Bulk update stock error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to bulk update stock"
        });
    }
};

export {
    getLowStockProducts,
    getInventorySummary,
    updateStock,
    bulkUpdateStock
};
