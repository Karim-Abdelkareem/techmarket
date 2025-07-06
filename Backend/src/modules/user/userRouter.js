import express from "express";
import * as userController from "./userController.js";
import { upload } from "../../config/cloudinary.js";
import { protect, restrictTo } from "../../middleware/authorization.js";

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    restrictTo("admin"),
    upload.single("logo"),
    userController.createUser
  )
  .get(protect, restrictTo("admin"), userController.getAllUsers);

router
  .route("/:id")
  .get(protect, restrictTo("admin"), userController.getSingleUser)
  .patch(
    protect,
    restrictTo("admin"),
    upload.single("logo"),
    userController.updateSingleUser
  )
  .delete(protect, restrictTo("admin"), userController.deleteUser);

export default router;
