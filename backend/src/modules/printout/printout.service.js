const AppError = require('../../utils/AppError');
const printoutRepository = require('./printout.repository');

function parsePositiveInteger(value, fieldName, defaultValue) {
  const parsedValue = value === undefined ? defaultValue : Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new AppError(`${fieldName} must be a positive integer`, 400, 'VALIDATION_ERROR');
  }

  return parsedValue;
}

function parseBoolean(value, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue === 'true') {
      return true;
    }

    if (normalizedValue === 'false') {
      return false;
    }
  }

  return Boolean(value);
}

function calculatePrintPrice({ pageCount, copies, color }) {
  const rate = color ? 5 : 2;
  return pageCount * copies * rate;
}

async function createPrintJob(userId, payload) {
  const filePath = payload.file_path || payload.filePath;
  const fileName = payload.file_name || payload.fileName;

  if (!filePath) {
    throw new AppError('file_path is required', 400, 'VALIDATION_ERROR');
  }

  if (!fileName) {
    throw new AppError('file_name is required', 400, 'VALIDATION_ERROR');
  }

  const pageCount = parsePositiveInteger(payload.page_count ?? payload.pageCount, 'page_count', null);
  const options = payload.options || {};
  const copies = parsePositiveInteger(options.copies, 'options.copies', 1);
  const color = parseBoolean(options.color, false);
  const doubleSided = parseBoolean(options.double_sided, false);
  const calculatedPrice = calculatePrintPrice({
    pageCount,
    copies,
    color,
  });

  return printoutRepository.createPrintJob({
    userId,
    filePath,
    fileName,
    pageCount,
    options: {
      ...options,
      copies,
      color,
      double_sided: doubleSided,
    },
    calculatedPrice,
  });
}

async function getPrintJobs(userId) {
  return printoutRepository.findPrintJobsByUserId(userId);
}

async function getPrintJobById(userId, id) {
  const printJob = await printoutRepository.findPrintJobById(userId, id);

  if (!printJob) {
    throw new AppError('Print job not found', 404, 'PRINT_JOB_NOT_FOUND');
  }

  return printJob;
}
async function getAllPrintJobs() {
    return printoutRepository.findAllPrintJobs();
}

async function updatePrintJobStatus(id, status) {
    return printoutRepository.updatePrintJobStatus(id, status);
}
module.exports = {
  createPrintJob,
  getPrintJobs,
  getPrintJobById,
  getAllPrintJobs,
  updatePrintJobStatus
};