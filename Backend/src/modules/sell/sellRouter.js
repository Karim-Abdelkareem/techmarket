import express from "express";
import * as sellController from "./sellController.js";

const router = express.Router();

router.route("/").post(sellController.createSell).get(sellController.getSells);
router
  .route("/:id")
  .get(sellController.getSellById)
  .patch(sellController.updateSell)
  .delete(sellController.deleteSell);

export default router;
