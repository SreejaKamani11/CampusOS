require('dotenv').config();

const REQUIRED_VARS = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

function getEnv(name, defaultValue) {
  const value = process.env[name];
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function validateEnv() {
  for (const name of REQUIRED_VARS) {
    getEnv(name);
  }
}

const env = {
  nodeEnv: getEnv('NODE_ENV', 'development'),
  port: Number(getEnv('PORT', '3000')),
  databaseUrl: getEnv('DATABASE_URL'),
  corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:5173'),
  jwt: {
    secret: getEnv('JWT_SECRET'),
    refreshSecret: getEnv('JWT_REFRESH_SECRET'),
    accessExpiresIn: getEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: getEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  },
  uploadDir: getEnv('UPLOAD_DIR', 'uploads/printouts'),
  isProduction: getEnv('NODE_ENV', 'development') === 'production',
};

module.exports = {
  env,
  validateEnv,
};
