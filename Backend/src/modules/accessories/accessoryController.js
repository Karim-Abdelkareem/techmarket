import Accessory from "./accessoryModel.js";
import Category from "../category/CategoryModel.js";
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../../utils/appError.js";

// Create Accessory
export const createAccessory = expressAsyncHandler(async (req, res, next) => {
  const { category, subCategory } = req.body;

  if (category && !(await Category.findById(category))) {
    return next(new AppError("Invalid category ID", 400));
  }

  if (subCategory && !(await Category.findById(subCategory))) {
    return next(new AppError("Invalid subcategory ID", 400));
  }

  const accessory = new Accessory(req.body);
  await accessory.save();

  res.status(201).json({
    status: "success",
    data: { accessory },
  });
});

// Get All Accessories
export const getAllAccessories = expressAsyncHandler(async (req, res) => {
  const accessories = await Accessory.find()
    .populate("dealer", "name")
    .populate("category", "name")
    .populate("subCategory", "name");

  res.status(200).json({
    status: "success",
    data: { accessories },
  });
});

// Get Accessory by ID
export const getAccessoryById = expressAsyncHandler(async (req, res, next) => {
  const accessory = await Accessory.findById(req.params.id)
    .populate("dealer", "name")
    .populate("category", "name")
    .populate("subCategory", "name");

  if (!accessory) {
    return next(new AppError("Accessory not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { accessory },
  });
});

// Update Accessory
export const updateAccessory = expressAsyncHandler(async (req, res, next) => {
  const { category, subCategory } = req.body;

  if (category && !(await Category.findById(category))) {
    return next(new AppError("Invalid category ID", 400));
  }

  if (subCategory && !(await Category.findById(subCategory))) {
    return next(new AppError("Invalid subcategory ID", 400));
  }

  const updated = await Accessory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return next(new AppError("Accessory not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { accessory: updated },
  });
});

// Delete Accessory
export const deleteAccessory = expressAsyncHandler(async (req, res, next) => {
  const deleted = await Accessory.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return next(new AppError("Accessory not found", 404));
  }

  res.status(204).end();
});
