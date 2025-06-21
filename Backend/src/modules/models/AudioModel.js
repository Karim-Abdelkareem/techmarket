import mongoose from "mongoose";
import Product from "../product/productModel.js";

const audioSchema = new mongoose.Schema({
  audioType: {
    type: String,
    enum: ["OverEar", "InEar", "Wireless"],
    required: true,
  },
  color: String,
  connectivity: String,
  company: String,
  features: [String],
  warranty: String,
});
export const Audio = Product.discriminator("Audio", audioSchema);
