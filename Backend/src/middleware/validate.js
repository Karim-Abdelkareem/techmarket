import Joi from "joi";
import { AppError } from "../utils/appError.js";
import { PRODUCT_TYPE_SCHEMAS } from "../utils/validationSchemaMap.js";

export const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      return next(new AppError(`Validation error: ${message}`, 400));
    }
    next();
  };

export const dynamicProductValidation = (req, res, next) => {
  const { productType } = req.body;
  const schema = PRODUCT_TYPE_SCHEMAS[productType];
  if (!schema) {
    return res
      .status(400)
      .json({ message: `Invalid productType: ${productType}` });
  }
  // Use your existing validate middleware
  return validate(schema)(req, res, next);
};
