import mongoose from "mongoose";

const dealerSchema = new mongoose.Schema(
  {
    logo: { type: String },
    name: { type: String },
    brief: { type: String },
    location: {
      text: { type: String },
      link: { type: String },
    },
  },
  { timestamps: true }
);

const Dealer = mongoose.model("Dealer", dealerSchema);
export default Dealer;
