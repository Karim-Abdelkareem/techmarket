import expressAsyncHandler from "express-async-handler";
import Company from "./companyModel.js";

// Create
export const createCompany = expressAsyncHandler(async (req, res) => {
  const { name, brief, location } = req.body;
  const logo = req.file?.path || null;

  if (!name) {
    res.status(400);
    throw new Error("Company name is required");
  }

  const company = new Company({
    name,
    brief,
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
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }
  res.status(200).json({ status: "success", data: { company } });
});

// Update
export const updateCompany = expressAsyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  const logo = req.file?.path;
  company.name = req.body.name || company.name;
  company.brief = req.body.brief || company.brief;
  company.location = req.body.location || company.location;
  company.logo = logo || company.logo;

  const updated = await company.save();

  res.status(200).json({ status: "success", data: { company: updated } });
});

// Delete
export const deleteCompany = expressAsyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  await company.deleteOne();
  res.status(200).json({ status: "success", message: "Company deleted" });
}); 
