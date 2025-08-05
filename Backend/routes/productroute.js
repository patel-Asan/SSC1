

import express from 'express';
import {
  listProduct,
  addProduct,
  removeProduct,
  SingleProduct
} from "../controllers/productcontroller.js";

import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

// ✅ Route to add a product (requires admin auth and file uploads)
productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);

// ✅ Route to remove a product (requires admin auth)
productRouter.post("/remove", adminAuth, removeProduct);

// ✅ Route to get a single product (open to public)
productRouter.post("/single", SingleProduct);

// ✅ Route to list all products (open to public)
productRouter.get("/list", listProduct);

export default productRouter;
