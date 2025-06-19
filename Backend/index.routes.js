import { AppError } from "./src/utils/appError.js";
import globalErrorHandler from "./src/middleware/globalErrorHandler.js";
import authRouter from "./src/modules/auth/authRouter.js";
import companyRouter from "./src/modules/company/companyRouter.js";
import dealerRouter from "./src/modules/dealer/dealerRouter.js";
import categoryRouter from "./src/modules/category/categoryRouter.js";
import mobilesRouter from "./src/modules/mobiles/mobilesRouter.js";
import accessoryRouter from "./src/modules/accessories/accessoryRouter.js";
import wearableRouter from "./src/modules/wearable/wearableRouter.js";
import audioRouter from "./src/modules/audio/audioRouter.js";
import laptopRouter from "./src/modules/laptops/laptopRouter.js";
import inquiryRouter from "./src/modules/inquiries/inquiryRouter.js";


export const init = (app) => {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });

  app.use("/api/auth", authRouter);
  app.use("/api/compnay", companyRouter);
  app.use("/api/dealer", dealerRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/mobiles", mobilesRouter);
  app.use("/api/accessory", accessoryRouter);
  app.use("/api/wearables", wearableRouter);
  app.use("/api/audio", audioRouter);
  app.use("/api/laptops", laptopRouter);
  app.use("/api/inquiries", inquiryRouter);
  app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  });
  // Error handling middleware
  app.use(globalErrorHandler);
};
