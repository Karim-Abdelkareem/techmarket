import mongoose from "mongoose";

const wareableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for the wearable"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description for the wearable"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please provide a category ID for the wearable"],
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please provide a subcategory ID for the wearable"],
  },
  display: {
    type: String,
    required: [true, "Please provide a display type for the wearable"],
  },
  color: {
    type: String,
    required: [true, "Please provide a color for the wearable"],
  },
  connectivity: {
    type: String,
    required: [true, "Please provide a connectivity option for the wearable"],
  },
  brand: {
    type: String,
    required: [true, "Please provide a brand for the wearable"],
  },
  features: {
    type: String,
    required: [true, "Please provide features for the wearable"],
  },
  battary: {
    type: String,
    required: [true, "Please provide a battery type for the wearable"],
  },
  wantray: {
    type: String,
    required: [true, "Please provide a warranty period for the wearable"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price for the wearable"],
  },
  dealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dealer",
    required: [true, "Please provide a dealer ID for the wearable"],
  },
  quantity: {
    type: Number,
    required: [true, "Please provide a quantity for the wearable"],
    default: 0,
  },
  image: {
    type: String,
    required: [true, "Please provide an image URL for the wearable"],
  },
  images: {
    type: [String],
    required: [true, "Please provide an array of image URLs for the wearable"],
  },
});

const Wearable = mongoose.model("Wearable", wareableSchema);
export default Wearable;
