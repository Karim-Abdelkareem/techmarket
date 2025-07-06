import sellModel from "./sellModule.js";
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../../utils/appError.js";

export const createSell = expressAsyncHandler(async (req, res, next) => {
  const { fullName, phoneNumber, category, subCategory, description } =
    req.body;

  if (!fullName || !phoneNumber || !category) {
    return next(new AppError("Please provide all required fields", 400));
  }

  const newSell = await sellModel.create({
    fullName,
    phoneNumber,
    category,
    subCategory,
    description,
  });

  res.status(201).json({
    status: "success",
    data: {
      sell: newSell,
    },
  });
});

export const getSells = expressAsyncHandler(async (req, res, next) => {
  const sells = await sellModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: sells.length,
    data: {
      sells,
    },
  });
});

export const getSellById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const sell = await sellModel.findById(id);
  if (!sell) {
    return next(new AppError("Sell not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      sell,
    },
  });
});

export const updateSell = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { fullName, phoneNumber, category, subCategory, description } =
    req.body;

  const sell = await sellModel.findByIdAndUpdate(
    id,
    {
      fullName,
      phoneNumber,
      category,
      subCategory,
      description,
    },
    { new: true, runValidators: true }
  );

  if (!sell) {
    return next(new AppError("Sell not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      sell,
    },
  });
});

export const deleteSell = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const sell = await sellModel.findByIdAndDelete(id);
  if (!sell) {
    return next(new AppError("Sell not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
