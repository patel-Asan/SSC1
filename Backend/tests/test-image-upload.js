import { v2 as cloudinary } from "cloudinary";
import 'dotenv/config';

const testCloudinaryUpload = async () => {
  try {
    console.log('🧪 Testing Cloudinary upload...');
    
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY
    });

    // Test upload with a simple URL
    const testImageUrl = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center";
    
    const result = await cloudinary.uploader.upload(testImageUrl, {
      resource_type: "image",
      folder: "ecommerce-test"
    });

    console.log('✅ Cloudinary upload successful!');
    console.log('📸 Uploaded image URL:', result.secure_url);
    console.log('🆔 Public ID:', result.public_id);
    
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error.message);
    console.error('🔍 Error details:', error);
  }
};

testCloudinaryUpload(); 