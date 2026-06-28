const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const cartRoutes = require('../modules/cart/cart.routes');
const canteenRoutes = require('../modules/canteen/canteen.routes');
const printoutRoutes = require('../modules/printout/printout.routes');
const ordersRoutes = require('../modules/orders/orders.routes');
const stationeryRoutes = require('../modules/stationery/stationery.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);
router.use('/canteen', canteenRoutes);
router.use('/printout', printoutRoutes);
router.use('/orders', ordersRoutes);
router.use('/stationery', stationeryRoutes);

module.exports = router;
