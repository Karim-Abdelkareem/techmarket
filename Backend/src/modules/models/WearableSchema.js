import mongoose from "mongoose";
import Product from "../product/productModel.js";

const wearableSchema = new mongoose.Schema({
  wearableType: {
    type: String,
    enum: ["SmartBand", "SmartWatch"],
    required: true,
  },
  display: String,
  color: String,
  connectivity: String,
  features: [String],
  battery: String,
  warranty: String,
});
export const Wearable = Product.discriminator("Wearable", wearableSchema);
