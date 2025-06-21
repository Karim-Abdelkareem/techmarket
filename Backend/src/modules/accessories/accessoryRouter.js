import express from "express";
import * as accessoryController from "./accessoryController.js";
import { upload } from "../../config/cloudinary.js";

const router = express.Router();

router
  .route("/")
  .post(upload.single("image"), accessoryController.createAccessory)
  .get(accessoryController.getAllAccessories);

router
  .route("/:id")
  .get(accessoryController.getAccessoryById)
  .put(upload.single("image"), accessoryController.updateAccessory)
  .delete(accessoryController.deleteAccessory);

export default router;
