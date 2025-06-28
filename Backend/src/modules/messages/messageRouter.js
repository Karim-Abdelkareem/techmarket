import express from "express";
import * as messageController from "./messageController.js";
import { protect } from "../../middleware/authorization.js";

const router = express.Router();

router
  .route("/")
  .post(protect, messageController.sendMessage)
  .get(protect, messageController.getAllMessages);

router
  .route("/:id")
  .get(messageController.getMessage)
  .patch(messageController.updateMessage)
  .delete(messageController.deleteMessage);
