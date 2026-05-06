import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  try {
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    
    if (!cloudinaryUrl) {
      throw new Error("CLOUDINARY_URL is not configured");
    }

    const urlMatch = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (urlMatch) {
      cloudinary.config({
        cloud_name: urlMatch[3],
        api_key: urlMatch[1],
        api_secret: urlMatch[2],
        secure: true
      });
    }
    
    console.log("✅ Cloudinary configured successfully");
  } catch (error) {
    console.error('❌ Failed to configure Cloudinary:', error.message);
    process.exit(1);
  }
};

export default connectCloudinary;