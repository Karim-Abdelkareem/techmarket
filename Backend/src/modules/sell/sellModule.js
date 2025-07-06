import mongoose from "mongoose";

const sellSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "MobileTablet",
        "Accessories",
        "Wearable",
        "Audio",
        "Laptops",
        "Gaming",
      ],
    },
    subCategory: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const sellModel = mongoose.model("Sell", sellSchema);
export default sellModel;
