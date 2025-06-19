import express from "express";
import * as wearableController from "./wearableController.js";
import { upload } from "../../config/cloudinary.js";

const router = express.Router();

const uploadFelds = [
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
  .post(upload.fields(uploadFelds), wearableController.createWearable)
  .get(wearableController.getAllWearables);

router
  .route("/:id")
  .get(wearableController.getWearableById)
  .put(upload.fields(uploadFelds), wearableController.updateWearable)
  .delete(wearableController.deleteWearable);

router.get("/sub/:id", wearableController.getBySubCategoryId);

export default router;
