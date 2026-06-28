const asyncHandler = require('../../utils/asyncHandler');
const cartService = require('./cart.service');

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);

  res.status(200).json({
    success: true,
    data: cart,
  });
});

const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.user.id, req.body);

  res.status(200).json({
    success: true,
    data: cart,
  });
});

const updateItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItem(req.user.id, req.params.itemId, req.body);

  res.status(200).json({
    success: true,
    data: cart,
  });
});

const deleteItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user.id, req.params.itemId);

  res.status(200).json({
    success: true,
    data: cart,
  });
});

module.exports = {
  getCart,
  addItem,
  updateItem,
  deleteItem,
};