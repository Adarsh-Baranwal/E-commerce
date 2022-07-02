import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

//@desc   Fetch all products
//@route  GET api/products
//@access PUBLIC
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc   Fetch single products
//@route  GET api/products/:id
//@access PUBLIC
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
});

//@desc   DELETE Product
//@route  delete api/products/:id
//@access PRIVATE ADMIN ONLY
const deleteProductById = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(400);
    throw new Error("You are not authorized");
  }
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: "Successfully Removed" });
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
});

//@desc   Create a Product
//@route  POST api/products
//@access PRIVATE ADMIN ONLY
const createProduct = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(400);
    throw new Error("You are not authorized");
  }
  const product = new Product({
    name: "Sample Name",
    price: 10,
    user: req.user._id,
    description: "ksnksnd",
    image: "/images/sample.jpg",
    category: "sample category",
    brand: "sample brand",
    countInStock: 0,
    numReviews: 0,
  });

  const createProduct = await product.save();

  if (createProduct) {
    res.status(201).json(createProduct);
  } else {
    res.status(404);
    throw new Error("Product Not Created");
  }
});

//@desc   Create a Product
//@route  POST api/products/:id
//@access PRIVATE ADMIN ONLY
const updateProduct = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(400);
    throw new Error("You are not authorized");
  }
  const { name, price, description, image, category, brand, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.category = category;
    product.brand = brand;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
});

//@desc   Create new review
//@route  POST api/products/:id/reviews
//@access PRIVATE
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Already Reviewed!!");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review Added" });
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
});

//@desc   GET Top rated product
//@route  POST api/products/top
//@access PUBLIC
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

export {
  getProductById,
  getProducts,
  deleteProductById,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
