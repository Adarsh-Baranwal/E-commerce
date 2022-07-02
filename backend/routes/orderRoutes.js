import protect from "../middleware/authMiddleware.js";
import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, addOrderItems);
router.get("/", protect, getOrders);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, updateOrderToPaid);
router.put("/:id/deliver", protect, updateOrderToDelivered);

export default router;
