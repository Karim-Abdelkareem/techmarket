import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
// Import environment variables
import dotenv from "dotenv";
dotenv.config();
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "TechMarket", // Specify the folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "gif"], // Allowed file formats
  },
});
// Create multer instance with Cloudinary storage
export const upload = multer({ storage: storage });
// Export the upload middleware
export const uploadMiddleware = upload.single("image"); // Use 'image' as the field name for the file upload
export default cloudinary; // Export Cloudinary instance for use in other modules
