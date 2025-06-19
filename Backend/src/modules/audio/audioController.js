import Audio from "./audioModel.js";
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../../utils/appError.js";

// Create a new audio
export const createAudio = expressAsyncHandler(async (req, res, next) => {
  const files = req.files;
  req.body.image = files?.image?.[0]?.path || null;
  req.body.images = files?.images?.map((file) => file.path) || [];

  const audio = await Audio.create(req.body);
  res.status(201).json({ status: "success", data: { audio } });
});

// Get all audios
export const getAllAudios = expressAsyncHandler(async (req, res, next) => {
  const audios = await Audio.find()
    .populate("company", "name logo")
    .populate("category", "name image")
    .populate("dealer", "name logo");

  res.status(200).json({ status: "success", data: { audios } });
});

// Get an audio by ID
export const getAudioById = expressAsyncHandler(async (req, res, next) => {
  const audio = await Audio.findById(req.params.id);
  if (!audio) {
    return next(new AppError("Audio not found", 404));
  }
  res.status(200).json({ status: "success", data: { audio } });
});

// Update an audio
export const updateAudio = expressAsyncHandler(async (req, res, next) => {
  const files = req.files;
  if (files?.image) {
    req.body.image = files.image[0].path;
  }
  if (files?.images) {
    req.body.audio = files?.images?.map((file) => file.path) || [];
  }

  const audio = await Audio.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!audio) {
    return next(new AppError("Audio not found", 404));
  }
  res.status(200).json({ status: "success", data: { audio } });
});

// Delete an audio
export const deleteAudio = expressAsyncHandler(async (req, res, next) => {
  const audio = await Audio.findByIdAndDelete(req.params.id);
  if (!audio) {
    return next(new AppError("Audio not found", 404));
  }
  res.status(204).json({ status: "success", data: null });
});
