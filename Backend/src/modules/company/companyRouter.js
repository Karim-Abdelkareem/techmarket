import express from "express";
import * as companyController from "./companyController.js";

const router = express.Router();

router.route("/").post(companyController.createCompany);

export default router;
