const asyncHandler = require('../../utils/asyncHandler');
const printoutService = require('./printout.service');

const createPrintJob = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'FILE_REQUIRED',
        message: 'Please upload a file',
      },
    });
  }

  const payload = {
    fileName: req.file.originalname,
    filePath: req.file.path,
    pageCount: req.body.pageCount,
    options: {
      copies: req.body.copies,
      color: req.body.color,
      double_sided: req.body.double_sided,
    },
  };

  const printJob = await printoutService.createPrintJob(
    req.user.id,
    payload
  );

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
  const printJob = await printoutService.getPrintJobById(
    req.user.id,
    req.params.id
  );

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