import mongoose from "mongoose";

const accessorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "Cable",
        "Charger",
        "PowerBank",
        "CaseCover",
        "ScreenProtector"
      ],
    },
    brand: { type: String },
    features: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    image: { type: String },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dealer",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    details: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model("Accessory", accessorySchema);
