import { telemetryService } from './telemetryService.js';

/**
 * Runs the new agent loop:
 * 1. GET /resource -> 402
 * 2. Create & Sign TX
 * 3. POST /facilitator -> (Yash handles the rest)
 */
export async function runAgentLoop(
  testId,
  config,
  testEndTime,
  payerService,
  facilitatorService
) {
  const { targetUrl, facilitatorUrl } = config;

  while (Date.now() < testEndTime) {
    const loopMetrics = {
      testId: testId,
      loopStartTime: Date.now(),
      statusCode: 0, // This will be the FACILITATOR's status code
    };

    try {
      // --- Step 1: GET /resource -> 402 (Your Step 2) ---
      const r1_start = Date.now();
      const r1_response = await fetch(targetUrl);
      loopMetrics.r1_time = Date.now() - r1_start;

      if (r1_response.status !== 402) {
        loopMetrics.statusCode = r1_response.status;
        throw new Error(`Expected 402, got ${r1_response.status}`);
      }
      const paymentDetails = await r1_response.json();

      // --- Step 2: Create Signed TX (Your Step 3, part 1) ---
      const { serializedTx_base64, signTimeMs } =
        await payerService.createSignedTransaction(paymentDetails);
      loopMetrics.signTimeMs = signTimeMs;

      // --- Step 3: Send to Facilitator (Your Step 3, part 2) ---
      const fac_start = Date.now();
      const fac_response = await facilitatorService.submitToFacilitator(
        facilitatorUrl,
        serializedTx_base64
      );
      loopMetrics.facilitatorTimeMs = Date.now() - fac_start;
      
      // We record the status code from the facilitator
      loopMetrics.statusCode = fac_response.status;
      
      if (!fac_response.ok) {
         // The facilitator rejected our signed tx
        throw new Error(`Facilitator error: ${fac_response.status}`);
      }
      
    } catch (err) {
      loopMetrics.error = err.message;
      if (loopMetrics.statusCode === 0 || loopMetrics.statusCode === 200) {
        loopMetrics.statusCode = 500; // Generic agent error
      }
    } finally {
      // --- Step 4: Record Metrics ---
      loopMetrics.totalTimeMs = Date.now() - loopMetrics.loopStartTime;
      telemetryService.writePoint(loopMetrics);
    }
  }
}