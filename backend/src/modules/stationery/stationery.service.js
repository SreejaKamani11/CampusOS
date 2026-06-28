const stationeryRepository = require('./stationery.repository');

async function getAllProducts() {
  return stationeryRepository.findAllProducts();
}

async function getAllCategories() {
  return stationeryRepository.findAllCategories();
}

module.exports = {
  getAllProducts,
  getAllCategories,
};