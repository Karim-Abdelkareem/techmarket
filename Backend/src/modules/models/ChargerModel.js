import mongoose from "mongoose";
import Product from "../product/productModel.js";

const chargerSchema = new mongoose.Schema({
  input: String,
  power: String,
  color: String,
  chargerType: String,
  features: [String],
});
export const Charger = Product.discriminator("Charger", chargerSchema);
