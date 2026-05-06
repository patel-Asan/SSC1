import express from 'express';
import {
    getAllCustomers,
    getCustomerDetails,
    updateCustomer,
    deleteCustomer
} from "../controllers/customercontroller.js";
import adminAuth from '../middleware/adminAuth.js';

const customerRouter = express.Router();

// Get all customers
customerRouter.get("/list", adminAuth, getAllCustomers);

// Get customer details with order history
customerRouter.get("/:id", adminAuth, getCustomerDetails);

// Update customer info
customerRouter.put("/:id", adminAuth, updateCustomer);

// Delete customer
customerRouter.delete("/:id", adminAuth, deleteCustomer);

export default customerRouter;
