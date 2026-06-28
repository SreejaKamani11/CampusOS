const asyncHandler = require('../../utils/asyncHandler');
const canteenService = require('./canteen.service');

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await canteenService.getAllCategories();

  res.status(200).json({
    success: true,
    data: categories,
  });
});

const getAllMenuItems = asyncHandler(async (req, res) => {
  const menuItems = await canteenService.getAllMenuItems();

  res.status(200).json({
    success: true,
    data: menuItems,
  });
});

const getMenuItemById = asyncHandler(async (req, res) => {
  const menuItem = await canteenService.getMenuItemById(req.params.id);

  res.status(200).json({
    success: true,
    data: menuItem,
  });
});

const getMenuItemsByCategoryId = asyncHandler(async (req, res) => {
  const menuItems = await canteenService.getMenuItemsByCategoryId(req.params.categoryId);

  res.status(200).json({
    success: true,
    data: menuItems,
  });
});

module.exports = {
  getAllCategories,
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsByCategoryId,
};