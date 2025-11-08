import crypto from 'crypto';
import { startSimulation } from './simulationEngine.js';

export default async function apiRoutes(fastify, options) {
  fastify.post('/simulate', async (request, reply) => {
    try {
      const config = request.body;
      const testId = crypto.randomUUID();

      // **CRITICAL**
      // Start the simulation in the background. DO NOT await it.
      startSimulation(testId, config).catch((err) => {
        // Log any unhandled errors from the simulation
        fastify.log.error(`[Test ${testId}] Simulation failed: ${err.message}`);
      });

      // Respond immediately to the CLI
      reply.status(202).send({
        message: 'Simulation accepted and started.',
        testId: testId,
        // You would build this dashboard as your frontend
        reportUrl: `https://your-dashboard.com/reports/${testId}`,
      });
    } catch (err) {
      reply.status(400).send({ error: `Invalid configuration: ${err.message}` });
    }
  });
}