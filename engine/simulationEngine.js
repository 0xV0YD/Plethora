import pLimit from 'p-limit'; // You may need to run: npm install p-limit
import { PayerService } from './payerService.js';
import { runAgentLoop } from './agent.js'; // This is your working loop!
import { telemetryService } from './telemetryService.js';

// This function is called by apiRoutes.js
export async function startSimulation(testId, config) {
  console.log(`[Engine] Starting simulation ${testId}...`);

  // 1. Read config from the Go CLI (config.go)
  const {
    target_endpoint: targetUrl,
    num_agents: agentCount,
    test_duration_seconds: durationSeconds,
    solana_network: network, // e.g., "devnet"
  } = config;

  if (!targetUrl || !agentCount || !durationSeconds) {
    console.error("[Engine] Invalid config. Missing target_endpoint, num_agents, or test_duration_seconds.");
    return;
  }
  
  // --- 2. Initialize Services ---
  // We use the new PayerService constructor (no splTokenMint)
  const rpcUrl = network === 'mainnet' 
    ? "https://api.mainnet-beta.solana.com" 
    : "https://api.devnet.solana.com";
    
  const payerService = new PayerService([rpcUrl]);
  const testEndTime = Date.now() + durationSeconds * 1000;

  // This is the config object we'll pass to each agent
  const agentConfig = {
    targetUrl: targetUrl,
  };
  
  // --- 3. Create Concurrency Limiter ---
  // This ensures we only run `agentCount` loops at the same time
  const limit = pLimit(agentCount);

  console.log(`[Engine] Spawning ${agentCount} agents to attack ${targetUrl} for ${durationSeconds}s...`);

  // --- 4. Create Agent Tasks ---
  const tasks = [];
  for (let i = 0; i < agentCount; i++) {
    // Create an async task for each agent
    const agentTask = limit(() =>
      runAgentLoop(testId, agentConfig, testEndTime, payerService)
    );
    tasks.push(agentTask);
  }

  // --- 5. Execute All Tasks in Parallel ---
  // This line starts all agents at once (up to the limit)
  await Promise.all(tasks);

  // --- 6. Test is Finished ---
  await telemetryService.flush();
  console.log(`[Engine] Simulation ${testId} completed.`);
  console.log(`[Engine] Results saved to results.jsonl`);
}