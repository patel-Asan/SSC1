import express from 'express';
import {
    getLowStockProducts,
    getInventorySummary,
    updateStock,
    bulkUpdateStock
} from "../controllers/inventorycontroller.js";
import adminAuth from '../middleware/adminAuth.js';

const inventoryRouter = express.Router();

// Get low stock products
inventoryRouter.get("/low-stock", adminAuth, getLowStockProducts);

// Get inventory summary
inventoryRouter.get("/summary", adminAuth, getInventorySummary);

// Update stock level
inventoryRouter.put("/update/:id", adminAuth, updateStock);

// Bulk stock update
inventoryRouter.put("/bulk-update", adminAuth, bulkUpdateStock);

export default inventoryRouter;
