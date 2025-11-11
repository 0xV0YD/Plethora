import fs from 'fs';

class TelemetryService {
  constructor() {
    this.logFile = 'results.jsonl'; // JSON Lines format
    console.log(`[Telemetry] Logging results to ${this.logFile}`);
  }

  initialize() {
    // No InfluxDB, so nothing to init!
  }

  writePoint(metrics) {
    try {
      // Convert metrics to a JSON string
      const logLine = JSON.stringify(metrics);
      // Append the string as a new line in the file
      // This is simple and won't crash
      fs.appendFileSync(this.logFile, logLine + '\n');
    } catch (err) {
      console.error(`[TelemetryError] Failed to write to log file: ${err.message}`);
    }
  }

  async flush() {
    // No buffer to flush, so do nothing
    return Promise.resolve();
  }
}

// Export a single instance
export const telemetryService = new TelemetryService();