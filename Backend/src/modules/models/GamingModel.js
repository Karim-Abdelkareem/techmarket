import mongoose from "mongoose";
import Product from "../product/productModel.js";

const gamingSchema = new mongoose.Schema({
  subType: {
    type: String,
    enum: ["Games", "Accounts", "PlayStation", "Controller", "Skin"],
    required: true,
  },
  type: {
    // Only for 'Accounts'
    type: String,
    enum: ["Primary", "Secondary"],
  },
  warranty: {
    // Only for 'PlayStation'
    type: String,
  },
});

export const Gaming = Product.discriminator("Gaming", gamingSchema);
