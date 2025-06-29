import express from "express";
import * as analyticsController from "./analyticsController.js";
// import { protect, restrictTo } from '../../middleware/authorization.js'; // Uncomment to secure endpoints

const router = express.Router();

// router.use(protect); // Uncomment to require authentication
// router.use(restrictTo('admin')); // Uncomment to restrict to admin

router.get("/overview", analyticsController.getOverview);
router.get("/products", analyticsController.getProductStats);
router.get("/users", analyticsController.getUserStats);
// router.get('/sales', analyticsController.getSalesStats); // Uncomment if you add sales
router.get("/most-viewed", analyticsController.getMostViewedProducts);
router.get("/most-bought", analyticsController.getMostBoughtProducts);
router.get("/top-exclusive", analyticsController.getTopExclusiveProducts);
router.get("/dashboard", analyticsController.getDashboardAnalytics);

// Add route for total products per seller
router.get(
  "/total-products-per-seller",
  analyticsController.getTotalProductsPerSeller
);

export default router;
