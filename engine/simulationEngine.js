import pLimit from 'p-limit';
import { PayerService } from './payerService.js';
import { FacilitatorService } from './facilitatorService.js';
import { runAgentLoop } from './agent.js';
import { sleep } from './utils/sleep.js';
import { telemetryService } from './telemetryService.js';

export async function startSimulation(testId, config) {
  console.log(`[Test ${testId}] Starting simulation...`);

  // Use the new config names from config.go
  const {
    target_endpoint: targetUrl,
    num_agents: agentCount,
    test_duration_seconds: durationSeconds,
    ramp_up_period_seconds: rampUpSeconds,
    solana_network: network, // We don't use this yet, but good to have
    // We get facilitatorUrl and splTokenMint from the .env file
  } = config;
  
  // These must come from your engine's .env file or config
  const facilitatorUrl = process.env.SOLANA_FACILITATOR_URL; 
  const splTokenMint = process.env.SPL_TOKEN_MINT; 

  if (!facilitatorUrl || !splTokenMint) {
    console.error("FATAL: Missing SOLANA_FACILITATOR_URL or SPL_TOKEN_MINT in .env");
    return;
  }

  const limit = pLimit(agentCount);
  const testEndTime = Date.now() + durationSeconds * 1000;
  
  const payerService = new PayerService(["https://api.devnet.solana.com"], splTokenMint);
  const facilitatorService = new FacilitatorService();

  const tasks = [];
  const rampUpDelay = (rampUpSeconds * 1000) / agentCount;

  console.log(`[Test ${testId}] Ramping up ${agentCount} agents over ${rampUpSeconds}s...`);

  for (let i = 0; i < agentCount; i++) {
    // Pass the correct config to the agent
    const agentConfig = { targetUrl, facilitatorUrl, splTokenMint };
    const agentTask = limit(() =>
      runAgentLoop(testId, agentConfig, testEndTime, payerService, facilitatorService)
    );
    tasks.push(agentTask);
    await sleep(rampUpDelay);
  }

  console.log(`[Test ${testId}] All agents are running.`);
  await Promise.all(tasks);
  await telemetryService.flush();
  console.log(`[Test ${testId}] Simulation completed.`);
}