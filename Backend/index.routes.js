import { AppError } from "./src/utils/appError.js";
import globalErrorHandler from "./src/middleware/globalErrorHandler.js";
import authRouter from "./src/modules/auth/authRouter.js";
import companyRouter from "./src/modules/company/companyRouter.js";

export const init = (app) => {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });

  app.use("/api/auth", authRouter);
  app.use("/api/compnay", companyRouter);
  app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  });
  // Error handling middleware
  app.use(globalErrorHandler);
};
