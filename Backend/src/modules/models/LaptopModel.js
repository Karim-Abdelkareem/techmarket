import mongoose from "mongoose";
import Product from "../product/productModel.js";

const laptopSchema = new mongoose.Schema({
  laptopType: {
    type: String,
    enum: ["Student", "Professional", "Gaming", "X360", "Business", "MacBook"],
    required: true,
  },
  color: String,
  processor: String,
  ram: String,
  hardDisk: String,
  graphicsCard: String,
  display: String,
  connectivity: String,
  speaker: String,
  ioPorts: String,
  operatingSystem: String,
  warranty: String,
});
export const Laptop = Product.discriminator("Laptop", laptopSchema);
