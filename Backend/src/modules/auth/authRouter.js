import express from "express";
import { register, login } from "./authController.js";
import { upload, uploadMiddleware } from "../../config/cloudinary.js";

const router = express.Router();

// Define routes for user registration and login
router.post("/register", upload.single("profilePicture"), register);
router.post("/login", login);

// Export the router to be used in other parts of the application
export default router;
