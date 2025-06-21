import Cart from "./cartModel.js";
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../../utils/appError.js";
import Product from "../product/productModel.js";

function calTotalPrice(cart) {
  let total = 0;
  cart.items.forEach((item) => {
    total += item.price * item.quantity;
  });
  cart.total = total;
}

export const addProductToCart = expressAsyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.body.product);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  req.body.price = product.price;
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    let newCart = new Cart({ user: req.user.id, items: [req.body] });
    calTotalPrice(newCart);
    await newCart.save();
    return res.status(201).json({
      status: "success",
      data: newCart,
    });
  }

  let item = cart.items.find((item) => {
    return item.product == req.body.product;
  });
  if (item) {
    item.quantity += req.body.quantity;
  } else {
    cart.items.push(req.body);
  }
  calTotalPrice(cart);
  if (cart.discount) {
    cart.totalAfterDiscount = cart.total - (cart.total * cart.discount) / 100;
  }
  await cart.save();
  return res.status(200).json({
    status: "success",
    data: cart,
  });
});

export const removeFromCart = expressAsyncHandler(async (req, res, next) => {
  let newCart = await Cart.findOneAndUpdate(
    {
      user: req.user.id,
    },
    {
      $pull: {
        items: {
          product: req.body.product,
        },
      },
    },
    {
      new: true,
    }
  );
  calTotalPrice(newCart);
  if (newCart.discount) {
    newCart.totalAfterDiscount =
      newCart.total - newCart.total * newCart.discount;
  }
  !newCart && next(new AppError(`Product not found`, 404));
  newCart &&
    res.status(200).json({
      status: "success",
      data: newCart,
    });
});

export const getLoggedUserCart = expressAsyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product"
  );
  !cart && next(new AppError("Cart not found", 404));
  cart && res.status(200).json({ status: "success", data: cart });
});
