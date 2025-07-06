import express from "express";
import {
  createTradeIn,
  //   getTradeInSpecs,
  getAllTradeIns,
  getUserTradeIns,
  getStoreTradeIns,
  changeTradeInStatus,
  approveTradeInRequest,
} from "./tradeinController.js";
import { protect, restrictTo } from "../../middleware/authorization.js"; // Uncomment if you have auth middleware

const router = express.Router();

// Get required specs for category/productType (for dynamic form)
// router.get("/specs", getTradeInSpecs);

// Create trade-in request
router.post("/", protect, createTradeIn); // If using auth
// router.post("/", createTradeIn);

// Get all trade-ins (admin)
router.get("/", protect, restrictTo("admin", "moderator"), getAllTradeIns); // If using auth
// router.get("/", getAllTradeIns);

// Get user's trade-ins
router.get("/my", protect, getUserTradeIns); // If using auth
// router.get("/my", getUserTradeIns);

// Get store's trade-ins
router.get("/store", protect, getStoreTradeIns);

// change trade-in status
router.put("/status", protect, changeTradeInStatus);

// Approve/Reject trade-in request (Admin/Moderator)
router.put("/approve", protect, restrictTo("admin", "moderator"), approveTradeInRequest);

export default router;
