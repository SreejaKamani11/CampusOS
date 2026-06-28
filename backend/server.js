const app = require('./src/app');
const { env, validateEnv } = require('./src/config/env');
const { testConnection, closePool } = require('./src/config/database');

validateEnv();

async function startServer() {
  try {
    await testConnection();
    console.log('PostgreSQL connected');
  } catch (error) {
    console.warn('PostgreSQL unavailable at startup:', error.message);
    console.warn('Server will start; health check will report degraded status.');
  }

  const server = app.listen(env.port, () => {
    console.log(`CampusOS API running on port ${env.port} (${env.nodeEnv})`);
    console.log(`Health check: http://localhost:${env.port}/api/v1/health`);
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await closePool();
      console.log('Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
