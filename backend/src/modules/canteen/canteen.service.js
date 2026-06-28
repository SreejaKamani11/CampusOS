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

module.exports = {
  getAllCategories,
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsByCategoryId,
};