import { InfluxDB, Point } from '@influxdata/influxdb-client';

class TelemetryService {
  constructor() {
    this.pointBuffer = [];
    this.bufferSize = 50; // Write in batches
  }

  initialize() {
    const url = process.env.INFLUX_URL;
    const token = process.env.INFLUX_TOKEN;
    const org = process.env.INFLUX_ORG;
    this.bucket = process.env.INFLUX_BUCKET;

    if (!url || !token || !org || !this.bucket) {
      console.warn('InfluxDB env vars not set. Telemetry will be disabled.');
      this.writeApi = null;
      return;
    }

    try {
      this.influxClient = new InfluxDB({ url, token });
      this.writeApi = this.influxClient.getWriteApi(org, this.bucket, 'ns');
      console.log('Telemetry Service Initialized.');
    } catch (err) {
      console.error(`[TelemetryError] Failed to initialize InfluxDB: ${err.message}`);
      this.writeApi = null;
    }
  }

  // --- **THIS IS THE NEW, DEFENSIVE FUNCTION** ---
  writePoint(metrics) {
    if (!this.writeApi) return; // Do nothing if not initialized

    let point;
    try {
      // 1. Create the point
      point = new Point('x402_handshake');
      if (typeof point.setTag !== 'function') {
        // This is the check. If this fails, the import is broken.
        throw new Error('InfluxDB Point object is invalid. .setTag is not a function.');
      }

      // 2. Set tags safely
      point.setTag('testId', metrics.testId || 'unknown');
      point.setTag('statusCode', String(metrics.statusCode || 500));
      
      // 3. Set fields safely
      point.intField('totalTimeMs', metrics.totalTimeMs || 0);
      point.intField('r1_time', metrics.r1_time || 0);
      point.intField('r2_time', metrics.r2_time || 0);
      point.intField('signTimeMs', metrics.signTimeMs || 0);
      
      if (metrics.error) {
        point.stringField('error', String(metrics.error));
      }
      
      // 4. Set timestamp safely
      if (metrics.loopStartTime && typeof metrics.loopStartTime === 'number') {
        point.setTimestamp(new Date(metrics.loopStartTime));
      } else {
        point.setTimestamp(new Date());
      }

      // 5. Add to buffer
      this.pointBuffer.push(point);

      if (this.pointBuffer.length >= this.bufferSize) {
        this.flush();
      }
    } catch (err) {
      // This will now give us a much clearer error
      console.error(`[TelemetryError] Failed to write point: ${err.message}`);
    }
  }

  async flush() {
    if (!this.writeApi || this.pointBuffer.length === 0) return;

    console.log(`[Telemetry] Flushing ${this.pointBuffer.length} points...`);
    try {
      this.writeApi.writePoints(this.pointBuffer);
      this.pointBuffer = []; // Clear buffer
      await this.writeApi.flush();
    } catch (err) {
      console.error(`[TelemetryError] Failed to flush points: ${err.message}`);
    }
  }
}

// Export a single instance
export const telemetryService = new TelemetryService();