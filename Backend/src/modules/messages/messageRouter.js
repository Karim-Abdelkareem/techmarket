import express from "express";
import * as messageController from "./messageController.js";
import { protect, restrictTo } from "../../middleware/authorization.js";

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

// Admin/Moderator messaging routes
router.get("/users/all", protect, restrictTo("admin", "moderator"), messageController.getAllUsers);
router.post("/send-to-user", protect, restrictTo("admin", "moderator"), messageController.sendMessageToUser);
router.get("/conversation/:userId", protect, restrictTo("admin", "moderator"), messageController.getConversationHistory);

export default router;  
