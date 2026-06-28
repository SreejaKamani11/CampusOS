const asyncHandler = require('../../utils/asyncHandler');
const printoutService = require('./printout.service');

const createPrintJob = asyncHandler(async (req, res) => {
  const printJob = await printoutService.createPrintJob(req.user.id, req.body);

  res.status(201).json({
    success: true,
    data: printJob,
  });
});

const getPrintJobs = asyncHandler(async (req, res) => {
  const printJobs = await printoutService.getPrintJobs(req.user.id);

  res.status(200).json({
    success: true,
    data: printJobs,
  });
});

const getPrintJobById = asyncHandler(async (req, res) => {
  const printJob = await printoutService.getPrintJobById(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    data: printJob,
  });
});

module.exports = {
  createPrintJob,
  getPrintJobs,
  getPrintJobById,
};