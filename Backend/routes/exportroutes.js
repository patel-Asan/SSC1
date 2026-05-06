import express from 'express';
import {
    exportOrdersCSV,
    exportCustomersCSV
} from "../controllers/exportcontroller.js";
import adminAuth from '../middleware/adminAuth.js';

const exportRouter = express.Router();

// Export orders as CSV
exportRouter.get("/orders", adminAuth, exportOrdersCSV);

// Export customers as CSV
exportRouter.get("/customers", adminAuth, exportCustomersCSV);

export default exportRouter;
