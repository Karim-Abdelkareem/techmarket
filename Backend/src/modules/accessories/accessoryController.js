import Accessory from "./accessoryModel.js";
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../../utils/appError.js";

// Create
export const createAccessory = expressAsyncHandler(async (req, res, next) => {
  const accessory = new Accessory(req.body);

  // Optional: validate required fields for each type if needed

  await accessory.save();
  res.status(201).json({
    status: "success",
    data: { accessory },
  });
});

// Get All
export const getAllAccessories = expressAsyncHandler(async (req, res) => {
  const accessories = await Accessory.find().populate("dealer", "name");
  res.status(200).json({
    status: "success",
    data: { accessories },
  });
});

// Get One
export const getAccessoryById = expressAsyncHandler(async (req, res, next) => {
  const accessory = await Accessory.findById(req.params.id).populate("dealer", "name");

  if (!accessory) {
    return next(new AppError("Accessory not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { accessory },
  });
});

// Update
export const updateAccessory = expressAsyncHandler(async (req, res, next) => {
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

// Delete
export const deleteAccessory = expressAsyncHandler(async (req, res, next) => {
  const deleted = await Accessory.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return next(new AppError("Accessory not found", 404));
  }

  res.status(204).end(); 
});

