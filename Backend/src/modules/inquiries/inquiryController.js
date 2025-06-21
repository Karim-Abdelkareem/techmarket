import expressAsyncHandler from "express-async-handler";
import Inquiry from "./inquiryModel.js";
import Dealer from "../dealer/dealerModel.js";
import { AppError } from "../../utils/appError.js";

// Create Inquiry
export const createInquiry = expressAsyncHandler(async (req, res, next) => {
  const { name, email, phone, dealer } = req.body;

  if (!name || !email || !phone || !dealer) {
    return next(new AppError("All fields are required", 400));
  }

  const dealerExists = await Dealer.findById(dealer);
  if (!dealerExists) {
    return next(new AppError("Dealer not found", 404));
  }

  const inquiry = await Inquiry.create({ name, email, phone, dealer });

  res.status(201).json({
    status: "success",
    data: { inquiry },
  });
});

// Get All Inquiries
export const getAllInquiries = expressAsyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find().populate("dealer", "name");
  res.status(200).json({ status: "success", data: { inquiries } });
});

// Get Inquiry by ID
export const getInquiryById = expressAsyncHandler(async (req, res, next) => {
  const inquiry = await Inquiry.findById(req.params.id).populate("dealer", "name");
  if (!inquiry) return next(new AppError("Inquiry not found", 404));
  res.status(200).json({ status: "success", data: { inquiry } });
});

// Delete Inquiry by Id
export const deleteInquiry = expressAsyncHandler(async (req, res, next) => {
  const deleted = await Inquiry.findByIdAndDelete(req.params.id);
  if (!deleted) return next(new AppError("Inquiry not found", 404));
  res.status(204).end();
});
