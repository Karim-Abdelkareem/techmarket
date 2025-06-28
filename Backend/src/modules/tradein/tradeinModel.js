import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  replacement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});
