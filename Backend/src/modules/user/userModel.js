import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dlz30daw5/image/upload/v1750140703/cd4bd9b0ea2807611ba3a67c331bff0b_nloio1.jpg",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // boughtItems: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Item",
    //   },
    // ],
    // wishlist: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Item",
    //   },
    // ],
    // cart: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Item",
    //   },
    // ],
    // address: {
    //   type: String,
    //   default: "",
    // },
    // phone: {
    //   type: String,
    //   default: "",
    // },
  },
  { timestamps: true }
);

// Hash password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("update", async function (next) {
  const update = this.getUpdate();
  if (update && update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update && update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  next();
});

userSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate();
  if (update && update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create User model
const User = mongoose.model("User", userSchema);
export default User;
