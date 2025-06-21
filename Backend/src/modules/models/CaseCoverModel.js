import mongoose from "mongoose";
import Product from "../product/productModel.js";

const caseCoverSchema = new mongoose.Schema({
  compatibleWith: String,
  color: String,
  material: String,
});
export const CaseCover = Product.discriminator("CaseCover", caseCoverSchema);
