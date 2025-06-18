import express from "express";
import * as categoryController from "./categoryController.js";
import { upload } from "../../config/cloudinary.js";

const Router = express.Router();

Router.route("/")
  .post(upload.single("image"), categoryController.createCategory)
  .get(categoryController.getAllCategories);

Router.route("/:id")
  .get(categoryController.getCategoryById)
  .put(upload.single("image"), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

Router.post(
  "/subcategory",
  upload.single("image"),
  categoryController.createSubCategory
);
export default Router;
