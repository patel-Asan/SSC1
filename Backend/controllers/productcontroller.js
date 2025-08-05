import productModel from "../models/productmodel.js";
import path from "path";
import fs from "fs";

// Function to add a product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

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

        // Save images locally and get URLs
        const imagesUrl = [];
        
        for (let i = 0; i < images.length; i++) {
            const item = images[i];
            try {
                // Create uploads directory if it doesn't exist
                const uploadsDir = path.join(process.cwd(), 'uploads');
                if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true });
                }

                // Generate unique filename
                const timestamp = Date.now();
                const randomNum = Math.floor(Math.random() * 1000);
                const fileExtension = path.extname(item.originalname);
                const fileName = `product_${timestamp}_${randomNum}_${i}${fileExtension}`;
                const filePath = path.join(uploadsDir, fileName);

                // Copy file to uploads directory
                fs.copyFileSync(item.path, filePath);

                // Return the URL that can be accessed from the frontend
                const imageUrl = `http://localhost:4000/uploads/${fileName}`;
                imagesUrl.push(imageUrl);
                
                console.log(`✅ Image ${i + 1} uploaded: ${imageUrl}`);
                
            } catch (uploadError) {
                console.error(`❌ File upload error for image ${i + 1}:`, uploadError);
                // Fallback to placeholder if upload fails
                imagesUrl.push("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center");
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
        res.status(200).json({ 
            success: true, 
            products,
            count: products.length 
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
        const { id } = req.body; // Changed from req.params to req.body

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
        
        res.status(200).json({ 
            success: true, 
            product 
        });
    } catch (error) {
        console.error("Get single product error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

export { SingleProduct, addProduct, removeProduct, listProduct };
