import Message from "./messageModule.js";
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
