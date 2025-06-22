import express from "express";
import * as productController from "./productController.js";
import { upload } from "../../config/cloudinary.js";
import { dynamicProductValidation } from "../../middleware/validate.js";
import { protect, restrictTo } from "../../middleware/authorization.js";

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
  .post(
    protect,
    restrictTo("moderator", "admin"),
    upload.fields(uploadFelds),
    dynamicProductValidation,
    productController.createProudct
  );

router
  .route("/:id")
  .get(productController.getProductById)
  .patch(
    protect,
    restrictTo("moderator", "admin"),
    upload.fields(uploadFelds),
    dynamicProductValidation,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

export default router;
