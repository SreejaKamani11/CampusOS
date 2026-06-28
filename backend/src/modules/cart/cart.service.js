const AppError = require('../../utils/AppError');
const cartRepository = require('./cart.repository');

function parsePositiveQuantity(quantity, fieldName) {
  const parsedQuantity = quantity === undefined ? 1 : Number(quantity);

  if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
    throw new AppError(
      `${fieldName} must be a positive integer`,
      400,
      'VALIDATION_ERROR'
    );
  }

  return parsedQuantity;
}

async function getCart(userId) {
  return cartRepository.getCartByUserId(userId);
}

async function addItem(userId, payload) {
  const serviceType = payload.serviceType || payload.service_type || 'stationery';
  const referenceId = payload.referenceId || payload.reference_id || payload.productId || payload.product_id;

  if (!referenceId) {
    throw new AppError('referenceId is required', 400, 'VALIDATION_ERROR');
  }

  if (!['stationery', 'canteen'].includes(serviceType)) {
    throw new AppError(
      'Invalid serviceType',
      400,
      'VALIDATION_ERROR'
    );
  }

  const quantity = parsePositiveQuantity(payload.quantity, 'quantity');

  const cart = await cartRepository.addItemToCart({
    userId,
    serviceType,
    referenceId,
    quantity,
  });

  if (!cart) {
    throw new AppError(
      'Item not found',
      404,
      'ITEM_NOT_FOUND'
    );
  }

  return cart;
}

async function updateItem(userId, itemId, payload) {
  const quantity = parsePositiveQuantity(payload.quantity, 'quantity');

  const cart = await cartRepository.updateCartItemQuantity({
    userId,
    itemId,
    quantity,
  });

  if (!cart) {
    throw new AppError(
      'Cart item not found',
      404,
      'CART_ITEM_NOT_FOUND'
    );
  }

  return cart;
}

async function removeItem(userId, itemId) {
  const cart = await cartRepository.deleteCartItem({
    userId,
    itemId,
  });

  if (!cart) {
    throw new AppError(
      'Cart item not found',
      404,
      'CART_ITEM_NOT_FOUND'
    );
  }

  return cart;
}

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
};