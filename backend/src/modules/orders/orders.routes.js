const express = require('express');
const authenticate = require('../../middleware/auth');
const ordersController = require('./orders.controller');

const router = express.Router();

router.use(authenticate);

router.post('/', ordersController.createOrder);
router.get('/', ordersController.getOrders);
router.get('/:id', ordersController.getOrderById);

module.exports = router;