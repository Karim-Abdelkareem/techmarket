import express from "express";
import * as laptopController from "./laptopController.js";
import { upload } from "../../config/cloudinary.js";

const router = express.Router();
const uploadFields = [
  {
    name: "image",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 10,
  },
];

router
  .route("/")
  .post(upload.fields(uploadFields), laptopController.createLaptop)
  .get(laptopController.getAllLaptops);

router
  .route("/:id")
  .get(laptopController.getLaptopById)
  .put(upload.fields(uploadFields), laptopController.updateLaptop)
  .delete(laptopController.deleteLaptop);

router.get("/sub/:id", laptopController.getLaptopsByCategoryId);

export default router;
