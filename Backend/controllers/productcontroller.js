import productModel from "../models/productmodel.js";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import connectCloudinary from "../config/cloudinary.js";

// Function to add a product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller, stock } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category || !subCategory || !sizes) {
            return res.status(400).json({ 
                success: false, 
                message: "All required fields must be provided" 
            });
        }

        // Extracting images safely
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const images = [image1, image2, image3, image4].filter(Boolean);

        if (images.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "At least one image is required" 
            });
        }

        // Save images to Cloudinary and get URLs
        const imagesUrl = [];
        
        for (let i = 0; i < images.length; i++) {
            const item = images[i];
            try {
                // Upload to Cloudinary
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'ssc-products',
                            public_id: `product_${Date.now()}_${i}`,
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(item.buffer);
                });

                const imageUrl = result.secure_url;
                imagesUrl.push(imageUrl);
                console.log(`✅ Image ${i + 1} uploaded to Cloudinary: ${imageUrl}`);
                
            } catch (uploadError) {
                console.error(`❌ Cloudinary upload error for image ${i + 1}:`, uploadError);
                // Fallback to placeholder if upload fails
                imagesUrl.push("https://placehold.co/400x400?text=Image+Not+Available");
            }
        }

        // Create product object
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestseller: bestseller === "true",
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now(),
            stock: stock ? Number(stock) : 0,
        };

        const product = new productModel(productData);
        await product.save();

        console.log(`✅ Product "${name}" added successfully with ${imagesUrl.length} images`);

        res.status(201).json({ 
            success: true, 
            message: "Product added successfully.",
            product 
        });
    } catch (error) {
        console.error("Add product error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Function to list all products
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find().sort({ date: -1 });
        
        const normalizedProducts = products.map(p => {
            const obj = p.toObject();
            if (typeof obj.image === 'string') {
                obj.image = obj.image.split(',').filter(Boolean);
            }
            if (!Array.isArray(obj.image)) {
                obj.image = [];
            }
            return obj;
        });
        
        res.status(200).json({ 
            success: true, 
            products: normalizedProducts,
            count: normalizedProducts.length 
        });
    } catch (error) {
        console.error("List products error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Function to remove a product
const removeProduct = async (req, res) => {
    try {
        console.log("🔍 Remove product request received");
        console.log("📝 Request body:", req.body);
        console.log("🔑 Headers:", req.headers);
        
        const { id } = req.body; // Changed from req.params to req.body

        if (!id) {
            console.log("❌ No product ID provided");
            return res.status(400).json({ 
                success: false, 
                message: "Product ID is required" 
            });
        }

        console.log("🔍 Looking for product with ID:", id);
        const product = await productModel.findByIdAndDelete(id);
        
        if (!product) {
            console.log("❌ Product not found with ID:", id);
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        console.log("✅ Product removed successfully:", product.name);
        res.status(200).json({ 
            success: true, 
            message: "Product removed successfully." 
        });
    } catch (error) {
        console.error("❌ Remove product error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Function to get a single product by ID
const SingleProduct = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: "Product ID is required" 
            });
        }

        const product = await productModel.findById(id);
        
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found." 
            });
        }
        
        const obj = product.toObject();
        if (typeof obj.image === 'string') {
            obj.image = obj.image.split(',').filter(Boolean);
        }
        if (!Array.isArray(obj.image)) {
            obj.image = [];
        }
        
        res.status(200).json({ 
            success: true, 
            product: obj 
        });
    } catch (error) {
        console.error("Get single product error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Function to update a product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, subCategory, sizes, bestseller, stock } = req.body;

        console.log("🔍 Update product request received");
        console.log("📝 Product ID:", id);
        console.log("📝 Update data:", req.body);

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: "Product ID is required" 
            });
        }

        // Find the product
        const product = await productModel.findById(id);
        
        if (!product) {
            console.log("❌ Product not found with ID:", id);
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        // Update fields
        if (name) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = Number(price);
        if (category) product.category = category;
        if (subCategory) product.subCategory = subCategory;
        if (sizes) product.sizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
        if (bestseller !== undefined) product.bestseller = bestseller;
        if (stock !== undefined) product.stock = Number(stock);

        // Save the updated product
        await product.save();

        console.log("✅ Product updated successfully:", product.name);
        
        res.status(200).json({ 
            success: true, 
            message: "Product updated successfully",
            product 
        });
    } catch (error) {
        console.error("❌ Update product error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
};

export { SingleProduct, addProduct, removeProduct, listProduct, updateProduct };
