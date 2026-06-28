const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { env } = require('./config/env');
const { testConnection } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const routes = require('./routes');
const stationeryRoutes = require('./modules/stationery/stationery.routes');
const cartRoutes = require('./modules/cart/cart.routes');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);

app.use(morgan(env.isProduction ? 'combined' : 'dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Main routes
app.use('/api/v1', routes);

// Module routes

// Health check
app.get('/api/v1/health', async (req, res, next) => {
  try {
    let database = 'disconnected';

    try {
      const connected = await testConnection();
      database = connected ? 'connected' : 'disconnected';
    } catch {
      database = 'disconnected';
    }

    const status = database === 'connected' ? 'ok' : 'degraded';

    res.status(status === 'ok' ? 200 : 503).json({
      success: true,
      data: {
        status,
        database,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      details: [],
    },
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;