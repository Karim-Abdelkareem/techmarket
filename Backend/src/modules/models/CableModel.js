import mongoose from "mongoose";
import Product from "../product/productModel.js";
const cableSchema = new mongoose.Schema({
  from: String,
  to: String,
  cableLength: String,
  cableType: String,
  features: [String],
});
export const Cable = Product.discriminator("Cable", cableSchema);
