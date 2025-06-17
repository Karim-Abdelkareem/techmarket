import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  logo: {
    type: String,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  brife: {
    type: String,
  },
  location: {
    type: String,
  },
});

const Company = mongoose.model("Company", companySchema);
export default Company;
