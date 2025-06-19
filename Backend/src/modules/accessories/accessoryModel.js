import mongoose from "mongoose";

const accessorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Charger", "PowerBank", "CaseCover", "ScreenProtector", "Cable"],
    required: true,
  },
  name: { type: String, required: true },
  brand: { type: String },
  color: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  features: { type: [String] },

  // For Charger
  input: { type: String },
  power: { type: String },
  chargerType: { type: String },

  // For PowerBank
  capacity: { type: String },
  output: { type: String },
  powerBankType: { type: String },

  // For Case & Protector
  compatibleWith: { type: String },
  material: { type: String },

  // For Cable
  from: { type: String },
  to: { type: String },
  cableLength: { type: String },
  cableType: { type: String },

  // Dealer Reference
  dealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dealer",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Accessory", accessorySchema);
