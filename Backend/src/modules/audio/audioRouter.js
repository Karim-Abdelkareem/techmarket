import express from "express";
import * as audioController from "./audioController.js";
import { upload } from "../../config/cloudinary.js";

const router = express.Router();

const uploadFields = [
  {
    name: "image",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 10,
  },
];

router
  .route("/")
  .post(upload.fields(uploadFields), audioController.createAudio)
  .get(audioController.getAllAudios);

router
  .route("/:id")
  .get(audioController.getAudioById)
  .put(upload.fields(uploadFields), audioController.updateAudio)
  .delete(audioController.deleteAudio);

export default router;
