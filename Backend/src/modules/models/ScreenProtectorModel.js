import mongoose from "mongoose";
import Product from "../product/productModel.js";

const screenProtectorSchema = new mongoose.Schema({
  compatibleWith: String,
  color: String,
  material: String,
});
export const ScreenProtector = Product.discriminator(
  "ScreenProtector",
  screenProtectorSchema
);
