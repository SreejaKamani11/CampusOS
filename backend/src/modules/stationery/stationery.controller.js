const asyncHandler = require('../../utils/asyncHandler');
const stationeryService = require('./stationery.service');

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await stationeryService.getAllProducts();

  res.status(200).json({
    success: true,
    data: products,
  });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await stationeryService.getAllCategories();

  res.status(200).json({
    success: true,
    data: categories,
  });
});

module.exports = {
  getAllProducts,
  getAllCategories,
};