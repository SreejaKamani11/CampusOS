const asyncHandler = require('../../utils/asyncHandler');
const ordersService = require('./orders.service');

const createOrder = asyncHandler(async (req, res) => {
  const order = await ordersService.createOrder(req.user.id);

  res.status(201).json({
    success: true,
    data: order,
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await ordersService.getOrders(req.user.id);

  res.status(200).json({
    success: true,
    data: orders,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await ordersService.getOrderById(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    data: order,
  });
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};