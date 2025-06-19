import express from "express";
import * as accessoryController from "./accessoryController.js";

const router = express.Router();

router
  .route("/")
  .post(accessoryController.createAccessory)
  .get(accessoryController.getAllAccessories);

router
  .route("/:id")
  .get(accessoryController.getAccessoryById)
  .put(accessoryController.updateAccessory)
  .delete(accessoryController.deleteAccessory);

export default router;
