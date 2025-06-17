import Dealer from "./dealerModel.js";

export const createDealer = async (req, res, next) => {
  try {
    const { name, logo, brief, locationText, locationLink } = req.body;

    const dealer = new Dealer({
      name,
      logo: logo ? logo : null,
      brief,
      location: {
        text: locationText || "",
        link: locationLink || ""
      }
    });

    await dealer.save();

    res.status(201).json({
      status: "success",
      data: {
        dealer,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDealers = async (req, res, next) => {
  try {
    const dealers = await Dealer.find();
    res.status(200).json({
      status: "success",
      data: {
        dealers,
      },
    });
  } catch (error) {
    next(error);
  }
};
