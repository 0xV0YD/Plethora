import { PayerService } from './payerService.js';
import { telemetryService } from './telemetryService.js';
import { runSingleAgentRequest } from './agent.js';
import dotenv from 'dotenv';

dotenv.config();

// This is an async IIFE (Immediately Invoked Function Expression)
// This is the standard way to run an async script and wait for it
(async () => {
  try {
    console.log("Make sure your x402-express server is running on localhost:4021...");
    
    telemetryService.initialize();
    const payerService = new PayerService(
      ["https://api.devnet.solana.com"], 
      process.env.SPL_TOKEN_MINT
    );

    // Give the payer service a moment to load wallets
    await new Promise(r => setTimeout(r, 100)); 

    const testConfig = {
      targetUrl: "http://localhost:4021/premium/content", 
    };

    console.log("--- Starting Single Agent Test ---");
    // This will NOW wait for the function to finish
    await runSingleAgentRequest("manual-test-1", testConfig, payerService);
    console.log("--- Test Script Finished Successfully ---");

  } catch (err) {
    // This will catch any errors from setup or the agent
    console.error("--- Test Script FAILED ---");
    console.error(err.message);
  } finally {
    // Ensure metrics are flushed before exiting
    await telemetryService.flush();
    console.log("Metrics flushed. Exiting.");
  }
})();