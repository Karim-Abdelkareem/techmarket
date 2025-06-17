import express from "express";
import * as dealerController from "./dealerController.js";
import { upload, uploadMiddleware } from "../../config/cloudinary.js";

const router = express.Router();


router.post("/", upload.single("logo"), dealerController.createDealer);

// Get all dealers
router.get("/", dealerController.getAllDealers);

// Get a specific dealer by ID
router.get("/:id", dealerController.getDealerById);

// Update a dealer by ID (with optional logo update)
router.put("/:id", upload.single("logo"), dealerController.updateDealer);

// Delete a dealer by ID
router.delete("/:id", dealerController.deleteDealer);


export default router;
