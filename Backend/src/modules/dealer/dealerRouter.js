import express from "express";
import * as dealerController from "./dealerController.js";

const router = express.Router();

router.route("/").post(dealerController.createDealer);
router.route("/").get(dealerController.getAllDealers);


export default router;
