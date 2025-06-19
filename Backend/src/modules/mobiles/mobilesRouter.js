import express from "express";
import * as mobilesController from "./mobilesController.js";
import { upload } from "../../config/cloudinary.js";

const Router = express.Router();
Router.route("/")
  .post(
    upload.fields([
      {
        name: "image",
        maxCount: 1,
      },
      {
        name: "images",
        maxCount: 6,
      },
    ]),
    mobilesController.createMobile
  )
  .get(mobilesController.getAllMobiles);

Router.route("/:id")
  .get(mobilesController.getMobileById)
  .put(
    upload.fields([
      {
        name: "image",
        maxCount: 1,
      },
      {
        name: "images",
        maxCount: 6,
      },
    ]),
    mobilesController.updateMobile
  )
  .delete(mobilesController.deleteMobile);

Router.get("/sub/:id", mobilesController.findBySubCategoryId);

export default Router;
