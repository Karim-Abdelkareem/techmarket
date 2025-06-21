import mongoose from "mongoose";
import Product from "../product/productModel.js";

const mobileTabletSchema = new mongoose.Schema({
  deviceType: {
    type: String,
    enum: ["Mobile", "Tablet"],
    required: true,
  },
  color: String,
  simCard: String,
  screen: String,
  ram: String,
  internalMemory: String,
  rearCamera: String,
  selfieCamera: String,
  chipset: String,
  cpu: String,
  cpuSpeedGHz: Number,
  gpu: String,
  operatingSystem: String,
  productWarranty: String,
  videoResolutions: String,
  connectivity: String,
  sensor: String,
});

export default Product.discriminator("MobileTablet", mobileTabletSchema);
