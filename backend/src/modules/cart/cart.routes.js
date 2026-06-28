const express = require('express');
const authenticate = require('../../middleware/auth');
const cartController = require('./cart.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', cartController.getCart);

router.post('/items', cartController.addItem);

router.put('/items/:itemId', cartController.updateItem);

router.delete('/items/:itemId', cartController.deleteItem);

module.exports = router;