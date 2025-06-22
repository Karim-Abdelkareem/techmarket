import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: {
      type: String,
    },
    category: {
      type: String,
      enum: ["Mobile", "Tablet", "Laptop", "Accessories", "Wearables", "Audio"],
      required: true,
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brand: {
      type: String,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
    },
    images: [String],
    productCode: { type: String, unique: true, required: true },
    referralCode: { type: String, unique: true, sparse: true },
    discount: {
      type: Number,
      default: 0,
    },
    priceAfterDiscount: {
      type: Number,
      default: 0,
    },
    isExclusive: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    discriminatorKey: "productType",
    collection: "products",
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (this.discount > 0 && this.price) {
    this.priceAfterDiscount = Math.round(
      this.price - (this.price * this.discount) / 100
    );
  } else {
    this.priceAfterDiscount = this.price;
  }

  next();
});

productSchema.index({ name: "text", description: "text" });
productSchema.index({ productType: 1 });
productSchema.index({ brand: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
