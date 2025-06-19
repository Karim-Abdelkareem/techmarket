import expressAsyncHandler from "express-async-handler";
import Company from "./companyModel.js";
import { AppError } from "../../utils/appError.js";

// Create
export const createCompany = expressAsyncHandler(async (req, res, next) => {
  const { name, brife, location } = req.body;
  const logo = req.file?.path || null;

  if (!name || !brife || !location) {
    return next(
      new AppError(
        "Please provide all required fields: name, brief, and location",
        400
      )
    );
  }

  const company = new Company({ name, brife, location, logo });
  await company.save();

  res.status(201).json({ status: "success", data: { company } });
});

// Get All
export const getAllCompanies = expressAsyncHandler(async (req, res) => {
  const companies = await Company.find();
  res.status(200).json({ status: "success", data: { companies } });
});

// Get One
export const getCompanyById = expressAsyncHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  res.status(200).json({ status: "success", data: { company } });
});

// Update
export const updateCompany = expressAsyncHandler(async (req, res, next) => {
  const logo = req.file?.path;

  const updatedCompany = await Company.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      brife: req.body.brief,
      location: req.body.location,
      ...(logo && { logo }),
    },
    { new: true, runValidators: true }
  );

  if (!updatedCompany) {
    return next(new AppError("Company not found", 404));
  }

  res.status(200).json({ status: "success", data: { company: updatedCompany } });
});

// Delete
export const deleteCompany = expressAsyncHandler(async (req, res, next) => {
  const deletedCompany = await Company.findByIdAndDelete(req.params.id);

  if (!deletedCompany) {
    return next(new AppError("Company not found", 404));
  }

  res.status(204).end(); 
});
