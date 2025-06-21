import express from "express";
import * as inquiryController from "./inquiryController.js";

const router = express.Router();

router
  .route("/")
  .post(inquiryController.createInquiry)
  .get(inquiryController.getAllInquiries);

router
  .route("/:id")
  .get(inquiryController.getInquiryById)
  .delete(inquiryController.deleteInquiry);

export default router;