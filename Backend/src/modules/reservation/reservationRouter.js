import express from "express";
import * as reservationController from "./reservationController.js";
import { protect } from "../../middleware/authorization.js";

const router = express.Router();

router.route("/").post(protect, reservationController.createReservation);

router
  .route("/referral")
  .post(protect, reservationController.getReservationsByReferralCode);

router.route("/user").get(protect, reservationController.getUserReservations);

router
  .route("/:id")
  .patch(protect, reservationController.updateReservationStatus);

export default router;
