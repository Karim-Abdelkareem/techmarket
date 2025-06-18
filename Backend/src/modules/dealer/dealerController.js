import expressAsyncHandler from "express-async-handler";
import Dealer from "./dealerModel.js";
import { AppError } from "../../utils/appError.js";

// CREATE
export const createDealer = expressAsyncHandler(async (req, res, next) => {
  const { name, brief, locationText, locationLink } = req.body;

  if (!name) {
    return next(new AppError("Dealer name is required", 400));
  }

  const dealer = new Dealer({
    name,
    logo: req.file?.path || null,
    brief,
    location: {
      text: locationText || "",
      link: locationLink || "",
    },
  });

  await dealer.save();

  res.status(201).json({
    status: "success",
    data: { dealer },
  });
});

// READ ALL
export const getAllDealers = expressAsyncHandler(async (req, res) => {
  const dealers = await Dealer.find();
  res.status(200).json({
    status: "success",
    data: { dealers },
  });
});

// READ ONE
export const getDealerById = expressAsyncHandler(async (req, res, next) => {
  const dealer = await Dealer.findById(req.params.id);

  if (!dealer) {
    return next(new AppError("Dealer not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { dealer },
  });
});

// UPDATE  by Id
export const updateDealer = expressAsyncHandler(async (req, res, next) => {
  const { name, brief, locationText, locationLink } = req.body;

  const updatedDealer = await Dealer.findByIdAndUpdate(
    req.params.id,
    {
      name,
      brief,
      location: {
        text: locationText,
        link: locationLink,
      },
      ...(req.file?.path && { logo: req.file.path }),
    },
    { new: true, runValidators: true }
  );

  if (!updatedDealer) {
    return next(new AppError("Dealer not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { dealer: updatedDealer },
  });
});

// DELETE By Id
export const deleteDealer = expressAsyncHandler(async (req, res, next) => {
  const deletedDealer = await Dealer.findByIdAndDelete(req.params.id);

  if (!deletedDealer) {
    return next(new AppError("Dealer not found", 404));
  }

  res.status(204).end(); 
});
