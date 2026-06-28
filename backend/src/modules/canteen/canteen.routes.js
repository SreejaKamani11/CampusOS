const express = require('express');
const canteenController = require('./canteen.controller');

const router = express.Router();

router.get('/categories', canteenController.getAllCategories);
router.get('/menu/category/:categoryId', canteenController.getMenuItemsByCategoryId);
router.get('/menu/:id', canteenController.getMenuItemById);
router.get('/menu', canteenController.getAllMenuItems);

module.exports = router;