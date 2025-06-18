import Mobiles from "./mobilesModel.js";
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../../utils/appError.js";

// CREATE
export const createMobile = expressAsyncHandler(async (req, res, next) => {
  const files = req.files;
  req.body.image = files?.image?.[0]?.path || null;
  req.body.images = files?.images?.map((file) => file.path) || [];
  const mobile = await Mobiles.create(req.body);
  res.status(201).json({
    status: "success",
    data: { mobile },
  });
});

// READ ALL
export const getAllMobiles = expressAsyncHandler(async (req, res, next) => {
  const mobiles = await Mobiles.find()
    .populate("company", "name logo")
    .populate("category", "name image")
    .populate("dealer", "name logo");
  res.status(200).json({
    status: "success",
    data: { mobiles },
  });
});

// READ ONE
export const getMobileById = expressAsyncHandler(async (req, res, next) => {
  const mobile = await Mobiles.findById(req.params.id);
  if (!mobile) {
    return next(new AppError("Mobile not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { mobile },
  });
});

// UPDATE
export const updateMobile = expressAsyncHandler(async (req, res, next) => {
  const files = req.files;
  if (files?.image) {
    req.body.image = files.image[0].path;
  }
  if (files?.images) {
    req.body.images = files.images.map((file) => file.path);
  }
  const mobile = await Mobiles.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!mobile) {
    return next(new AppError("Mobile not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { mobile },
  });
});

// DELETE
export const deleteMobile = expressAsyncHandler(async (req, res, next) => {
  const mobile = await Mobiles.findByIdAndDelete(req.params.id);
  if (!mobile) {
    return next(new AppError("Mobile not found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
