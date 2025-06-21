import express from "express";
import * as productController from "./productController.js";
import { upload } from "../../config/cloudinary.js";

const router = express.Router();

const uploadFelds = [
  {
    name: "image",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 10,
  },
];

router
  .route("/")
  .get(productController.getProducts)
  .post(upload.fields(uploadFelds), productController.createProudct);

router
  .route("/:id")
  .get(productController.getProductById)
  .patch(upload.fields(uploadFelds), productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
