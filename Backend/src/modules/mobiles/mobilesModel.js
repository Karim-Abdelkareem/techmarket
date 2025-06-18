import mongoose from "mongoose";

const mobilesSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  dealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dealer",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  simCard: {
    type: Number,
    required: true,
  },
  screen: {
    type: String,
    required: true,
  },
  ram: {
    type: String,
    required: true,
  },
  internalMerory: {
    type: String,
    required: true,
  },
  rearCamera: {
    type: String,
    required: true,
  },
  selfieCamera: {
    type: String,
    required: true,
  },
  chipset: {
    type: String,
    required: true,
  },
  cpu: {
    type: String,
    required: true,
  },
  cupSpeed: {
    type: String,
    required: true,
  },
  gpu: {
    type: String,
    required: true,
  },
  operatingSystem: {
    type: String,
    required: true,
  },
  productWarranty: {
    type: String,
    required: true,
  },
  videoReslution: {
    type: String,
    required: true,
  },
  connectivity: {
    type: String,
    required: true,
  },
  sensor: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Mobiles = mongoose.model("Mobiles", mobilesSchema);
export default Mobiles;
