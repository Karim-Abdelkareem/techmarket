import { AppError } from "../utils/appError.js";

export default function validate(Schema) {
  return (req, res, next) => {
    const { error } = Schema.validate(req.body);
    if (error) {
      const message = error.details.map((el) => el.message).join(", ");
      return next(new AppError(message, 400));
    }
    next();
  };
}
