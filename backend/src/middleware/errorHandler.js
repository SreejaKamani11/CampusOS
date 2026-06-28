const { env } = require('../config/env');

/**
 * Global error handler placeholder.
 * Module-specific errors will use AppError with code/status in a later iteration.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  const status = error.status || error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message =
    status === 500 && env.isProduction
      ? 'Internal server error'
      : error.message || 'Internal server error';

  if (status >= 500) {
    console.error('[error]', error);
  }

  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      details: error.details || [],
    },
  });
}

module.exports = errorHandler;
