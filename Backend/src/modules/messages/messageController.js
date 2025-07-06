import Message from "./messageModule.js";
import User from "../user/userModel.js";
import { AppError } from "../../utils/appError.js";
import expressAsyncHandler from "express-async-handler";

export const sendMessage = expressAsyncHandler(async (req, res, next) => {
  const { to, message } = req.body;
  const newMessage = await Message.create({
    from: req.user._id,
    to,
    message,
  });
  res.status(201).json({
    status: "success",
    message: "Message sent successfully",
    newMessage,
  });
});

export const getAllMessages = expressAsyncHandler(async (req, res, next) => {
  const messages = await Message.find({ to: req.user._id })
    .populate("from", "name")
    .populate("to", "name")
    .sort({ createdAt: -1 });
  res.status(200).json({
    status: "success",
    messages,
  });
});

export const getMessage = expressAsyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id)
    .populate("from", "name")
    .populate("to", "name");

  if (!message) {
    return next(new AppError("Message not found", 404));
  }

  res.status(200).json({
    status: "success",
    message,
  });
});

export const updateMessage = expressAsyncHandler(async (req, res, next) => {
  const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!message) {
    return next(new AppError("Message not found", 404));
  }
  res.status(200).json({
    status: "success",
    message,
  });
});

export const deleteMessage = expressAsyncHandler(async (req, res, next) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) {
    return next(new AppError("Message not found", 404));
  }
  res.status(204).json({
    status: "success",
    message: null,
  });
});

// Get all users (for admin/moderator messaging)
export const getAllUsers = expressAsyncHandler(async (req, res, next) => {
  const users = await User.find({ role: "user" })
    .select("name email role")
    .sort({ name: 1 });
  
  res.status(200).json({
    status: "success",
    data: users,
  });
});

// Send message to user (admin/moderator)
export const sendMessageToUser = expressAsyncHandler(async (req, res, next) => {
  const { to, message } = req.body;
  
  // Verify the target user exists and is a regular user
  const targetUser = await User.findById(to);
  if (!targetUser) {
    return next(new AppError("User not found", 404));
  }
  
  if (targetUser.role !== "user") {
    return next(new AppError("Can only send messages to regular users", 400));
  }

  const newMessage = await Message.create({
    from: req.user._id,
    to,
    message,
  });

  const populatedMessage = await Message.findById(newMessage._id)
    .populate("from", "name email")
    .populate("to", "name email");

  res.status(201).json({
    status: "success",
    message: "Message sent successfully",
    data: populatedMessage,
  });
});

// Get conversation history (admin/moderator)
export const getConversationHistory = expressAsyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  
  const messages = await Message.find({
    $or: [
      { from: req.user._id, to: userId },
      { from: userId, to: req.user._id }
    ]
  })
    .populate("from", "name email")
    .populate("to", "name email")
    .sort({ createdAt: 1 });

  res.status(200).json({
    status: "success",
    data: messages,
  });
});
