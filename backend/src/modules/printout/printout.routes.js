const express = require('express');
const authenticate = require('../../middleware/auth');
const printoutController = require('./printout.controller');

const router = express.Router();

router.use(authenticate);

router.post('/', printoutController.createPrintJob);
router.get('/', printoutController.getPrintJobs);
router.get('/:id', printoutController.getPrintJobById);

module.exports = router;