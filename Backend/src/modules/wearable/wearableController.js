import Wearable from "./WearableModel.js";
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../../utils/appError.js";
import Category from "../category/CategoryModel.js";

// Create a new wearable
export const createWearable = expressAsyncHandler(async (req, res, next) => {
  const files = req.files;
  req.body.image = files?.image?.[0]?.path || null;
  req.body.images = files?.images?.map((file) => file.path) || [];
  const wearable = await Wearable.create(req.body);
  res.status(201).json({ status: "success", data: { wearable } });
});

// Get all wearables
export const getAllWearables = expressAsyncHandler(async (req, res, next) => {
  const wearables = await Wearable.find()
    .populate("category", "name image")
    .populate("subCategory", "name")
    .populate("dealer", "name logo");
  res.status(200).json({ status: "success", data: { wearables } });
});

// Get a wearable by ID
export const getWearableById = expressAsyncHandler(async (req, res, next) => {
  const wearable = await Wearable.findById(req.params.id);
  if (!wearable) {
    return next(new AppError("Wearable not found", 404));
  }
  res.status(200).json({ status: "success", data: { wearable } });
});

// Update a wearable
export const updateWearable = expressAsyncHandler(async (req, res, next) => {
  const files = req.files;
  if (files?.image) {
    req.body.image = files.image[0].path;
  }
  if (files?.images) {
    req.body.images = files.images.map((file) => file.path);
  }
  const wearable = await Wearable.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!wearable) {
    return next(new AppError("Wearable not found", 404));
  }
  res.status(200).json({ status: "success", data: { wearable } });
});

// Delete a wearable
export const deleteWearable = expressAsyncHandler(async (req, res, next) => {
  const wearable = await Wearable.findByIdAndDelete(req.params.id);
  if (!wearable) {
    return next(new AppError("Wearable not found", 404));
  }
  res.status(204).json({ status: "success", data: null });
});

//Get A Wearable By Subcategory.
export const getBySubCategoryId = expressAsyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await Category.findById(id);
    if (!subCategory) return next(new AppError("Subcategory not found!", 404));
    const data = await Wearable.find({ subCategory });
    res.status(200).json({
      status: "success",
      data,
    });
  }
);
