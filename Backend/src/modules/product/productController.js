import { PRODUCT_MODELS } from "../../utils/productModelsMap.js";
import { CATEGORY_MAP } from "../../utils/categoryMap.js";
import { AppError } from "../../utils/appError.js";
import { Features } from "../../utils/features.js";
import expressAsyncHandler from "express-async-handler";
import Product from "./productModel.js";
import slugify from "slugify";

export const createProudct = expressAsyncHandler(async (req, res, next) => {
  const {
    name,
    price,
    category,
    productType,
    description,
    company,
    quantity,
    productCode,
    referralCode,
    discount,
    ...restFields
  } = req.body;

  const allowedTypes = CATEGORY_MAP[category];
  if (!allowedTypes || !allowedTypes.includes(productType)) {
    return next(
      new AppError(
        `Product type '${productType}' is not valid for category '${category}'`,
        400
      )
    );
  }

  const Model = PRODUCT_MODELS[productType];
  if (!Model) {
    return next(
      new AppError(`Product type '${productType}' is not valid`, 400)
    );
  }

  let image = undefined;
  let images = [];

  if (req.files?.image?.length > 0) {
    image = req.files.image[0].path;
  }

  if (req.files?.images?.length > 0) {
    images = req.files.images.map((file) => file.path);
  }

  const dealer = req.user._id; // Assuming the dealer is the logged-in user

  const product = await Product.create({
    name,
    price,
    category,
    productType,
    dealer,
    description,
    company,
    quantity,
    image,
    images,
    productCode,
    referralCode,
    discount,
    ...restFields,
  });
  res.status(201).json({ message: "Product created successfully", product });
});

//Get ALL THE PRODUCTS
export const getProducts = expressAsyncHandler(async (req, res, next) => {
  // If user is a moderator, only show their products
  let baseQuery = {};
  
  if (req.user && req.user.role === 'moderator') {
    baseQuery.dealer = req.user._id;
  }
  
  let features = new Features(Product.find(baseQuery), req.query)
    .pagination()
    .filter()
    .sort()
    .search()
    .fields();

  // Add populate to include dealer information
  let mongooseQuery = features.mongooseQuery.populate({
    path: 'dealer',
    select: 'name email role'
  });

  let results = await mongooseQuery;
  
  // Count documents with the same filter for accurate pagination
  const totalCount = await Product.countDocuments(baseQuery);
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

//GET Product BY ID
export const getProductById = expressAsyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("dealer")
    .populate("company");
  if (!product) {
    return next(new AppError("Product not found with this ID", 404));
  }
  if (req.user?.role !== "admin" && req.user?.role !== "dealer") {
    product.views = (product.views || 0) + 1;
    await product.save();
  }
  res.status(200).json({ status: "success", data: product });
});

//UPDATE PRODUCT

export const updateProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category, productType, ...restFields } = req.body;

  const baseProduct = await Product.findById(id);
  if (!baseProduct) {
    return next(new AppError("Product not found", 404));
  }
  
  // Check if moderator is trying to update someone else's product
  if (req.user.role === 'moderator' && baseProduct.dealer.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to update this product", 403));
  }

  if (category && productType) {
    const allowedTypes = CATEGORY_MAP[category];
    if (!allowedTypes || !allowedTypes.includes(productType)) {
      return next(
        new AppError(
          `Product type '${productType}' is not valid for category '${category}'`,
          400
        )
      );
    }
  }

  const Model = PRODUCT_MODELS[baseProduct.productType];
  if (!Model) {
    return next(new AppError(`Invalid product type`, 400));
  }

  if (req.files?.image?.length > 0) {
    restFields.image = req.files.image[0].path;
  }

  if (req.files?.images?.length > 0) {
    restFields.images = req.files.images.map((file) => file.path);
  }

  if (name) {
    restFields.name = name;
    restFields.slug = slugify(name, { lower: true, strict: true });
  }

  const updatedProduct = await Model.findByIdAndUpdate(
    id,
    {
      ...restFields,
      ...(category && { category }),
      ...(productType && { productType }),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

//DELETE PRODUCT

export const deleteProduct = expressAsyncHandler(async (req, res, next) => {
  const id = req.params.id;
  
  // First find the product to check ownership
  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError(`Product not found`, 404));
  }
  
  // Check if moderator is trying to delete someone else's product
  if (req.user.role === 'moderator' && product.dealer.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to delete this product", 403));
  }
  
  // Now delete the product
  await Product.findByIdAndDelete(id);
  
  res.status(204).json({
    status: "success",
    message: "Product deleted successfully",
  });
});
