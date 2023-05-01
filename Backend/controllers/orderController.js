const Order = require("../models/orderModel");
const Product = require("../models/productModels");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

//new order
exports.createOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});
//get single order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("order not found", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});
//get logged In user order
exports.myOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    order,
  });
});
//get all order --admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.find();

  let totalAmt = 0;
  order.forEach((order) => {
    totalAmt += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmt,
    order,
  });
});
//update order status --admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  order.orderItems.forEach(async (o) => {
    await updateStock(o.product, o.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await Order.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
  });
});
