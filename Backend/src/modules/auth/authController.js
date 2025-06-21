import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../user/userModel.js";
import { AppError } from "../../utils/appError.js";

export const register = expressAsyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("User already exists", 400));
  }

  if (req.file) {
    const profilePicture = req.file.path;
    req.body.profilePicture = profilePicture;
  }
  if (!name || !email || !password) {
    return next(new AppError("Please provide all required fields", 400));
  }
  const user = new User({
    name,
    profilePicture: req.body.profilePicture,
    email,
    password,
    role,
  });
  await user.save();
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const login = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Invalid email", 401));
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError("Invalid password", 401));
  }
  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture || undefined,
      breif: user.breif || undefined,
      logo: user.logo || undefined,
      location: user.location || undefined,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});
