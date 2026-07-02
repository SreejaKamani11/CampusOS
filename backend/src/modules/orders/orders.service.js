const AppError = require('../../utils/AppError');
const ordersRepository = require('./orders.repository');

async function createOrder(userId) {
  const result = await ordersRepository.createOrderFromCart({ userId });

  if (!result) {
    throw new AppError('Cart not found', 404, 'CART_NOT_FOUND');
  }

  if (result.emptyCart) {
    throw new AppError('Cart is empty', 400, 'CART_EMPTY');
  }

  return result;
}

async function getOrders(userId) {
  return ordersRepository.findOrdersByUserId(userId);
}

async function getOrderById(userId, orderId) {
  const order = await ordersRepository.findOrderById(userId, orderId);

  if (!order) {
    throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
  }

  return order;
}
async function getAllOrders() {
    return ordersRepository.findAllOrders();
}

async function updateOrderStatus(orderId, status, adminId) {
    return ordersRepository.updateOrderStatus(
        orderId,
        status,
        adminId
    );
}
async function getOrderByIdForAdmin(orderId){

    return ordersRepository.findOrderByIdForAdmin(orderId);

}
module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,getOrderByIdForAdmin
};