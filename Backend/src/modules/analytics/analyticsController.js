import User from "../user/userModel.js";
import Product from "../product/productModel.js";
// import Order from '../order/orderModel.js'; // Uncomment if you have an Order model
import { AppError } from "../../utils/appError.js";
import Reservation from "../reservation/reservationModel.js";

// Overview: total users, products, (sales if available)
export const getOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    // const totalSales = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" }}}]);
    res.json({
      totalUsers,
      totalProducts,
      // totalSales: totalSales[0]?.total || 0,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// Product stats: count by category
export const getProductStats = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ stats });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// User stats: signups per month (last 12 months)
export const getUserStats = async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);
    res.json({ stats });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// (Optional) Sales stats: sales per month (requires Order model)
// export const getSalesStats = async (req, res, next) => {
//   try {
//     const stats = await Order.aggregate([
//       {
//         $group: {
//           _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
//           totalSales: { $sum: "$total" },
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { '_id.year': -1, '_id.month': -1 } },
//       { $limit: 12 },
//     ]);
//     res.json({ stats });
//   } catch (err) {
//     next(new AppError(err.message, 500));
//   }
// };

// Most viewed products (top 10)
// Assumes Product model has a 'views' field (Number)
export const getMostViewedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .sort({ views: -1 })
      .limit(10)
      .select("name views price category isExclusive");
    res.json({ products });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// Most bought products (top 10)
// Assumes Product model has a 'purchases' field (Number)
export const getMostBoughtProducts = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .sort({ purchases: -1 })
      .limit(10)
      .select("name purchases price category isExclusive");
    res.json({ products });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// Top 10 exclusive products (isExclusive: true, sorted by views)
export const getTopExclusiveProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isExclusive: true })
      .sort({ views: -1 })
      .limit(10)
      .select("name views price category");
    res.json({ products });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Total products
    const totalProducts = await Product.countDocuments();

    // Most viewed products (top 10)
    const mostViewedProducts = await Product.find()
      .sort({ views: -1 })
      .limit(10)
      .select("name views price category isExclusive");

    // Most bought products (top 10)
    const mostBoughtProducts = await Product.find()
      .sort({ purchases: -1 })
      .limit(10)
      .select("name purchases price category isExclusive");

    // Top 10 exclusive products
    const topExclusiveProducts = await Product.find({ isExclusive: true })
      .sort({ views: -1 })
      .limit(10)
      .select("name views price category");

    // Product stats by category
    const productStats = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Average price per category
    const avgPriceByCategory = await Product.aggregate([
      { $group: { _id: "$category", avgPrice: { $avg: "$price" } } },
      { $sort: { _id: 1 } },
    ]);

    // Discounted products (top 10 by discount)
    const topDiscountedProducts = await Product.find({ discount: { $gt: 0 } })
      .sort({ discount: -1 })
      .limit(10)
      .select("name discount price category");

    // User signups per month (last 12 months)
    const userSignupTrends = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    // Total products per seller, including items sold
    const totalProductsPerSeller = await Product.aggregate([
      {
        $group: {
          _id: "$dealer",
          totalProducts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "dealerInfo",
        },
      },
      { $unwind: "$dealerInfo" },
      // Lookup confirmed reservations for this seller's products
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "dealer",
          as: "sellerProducts",
        },
      },
      { $unwind: "$sellerProducts" },
      {
        $lookup: {
          from: "reservations",
          let: { productId: "$sellerProducts._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$product", "$$productId"] },
                    { $eq: ["$status", "confirmed"] },
                  ],
                },
              },
            },
          ],
          as: "confirmedReservations",
        },
      },
      {
        $group: {
          _id: "$_id",
          sellerName: { $first: "$dealerInfo.name" },
          totalProducts: { $first: "$totalProducts" },
          itemsSold: { $sum: { $size: "$confirmedReservations" } },
        },
      },
      { $sort: { totalProducts: -1 } },
    ]);

    // (Optional) Sales stats if you have an Order model
    // const totalSales = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" }}}]);

    res.status(200).json({
      status: "success",
      data: {
        totalUsers,
        totalProducts,
        mostViewedProducts,
        mostBoughtProducts,
        topExclusiveProducts,
        productStats,
        avgPriceByCategory,
        topDiscountedProducts,
        userSignupTrends,
        totalProductsPerSeller,
        // totalSales: totalSales[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    next(new AppError("Error fetching dashboard analytics", 500));
  }
};

// Standalone endpoint for total products per seller
export const getTotalProductsPerSeller = async (req, res, next) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: "$dealer",
          totalProducts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "dealerInfo",
        },
      },
      { $unwind: "$dealerInfo" },
      {
        $project: {
          sellerId: "$dealerInfo._id",
          sellerName: "$dealerInfo.name",
          totalProducts: 1,
        },
      },
      { $sort: { totalProducts: -1 } },
    ]);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
