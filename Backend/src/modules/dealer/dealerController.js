import expressAsyncHandler from "express-async-handler";
import Dealer from "./dealerModel.js";

// CREATE
export const createDealer = expressAsyncHandler(async (req, res) => {
  const { name, brief, locationText, locationLink } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Dealer name is required");
  }

  const dealer = new Dealer({
    name,
    logo: req.file?.path || null,
    brief,
    location: {
      text: locationText || "",
      link: locationLink || "",
    },
  });

  await dealer.save();

  res.status(201).json({
    status: "success",
    data: { dealer },
  });
});

// READ ALL
export const getAllDealers = expressAsyncHandler(async (req, res) => {
  const dealers = await Dealer.find();
  res.status(200).json({
    status: "success",
    data: { dealers },
  });
});

// READ ONE
export const getDealerById = expressAsyncHandler(async (req, res) => {
  const dealer = await Dealer.findById(req.params.id);
  if (!dealer) {
    res.status(404);
    throw new Error("Dealer not found");
  }
  res.status(200).json({
    status: "success",
    data: { dealer },
  });
});

// UPDATE
export const updateDealer = expressAsyncHandler(async (req, res) => {
  const { name, brief, locationText, locationLink } = req.body;
  const dealer = await Dealer.findById(req.params.id);

  if (!dealer) {
    res.status(404);
    throw new Error("Dealer not found");
  }

  dealer.name = name || dealer.name;
  dealer.brief = brief || dealer.brief;
  dealer.location = {
    text: locationText || dealer.location.text,
    link: locationLink || dealer.location.link,
  };

  if (req.file) {
    dealer.logo = req.file.path;
  }

  await dealer.save();

  res.status(200).json({
    status: "success",
    data: { dealer },
  });
});

// DELETE
export const deleteDealer = expressAsyncHandler(async (req, res) => {
  const dealer = await Dealer.findById(req.params.id);
  if (!dealer) {
    res.status(404);
    throw new Error("Dealer not found");
  }

  await dealer.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Dealer deleted successfully",
  });
});
