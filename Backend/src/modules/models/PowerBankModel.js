import mongoose from "mongoose";
import Product from "../product/productModel.js";

const powerBankSchema = new mongoose.Schema({
  capacity: String,
  input: String,
  output: String,
  color: String,
  powerBankType: String,
  features: [String],
});
export const PowerBank = Product.discriminator("PowerBank", powerBankSchema);
