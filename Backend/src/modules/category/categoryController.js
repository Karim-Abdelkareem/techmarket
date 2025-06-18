import Category from "./CategoryModel.js";
import expressAsyncHandler from "express-async-handler";

export const createCategory = expressAsyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const category = new Category({
    name,
    image: req.file?.path || null,
  });

  await category.save();

  res.status(201).json({
    status: "success",
    data: { category },
  });
});

export const createSubCategory = expressAsyncHandler(async (req, res, next) => {
  const { name, parent } = req.body;

  if (!name || !parent) {
    res.status(400);
    throw new Error("Name and parent category ID are required");
  }

  const parentCategory = await Category.findById(parent);
  if (!parentCategory) {
    res.status(404);
    throw new Error("Parent category not found");
  }

  const subCategory = new Category({
    name,
    image: req.file?.path || null,
    parent: parentCategory._id,
  });

  await subCategory.save();

  res.status(201).json({
    status: "success",
    data: { subCategory },
  });
});

export const getAllCategories = expressAsyncHandler(async (req, res, next) => {
  const categories = await Category.find({ parent: null }).populate(
    "subcategories"
  );

  res.status(200).json({
    status: "success",
    data: { categories },
  });
});

export const getCategoryById = expressAsyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
    .populate("parent", "name slug")
    .populate("subcategories");

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({
    status: "success",
    data: { category },
  });
});

export const updateCategory = expressAsyncHandler(async (req, res, next) => {
  const { name, image, parent } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
      image: req.file?.path || image,
      parent: parent || null,
    },
    { new: true }
  );

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({
    status: "success",
    data: { category },
  });
});

export const deleteCategory = expressAsyncHandler(async (req, res, next) => {
  const subcategories = await Category.find({ parent: req.params.id });
  if (subcategories.length > 0) {
    res.status(400);
    throw new Error("Cannot delete a category with subcategories");
  }

  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({
    status: "success",
    message: "Category deleted successfully",
  });
});
