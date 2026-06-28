const express = require('express');
const stationeryController = require('./stationery.controller');

const router = express.Router();

router.get('/products', stationeryController.getAllProducts);
router.get('/categories', stationeryController.getAllCategories);

module.exports = router;