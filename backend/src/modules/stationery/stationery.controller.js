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
const deleteStationeryProduct = async (req, res, next) => {
    try {
        const product = await stationeryService.deleteProduct(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};
const updateStationeryCategory = async (req, res, next) => {
    try {
        const category = await stationeryService.updateCategory(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });

    } catch (error) {
        next(error);
    }
};
const deleteStationeryCategory = async (req, res, next) => {
    try {
        const category = await stationeryService.deleteCategory(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: category
        });

    } catch (error) {
        next(error);
    }
};
module.exports = {
  getAllProducts,
  getAllCategories,
  deleteStationeryProduct,
  updateStationeryCategory,
    deleteStationeryCategory
};