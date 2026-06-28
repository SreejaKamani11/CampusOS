const AppError = require('../../utils/AppError');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateFields(body, rules) {
  const details = [];

  for (const [field, rule] of Object.entries(rules)) {
    const value = body[field];

    if (rule.required && (value === undefined || value === null || value === '')) {
      details.push({ field, message: `${field} is required` });
      continue;
    }

    if (value === undefined || value === null || value === '') {
      continue;
    }

    if (rule.type === 'string' && typeof value !== 'string') {
      details.push({ field, message: `${field} must be a string` });
      continue;
    }

    if (rule.minLength && value.length < rule.minLength) {
      details.push({
        field,
        message: `${field} must be at least ${rule.minLength} characters`,
      });
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      details.push({
        field,
        message: `${field} must be at most ${rule.maxLength} characters`,
      });
    }

    if (rule.email && !EMAIL_REGEX.test(value)) {
      details.push({ field, message: `${field} must be a valid email address` });
    }
  }

  if (details.length > 0) {
    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', details);
  }
}

function validateRegister(req, res, next) {
  try {
    validateFields(req.body, {
      name: { required: true, type: 'string', minLength: 2, maxLength: 255 },
      email: { required: true, type: 'string', email: true, maxLength: 255 },
      password: { required: true, type: 'string', minLength: 8, maxLength: 128 },
      campus_id: { required: true, type: 'string', minLength: 1, maxLength: 100 },
    });
    req.body.email = req.body.email.trim().toLowerCase();
    req.body.name = req.body.name.trim();
    req.body.campus_id = req.body.campus_id.trim();
    next();
  } catch (error) {
    next(error);
  }
}

function validateLogin(req, res, next) {
  try {
    validateFields(req.body, {
      email: { required: true, type: 'string', email: true, maxLength: 255 },
      password: { required: true, type: 'string', minLength: 1, maxLength: 128 },
    });
    req.body.email = req.body.email.trim().toLowerCase();
    next();
  } catch (error) {
    next(error);
  }
}

function validateLogout(req, res, next) {
  try {
    validateFields(req.body, {
      refreshToken: { required: true, type: 'string', minLength: 1 },
    });
    next();
  } catch (error) {
    next(error);
  }
}

function validateRefreshToken(req, res, next) {
  try {
    validateFields(req.body, {
      refreshToken: { required: true, type: 'string', minLength: 1 },
    });
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateRegister,
  validateLogin,
  validateLogout,
  validateRefreshToken,
};
