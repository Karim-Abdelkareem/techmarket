import mongoose, { connect } from "mongoose";

const laptopSchema = new mongoose.Schema(
  {
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
    subCategory: {
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
    brand: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    processor: {
      type: String,
      required: true,
    },
    ram: {
      type: String,
      required: true,
    },
    hardDisk: {
      type: String,
      required: true,
    },
    graphicsCard: {
      type: String,
      required: true,
    },
    display: {
      type: String,
      required: true,
    },
    connectivity: {
      type: String,
      required: true,
    },
    speaker: {
      type: String,
      required: true,
    },
    ioPorts: {
      type: String,
      required: true,
    },
    operatingSystem: {
      type: String,
      required: true,
    },
    warranty: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
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
  },
  { timestamps: true }
);

const Laptop = mongoose.model("Laptop", laptopSchema);
export default Laptop;
