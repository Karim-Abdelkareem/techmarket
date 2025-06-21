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
    dealer,
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
  let features = new Features(Product.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .search()
    .fields();

  let results = await features.mongooseQuery;
  const totalCount = await Product.countDocuments();
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
  const { id } = req.params.id;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new AppError(`Product not found`, 404));
  }
  res.status(204).json({
    status: "success",
    message: "Product deleted successfully",
  });
});
