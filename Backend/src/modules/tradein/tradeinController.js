import TradeIn from "./tradeinModel.js";
import Product from "../product/productModel.js";
import expressAsyncHandler from "express-async-handler";
import { Features } from "../../utils/features.js";

// 1. Create Trade-In Request
export const createTradeIn = expressAsyncHandler(async (req, res, next) => {
  const { category, productType, specs, replacement } = req.body;
  const user = req.user?._id || req.body.user; // support both authenticated and manual user

  if (!category || !productType || !specs || !replacement) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Optionally: Validate replacement product exists
  const replacementProduct = await Product.findById(replacement);
  if (!replacementProduct) {
    return res.status(404).json({ message: "Replacement product not found." });
  }

  const tradeIn = await TradeIn.create({
    user,
    store: replacementProduct.dealer,
    category,
    productType,
    specs,
    replacement,
  });

  res.status(201).json({ status: "success", data: { tradeIn } });
});

// 2. Get Required Specs for Category/ProductType (for dynamic form)
// For demo: Hardcoded, but you can make this dynamic from DB if needed
// const specsMap = {
//   Mobile: {
//     "iPhone 12": [
//       { name: "ram", type: "string", label: "RAM", required: true },
//       { name: "storage", type: "string", label: "Storage", required: true },
//       { name: "color", type: "string", label: "Color", required: false },
//       { name: "condition", type: "string", label: "Condition", required: true },
//     ],
//     "Samsung S21": [
//       { name: "ram", type: "string", label: "RAM", required: true },
//       { name: "storage", type: "string", label: "Storage", required: true },
//       { name: "color", type: "string", label: "Color", required: false },
//       { name: "condition", type: "string", label: "Condition", required: true },
//     ],
//   },
//   Laptop: {
//     "Dell XPS": [
//       { name: "ram", type: "string", label: "RAM", required: true },
//       { name: "storage", type: "string", label: "Storage", required: true },
//       { name: "cpu", type: "string", label: "CPU", required: true },
//       { name: "condition", type: "string", label: "Condition", required: true },
//     ],
//   },
// };

// export const getTradeInSpecs = expressAsyncHandler(async (req, res) => {
//   const { category, productType } = req.query;
//   if (!category || !productType) {
//     return res
//       .status(400)
//       .json({ message: "category and productType are required" });
//   }
//   const fields = specsMap[category]?.[productType] || [];
//   res.json({ fields });
// });

// 3. Get All Trade-Ins (admin)
export const getAllTradeIns = expressAsyncHandler(async (req, res) => {
  let baseQuery = {};

  // If moderator, filter by their store
  if (req.user && req.user.role === "moderator") {
    baseQuery.store = req.user._id;
  }

  let features = new Features(TradeIn.find(baseQuery), req.query)
    .pagination()
    .filter()
    .sort()
    .search()
    .fields();

  const mongooseQuery = features.mongooseQuery
    .populate("user", "name email")
    .populate("replacement", "title");

  const results = await mongooseQuery;

  const totalCount = await TradeIn.countDocuments(baseQuery);
  const totalPages = Math.ceil(totalCount / features.limit);
  const hasNextPage = features.page < totalPages;

  res.status(200).json({
    status: "success",
    results: results.length,
    page: features.page,
    totalPages,
    hasNextPage,
    data: results,
  });
});

// 4. Get User's Trade-Ins
export const getUserTradeIns = expressAsyncHandler(async (req, res) => {
  const userId = req.user?._id || req.body.user;
  const tradeIns = await TradeIn.find({ user: userId }).populate("replacement");
  res.json({ tradeIns });
});

// 5. Get Store's Trade-Ins
export const getStoreTradeIns = expressAsyncHandler(async (req, res, next) => {
  const storeId = req.user?._id || req.body.store;
  const tradeIns = await TradeIn.find({ store: storeId }).populate("user");
  res.json({
    status: "success",
    data: {
      tradeIns,
    },
  });
});

//6. change trade-in status
export const changeTradeInStatus = expressAsyncHandler(
  async (req, res, next) => {
    const { tradeInId, status } = req.body;
    const tradeIn = await TradeIn.findByIdAndUpdate(
      tradeInId,
      { status },
      { new: true }
    );
    res.json({
      status: "success",
      data: {
        tradeIn,
      },
    });
  }
);
