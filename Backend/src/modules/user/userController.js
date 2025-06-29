import User from "./userModel.js";
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../../utils/appError.js";
import { Features } from "../../utils/features.js";

export const createModerator = expressAsyncHandler(async (req, res, next) => {
  const {
    email,
    password,
    name,
    phoneNumber,
    brief,
    locationText,
    locationLink,
  } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(new AppError("Email already exists", 400));
  }
  let logo;
  if (req.file) {
    logo = req.file.path;
  }

  const newUser = await User.create({
    email,
    password,
    name,
    phoneNumber,
    logo,
    brief,
    location: {
      locationText,
      locationLink,
    },
    role: "moderator",
  });
  res
    .status(201)
    .json({ message: "Moderator created successfully", data: newUser });
});

export const getAllUsers = expressAsyncHandler(async (req, res, next) => {
  const features = new Features(User.find().select("-password"), req.query)
    .filter()
    .search()
    .sort()
    .fields()
    .pagination();

  const users = await features.mongooseQuery;

  const totalCount = await User.countDocuments();
  const totalPages = Math.ceil(totalCount / features.limit);
  const hasNextPage = features.page < totalPages;

  res.status(200).json({
    status: "success",
    totalCount,
    totalPages,
    currentPage: features.page,
    limit: features.limit,
    hasNextPage,
    data: users,
  });
});

export const getSingleUser = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({ status: "success", data: user });
});

export const updateSingleUser = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  if (req.file) {
    req.body.logo = req.file.path;
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({ status: "success", data: updatedUser });
});

export const deleteUser = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(204).json({ status: "success", data: null });
});
