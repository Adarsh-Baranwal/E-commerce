import express from "express";
import {
  getProductById,
  getProducts,
  deleteProductById,
  updateProduct,
  createProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
import protect from "./../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, createProduct);

router.route("/top").get(getTopProducts);
router.route("/:id/reviews").post(protect, createProductReview);

router
  .route("/:id")
  .get(getProductById)
  .delete(protect, deleteProductById)
  .put(protect, updateProduct);

export default router;
