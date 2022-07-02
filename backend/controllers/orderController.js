import asyncHandler from "express-async-handler";
import Order from "./../models/orderModel.js";

//@desc   Create New Order
//@route  POST api/orders
//@access PRIVATE
const addOrderItems = asyncHandler(async (req, res) => {
  console.log("Entery");
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("Cart is Empty");
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

//@desc   Get order
//@route  GET api/orders/:id
//@access PRIVATE
const getOrderById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id).populate("user", "name email");
  if (order) {
    res.status(201).json(order);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

//@desc   update order to paid
//@route  POST api/orders/:id/pay
//@access PRIVATE
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updated_time: req.body.updated_time,
      email_address: req.body.email_address,
    };
    const updatedOrder = await order.save();
    res.status(201).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

//@desc   get orders of logged in user
//@route  POST api/orders/myorders
//@access PRIVATE
const getMyOrders = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user._id });
  if (order) {
    res.status(201).json(order);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

//@desc   get all orders
//@route  POST api/orders/
//@access PRIVATE ADMIN ONLY
const getOrders = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error("You are not authorized");
  }
  const order = await Order.find({}).populate("user", "id name");
  if (order) {
    res.status(201).json(order);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

//@desc   update order to delivered
//@route  POST api/orders/:id/deliver
//@access PRIVATE ADMIN ONLY
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(201).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};
