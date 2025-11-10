import crypto from 'crypto';
import { startSimulation } from './simulationEngine.js';

 export default async function apiRoutes(fastify, options) {
  // This endpoint matches the Go CLI: POST /simulation/deploy
  fastify.post('/simulation/deploy', async (request, reply) => {
    try {
      // The config now matches the Go struct
      const config = request.body;
      const testId = crypto.randomUUID();

      startSimulation(testId, config).catch((err) => {
        fastify.log.error(`[Test ${testId}] Simulation failed: ${err.message}`);
      });

      // We will send back a response that matches the Go DeploymentResponse
      reply.status(202).send({
        simulation_id: testId,
        status: "Accepted",
        message: "Simulation started.",
        agents_spawned: 0, // 0 for now, will spawn async
        dashboard_url: `http://your-dashboard.com/reports/${testId}`,
      });
    } catch (err) {
      reply.status(400).send({ error: `Invalid configuration: ${err.message}` });
    }
  });

  // Add the other endpoints from backend.go
  fastify.get('/simulation/:simulationId/status', (request, reply) => {
    // TODO: You would build logic here to check test status
    reply.send({ simulation_id: request.params.simulationId, status: "Running" });
  });

  fastify.post('/simulation/:simulationId/stop', (request, reply) => {
    // TODO: You would build logic here to stop a test
    reply.send({ simulation_id: request.params.simulationId, status: "Stopped" });
  });
}