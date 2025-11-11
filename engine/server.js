import Fastify from 'fastify';
import dotenv from 'dotenv';
import { telemetryService } from './telemetryService.js';
import apiRoutes from './apiRoutes.js';

// Load environment variables
dotenv.config();

// Initialize services
telemetryService.initialize();

const fastify = Fastify({
  logger: true, // Enable logging
});

// Register the API routes
fastify.register(apiRoutes, { prefix: '/api/v1' });

// Run the server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port });
    fastify.log.info(`Server listening on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();