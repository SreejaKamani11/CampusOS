const AppError = require('../../utils/AppError');
const canteenRepository = require('./canteen.repository');

async function getAllCategories() {
  return canteenRepository.findAllCategories();
}

async function getAllMenuItems() {
  return canteenRepository.findAllMenuItems();
}

async function getMenuItemById(id) {
  const menuItem = await canteenRepository.findMenuItemById(id);

  if (!menuItem) {
    throw new AppError('Menu item not found', 404, 'CANTEEN_MENU_ITEM_NOT_FOUND');
  }

  return menuItem;
}

async function getMenuItemsByCategoryId(categoryId) {
  return canteenRepository.findMenuItemsByCategoryId(categoryId);
}
async function createMenuItem(item) {
  return canteenRepository.createMenuItem(item);
}
async function updateMenuItem(id, item) {
  return canteenRepository.updateMenuItem(id, item);
}
async function deleteMenuItem(id) {
  return canteenRepository.deleteMenuItem(id);
}
async function updateMenuAvailability(id, available) {
  return canteenRepository.updateMenuAvailability(id, available);
}
async function createCategory(category) {
    return canteenRepository.createCategory(category);
}
async function updateCategory(id, category) {
  return canteenRepository.updateCategory(id, category);
}
async function deleteCategory(id) {
  return canteenRepository.deleteCategory(id);
}
module.exports = {
  getAllCategories,
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsByCategoryId,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateMenuAvailability,
  createCategory,
  updateCategory,
  deleteCategory
};