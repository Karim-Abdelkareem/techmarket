import express from "express";
import * as companyController from "./companyController.js";
import { upload, uploadMiddleware } from "../../config/cloudinary.js";

const router = express.Router();

router.post("/", upload.single("logo"), companyController.createCompany);

// Get all companies
router.get("/", companyController.getAllCompanies);

// Get a specific company by ID
router.get("/:id", companyController.getCompanyById);

// Update a company by ID (with optional logo update)
router.put("/:id", upload.single("logo"), companyController.updateCompany);

// Delete a company by ID
router.delete("/:id", companyController.deleteCompany);

export default router;
