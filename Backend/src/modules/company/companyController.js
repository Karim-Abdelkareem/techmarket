import expressAsyncHandler from "express-async-handler";
import Company from "./companyModel.js";
import { AppError } from "../../utils/appError.js";

// Create
export const createCompany = expressAsyncHandler(async (req, res, next) => {
  /*Spilling Her in brife was not rigth */
  const { name, brife, location } = req.body;
  const logo = req.file?.path || null;

  // We Make Errors Like This To Ensure That All Required Fields Are Provided
  if (!name || !brife || !location) {
    next(
      new AppError(
        "Please provide all required fields: name, brief, and location"
      )
    );
  }

  const company = new Company({
    name,
    brife,
    location,
    logo: logo || null,
  });

  await company.save();

  res.status(201).json({ status: "success", data: { company } });
});

// Get All
export const getAllCompanies = expressAsyncHandler(async (req, res) => {
  const companies = await Company.find();
  res.status(200).json({ status: "success", data: { companies } });
});

// Get One
export const getCompanyById = expressAsyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  //Change the error her as told
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }
  res.status(200).json({ status: "success", data: { company } });
});

// Update
//Search for findByIdAndUpdate method in mongoose
export const updateCompany = expressAsyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  const logo = req.file?.path;
  company.name = req.body.name || company.name;
  company.brife = req.body.brief || company.brife;
  company.location = req.body.location || company.location;
  company.logo = logo || company.logo;

  const updated = await company.save();

  res.status(200).json({ status: "success", data: { company: updated } });
});

// Delete
//Search for findByIdAndDelete method in mongoose
export const deleteCompany = expressAsyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  await company.deleteOne();
  res.status(200).json({ status: "success", message: "Company deleted" });
});
