import { PayerService } from './payerService.js';
// import {MemoPayerService} from "./memoPayerService.js";
import { telemetryService } from './telemetryService.js';

/**
 * Executes a single, complete x402 payment flow.
 */
export async function runSingleAgentRequest(testId, config, PayerService) {
  const { targetUrl } = config;
  const agentMetrics = {
    testId: testId,
    loopStartTime: Date.now(),
    statusCode: 0,
  };
  console.log(`[Agent] Starting flow for ${targetUrl}...`); // <-- YOU SHOULD SEE THIS

  try {
    // --- STEP 1: GET /api ---
    console.log(`[Agent] Step 1: Initial GET request...`);
    const r1_start = Date.now();
    const r1_response = await fetch(targetUrl);
    agentMetrics.r1_time = Date.now() - r1_start;

    // --- STEP 2: Receive 402 Payment Required ---
    if (r1_response.status !== 402) {
      agentMetrics.statusCode = r1_response.status;
      throw new Error(`Expected 402, got ${r1_response.status}`);
    }
    console.log(`[Agent] Step 2: Received 402. Parsing requirements...`);
    const paymentRequiredResponse = await r1_response.json();
    const requirements = paymentRequiredResponse.accepts[0]; 

    // --- STEP 3: Create payload (Signed Transaction) ---
    console.log(`[Agent] Step 3: Creating & signing payment payload...`);
    const { serializedTx_base64, signTimeMs } =
      await PayerService.createSignedTransaction(requirements);
    agentMetrics.signTimeMs = signTimeMs;

    // --- Construct the X-PAYMENT header value ---
    // --- **THIS IS THE FIX** ---
    // The server expects `payload` to be an object, not a string.
    const xPaymentObject = {
      x402Version: 1,
      scheme: requirements.scheme,
      network: requirements.network,
      payload: {
        transaction: serializedTx_base64 // We are now sending an object
      },
    };
    // --- End of Fix ---
    const xPaymentHeaderValue = Buffer.from(
      JSON.stringify(xPaymentObject)
    ).toString('base64');

    // --- STEP 4: Include Header X-PAYMENT ---
    console.log(`[Agent] Step 4: Retrying GET with X-PAYMENT header...`);
    const r2_start = Date.now();
    const r2_response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'X-PAYMENT': xPaymentHeaderValue },
    });
    agentMetrics.r2_time = Date.now() - r2_start;
    agentMetrics.statusCode = r2_response.status;

    // --- STEP 12: Receive final response ---
    if (r2_response.ok) {
      // **THIS IS THE PART YOU WANT!**
      const data = await r2_response.json();
      console.log(`[Agent] Step 12: SUCCESS! Received 200 OK.`);
      console.log(`[Agent] Content: ${JSON.stringify(data)}`); // <-- IT WILL PRINT THE JSON
    } else {
      const errorText = await r2_response.text();
      throw new Error(`Final request failed with ${r2_response.status}: ${errorText}`);
    }

  } catch (err) {
    // This will now print any errors
    console.error(`[Agent] FAILED: ${err.message}`);
    agentMetrics.error = err.message;
    if (agentMetrics.statusCode === 0) agentMetrics.statusCode = 500;
  } finally {
    agentMetrics.totalTimeMs = Date.now() - agentMetrics.loopStartTime;
    telemetryService.writePoint(agentMetrics);
  }
}

/**
 * The main loop for the simulation engine.
 */
export async function runAgentLoop(testId, config, testEndTime, PayerService) {
  while (Date.now() < testEndTime) {
    await runSingleAgentRequest(testId, config, PayerService);
  }
}