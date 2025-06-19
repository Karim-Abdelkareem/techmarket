import Laptop from "./laptopModel.js";
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../../utils/appError.js";
import Category from "../category/CategoryModel.js";

// Create a new laptop
export const createLaptop = expressAsyncHandler(async (req, res, next) => {
  const files = req.files;
  req.body.image = files?.image?.[0]?.path || null;
  req.body.images = files?.images?.map((file) => file.path) || [];
  const laptop = await Laptop.create(req.body);
  res.status(201).json({ status: "success", data: laptop });
});

// Get all laptops
export const getAllLaptops = expressAsyncHandler(async (req, res, next) => {
  const laptops = await Laptop.find()
    .populate("company", "name logo")
    .populate("category", "name image")
    .populate("subCategory", "name")
    .populate("dealer", "name logo");
  res.status(200).json({ status: "success", data: laptops });
});

// Get a laptop by ID
export const getLaptopById = expressAsyncHandler(async (req, res, next) => {
  const laptop = await Laptop.findById(req.params.id);
  if (!laptop) {
    return next(new AppError("Laptop not found", 404));
  }
  res.status(200).json({ status: "success", data: laptop });
});

// Update a laptop
export const updateLaptop = expressAsyncHandler(async (req, res, next) => {
  const files = req.files;
  if (files?.image) {
    req.body.image = files.image[0].path;
  }
  if (files?.images) {
    req.body.images = files.images.map((file) => file.path);
  }
  const laptop = await Laptop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!laptop) {
    return next(new AppError("Laptop not found", 404));
  }
  res.status(200).json({ status: "success", data: laptop });
});

// Delete a laptop
export const deleteLaptop = expressAsyncHandler(async (req, res, next) => {
  const laptop = await Laptop.findByIdAndDelete(req.params.id);
  if (!laptop) {
    return next(new AppError("Laptop not found", 404));
  }
  res.status(204).json({ status: "success", data: null });
});

// Get all laptops by category ID
export const getLaptopsByCategoryId = expressAsyncHandler(
  async (req, res, next) => {
    const subCategory = await Category.findById(req.params.categoryId);
    if (!subCategory) {
      return next(new AppError("Subcategory not found", 404));
    }
    const laptops = await Laptop.find({ subCategory })
      .populate("company", "name logo")
      .populate("category", "name image")
      .populate("subCategory", "name")
      .populate("dealer", "name logo");
    res.status(200).json({ status: "success", data: laptops });
  }
);
