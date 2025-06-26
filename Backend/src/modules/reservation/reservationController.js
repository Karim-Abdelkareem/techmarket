import Reservation from "./reservationModel.js";
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../../utils/appError.js";
import Product from "../product/productModel.js";

export const createReservation = expressAsyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const reservation = await Reservation.create({
    user: req.user._id,
    product: productId,
    productReferralCode: product.referralCode || null,
  });

  const populatedReservation = await Reservation.findById(
    reservation._id
  ).populate({
    path: "product",
  });

  res.status(201).json({
    status: "success",
    data: {
      populatedReservation,
      referralCode: product.referralCode || null,
    },
  });
});

export const getReservationsByReferralCode = expressAsyncHandler(
  async (req, res, next) => {
    const { referralCode } = req.body;
    if (!referralCode) {
      return next(new AppError("Referral code is required", 400));
    }

    let reservedProduct = await Product.findOne({
      referralCode: referralCode,
    });

    if (!reservedProduct) {
      return next(
        new AppError("No product found with this referral code", 404)
      );
    }
    const reservations = await Reservation.find({
      product: reservedProduct._id,
    })
      .populate("user", "name email")
      .populate("product");

    if (reservations.length === 0) {
      return next(new AppError("No reservations found for this product", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        reservations,
      },
    });
  }
);

export const getUserReservations = expressAsyncHandler(
  async (req, res, next) => {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate("product")
      .sort({ reservedAt: -1 });

    if (reservations.length === 0) {
      return next(new AppError("No reservations found for this user", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        reservations,
      },
    });
  }
);

export const updateReservationStatus = expressAsyncHandler(
  async (req, res, next) => {
    const { reservationId } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return next(new AppError("Invalid status", 400));
    }

    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { status },
      { new: true }
    ).populate("product");

    if (!reservation) {
      return next(new AppError("Reservation not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        reservation,
      },
    });
  }
);

export const deleteReservation = expressAsyncHandler(async (req, res, next) => {
  const { reservationId } = req.params;

  const reservation = await Reservation.findByIdAndDelete(reservationId);

  if (!reservation) {
    return next(new AppError("Reservation not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
