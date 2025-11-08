import pLimit from 'p-limit';
import { PayerService } from './payerService.js';
import { FacilitatorService } from './facilitatorService.js';
import { runAgentLoop } from './agent.js';
import { sleep } from './utils/sleep.js';
import { telemetryService } from './telemetryService.js';

export async function startSimulation(testId, config) {
  console.log(`[Test ${testId}] Starting simulation...`);
  console.log(`[Test ${testId}] Config: ${JSON.stringify(config)}`);

  const {
    agentCount,
    durationSeconds,
    rampUpSeconds,
    rpcEndpoints,
    splTokenMint,
    facilitatorUrl
  } = config;

  // Concurrency limiter. This ensures we don't open too many handles at once.
  // We set this to the agentCount, allowing all agents to run concurrently.
  const limit = pLimit(agentCount);

  // --- 1. Initialize Services ---
  const testEndTime = Date.now() + durationSeconds * 1000;
  
  // Create a dedicated payer service for this test
  const payerService = new PayerService(rpcEndpoints, splTokenMint);
  const facilitatorService = new FacilitatorService();

  // Generate wallets in memory for the pool
  // 200 wallets is a good pool size to avoid single-wallet limits.
  const WALLET_POOL_SIZE = 200;
  payerService.generateWallets(WALLET_POOL_SIZE);
  console.log(`[Test ${testId}] Generated ${WALLET_POOL_SIZE} wallets in memory.`);

  // **IMPORTANT**
  // In a real app, you MUST fund these wallets *before* running.
  // We provide a `utils/fund-wallets.js` script for this.
  // We assume they are funded here.

  // --- 2. Create Agent Tasks ---
  const tasks = [];
  const rampUpDelay = (rampUpSeconds * 1000) / agentCount;

  console.log(`[Test ${testId}] Ramping up ${agentCount} agents over ${rampUpSeconds}s...`);

  for (let i = 0; i < agentCount; i++) {
    // Create an async task for each agent
    const agentTask = limit(() =>
      runAgentLoop(testId, config, testEndTime, payerService, facilitatorService)
    );
    tasks.push(agentTask);

    // Wait for the ramp-up delay before adding the next agent
    await sleep(rampUpDelay);
  }

  // --- 3. Execute and Report ---
  console.log(`[Test ${testId}] All agents are running. Test duration: ${durationSeconds}s.`);
  
  // Wait for all agents to finish their loops
  await Promise.all(tasks);
  
  // Flush any remaining metrics from the buffer
  await telemetryService.flush();

  console.log(`[Test ${testId}] Simulation completed.`);
}