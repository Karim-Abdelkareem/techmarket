import Company from "./companyModel.js";

export const createCompany = async (req, res, next) => {
  try {
    const { name, logo } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    const company = new Company({
      name,
      logo: logo ? logo : null, // Handle optional logo
    });

    await company.save();

    res.status(201).json({
      status: "success",
      data: {
        company,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find();
    res.status(200).json({
      status: "success",
      data: {
        companies,
      },
    });
  } catch (error) {
    next(error);
  }
};
