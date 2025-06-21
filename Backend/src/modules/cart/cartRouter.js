import express from "express";
import * as cartController from "./cartController.js";
import { protect } from "../../middleware/authorization.js";

const router = express.Router();

router
  .route("/")
  .get(protect, cartController.getLoggedUserCart)
  .post(protect, cartController.addProductToCart)
  .delete(protect, cartController.removeFromCart);

export default router;
