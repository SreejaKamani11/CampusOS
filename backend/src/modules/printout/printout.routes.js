const express = require('express');
const authenticate = require('../../middleware/auth');
const upload = require('../../config/multer');
const printoutController = require('./printout.controller');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  upload.single('file'),
  printoutController.createPrintJob
);

router.get('/', printoutController.getPrintJobs);

router.get('/:id', printoutController.getPrintJobById);

module.exports = router;