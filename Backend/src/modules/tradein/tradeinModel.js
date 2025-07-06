import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    specs: {
      type: mongoose.Schema.Types.Mixed, // Flexible for dynamic fields
      required: true,
    },
    replacement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const TradeIn = mongoose.model("TradeIn", tradeSchema);
export default TradeIn;
