const stationeryRepository = require("./stationery.repository");

async function getAllProducts() {
    return stationeryRepository.findAllProducts();
}

async function getAllCategories() {
    return stationeryRepository.findAllCategories();
}

async function createProduct(product) {
    return stationeryRepository.createProduct(product);
}

async function updateProduct(id, product) {
    return stationeryRepository.updateProduct(id, product);
}
async function deleteProduct(id) {
  return stationeryRepository.deleteProduct(id);
}
async function updateStock(id, stock) {
  return stationeryRepository.updateStock(id, stock);
}
async function createCategory(category) {
    return stationeryRepository.createCategory(category);
}
async function updateCategory(id, category) {
  return stationeryRepository.updateCategory(id, category);
}
async function deleteCategory(id) {
  return stationeryRepository.deleteCategory(id);
}
module.exports = {
    getAllProducts,
    getAllCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    updateCategory,
    createCategory,
    deleteCategory
};