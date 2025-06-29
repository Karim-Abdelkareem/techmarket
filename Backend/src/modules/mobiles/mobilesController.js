import Mobiles from "./mobilesModel.js";
import Category from "../category/CategoryModel.js";
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../../utils/appError.js";

// CREATE
export const createMobile = expressAsyncHandler(async (req, res, next) => {
  const files = req.files;
  req.body.image = files?.image?.[0]?.path || null;
  req.body.images = files?.images?.map((file) => file.path) || [];
  
  // Set dealer from authenticated user
  if (req.user) {
    req.body.dealer = req.user.id;
  }
  
  const data = await Mobiles.create(req.body);
  res.status(201).json({
    status: "success",
    data,
  });
});

// READ ALL
export const getAllMobiles = expressAsyncHandler(async (req, res, next) => {
  const data = await Mobiles.find()
    .populate("company", "name logo")
    .populate("category", "name image")
    .populate("subCategory", "name")
    .populate("dealer", "name logo");
  res.status(200).json({
    status: "success",
    data,
  });
});

// READ ONE
export const getMobileById = expressAsyncHandler(async (req, res, next) => {
  const data = await Mobiles.findById(req.params.id);
  if (!data) {
    return next(new AppError("Mobile not found", 404));
  }
  res.status(200).json({
    status: "success",
    data,
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

export const findBySubCategoryId = expressAsyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await Category.findById(id);
    if (!subCategory) return next(new AppError("Subcategory Not Found!", 404));
    const data = await Mobiles.find({ subCategory });
    res.status(200).json({
      status: "success",
      data,
    });
  }
);
