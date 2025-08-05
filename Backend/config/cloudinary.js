import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  try {
    const cloudName = process.env.CLOUDINARY_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_SECRET_KEY;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary credentials are not properly configured");
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });

    console.log("✅ Cloudinary configured successfully");
  } catch (error) {
    console.error('❌ Failed to configure Cloudinary:', error.message);
    process.exit(1);
  }
};

export default connectCloudinary;