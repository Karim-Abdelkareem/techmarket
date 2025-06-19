import Category from "./CategoryModel.js";
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../../utils/appError.js";

// Create Category
export const createCategory = expressAsyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const image = req.file?.path || null;

  if (!name) {
    return next(new AppError("Category name is required", 400));
  }

  const category = new Category({ name, image });
  await category.save();

  res.status(201).json({ status: "success", data: { category } });
});

// Create Subcategory
export const createSubCategory = expressAsyncHandler(async (req, res, next) => {
  const { name, parent } = req.body;
  const image = req.file?.path || null;

  if (!name || !parent) {
    return next(new AppError("Name and parent category ID are required", 400));
  }

  const parentCategory = await Category.findById(parent);
  if (!parentCategory) {
    return next(new AppError("Parent category not found", 404));
  }

  const subCategory = new Category({ name, image, parent: parentCategory._id });
  await subCategory.save();

  res.status(201).json({ status: "success", data: { subCategory } });
});

// Get All Categories (with subcategories)
export const getAllCategories = expressAsyncHandler(async (req, res) => {
  const categories = await Category.find({ parent: null }).populate("subcategories");

  res.status(200).json({ status: "success", data: { categories } });
});

// Get Category by ID
export const getCategoryById = expressAsyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
    .populate("parent", "name slug")
    .populate("subcategories");

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({ status: "success", data: { category } });
});

// Update Category
export const updateCategory = expressAsyncHandler(async (req, res, next) => {
  const image = req.file?.path || req.body.image;
  const { name, parent } = req.body;

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, image, parent: parent || null },
    { new: true, runValidators: true }
  );

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({ status: "success", data: { category } });
});


export const deleteCategory = expressAsyncHandler(async (req, res, next) => {
  const subcategories = await Category.find({ parent: req.params.id });
  if (subcategories.length > 0) {
    return next(new AppError("Cannot delete a category with subcategories", 400));
  }

  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(204).end(); // No content
});
