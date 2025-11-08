import { InfluxDB, Point } from '@influxdata/influxdb-client';

class TelemetryService {
  constructor() {
    this.pointBuffer = [];
    this.bufferSize = 50; // Write to InfluxDB in batches of 50
  }

  initialize() {
    const url = process.env.INFLUX_URL;
    const token = process.env.INFLUX_TOKEN;
    const org = process.env.INFLUX_ORG;
    this.bucket = process.env.INFLUX_BUCKET;

    if (!url || !token || !org || !this.bucket) {
      console.warn(
        'InfluxDB env vars not set. Telemetry will be disabled.'
      );
      this.writeApi = null;
      return;
    }

    this.influxClient = new InfluxDB({ url, token });
    this.writeApi = this.influxClient.getWriteApi(org, this.bucket, 'ns');
    console.log('Telemetry Service Initialized.');
  }

  writePoint(metrics) {
    if (!this.writeApi) return; // Do nothing if not initialized 

    const point = new Point('x402_handshake')
      .setTimestamp(new Date(metrics.loopStartTime))
      .setTag('testId', metrics.testId)
      .setTag('statusCode', String(metrics.statusCode)) // Status from FACILITATOR
      .intField('totalTimeMs', metrics.totalTimeMs || 0)
      .intField('r1_time', metrics.r1_time || 0) // Time to get 402
      .intField('signTimeMs', metrics.signTimeMs || 0) // Time to sign tx
      .intField('facilitatorTimeMs', metrics.facilitatorTimeMs || 0); // Time for facilitator to respond

    
    if (metrics.error) {
      point.stringField('error', metrics.error);
    }

    this.pointBuffer.push(point);

    if (this.pointBuffer.length >= this.bufferSize) {
      this.flush();
    }
  }

  async flush() {
    if (!this.writeApi || this.pointBuffer.length === 0) return;

    console.log(`[Telemetry] Flushing ${this.pointBuffer.length} points...`);
    this.writeApi.writePoints(this.pointBuffer);
    this.pointBuffer = []; // Clear the buffer
    
    try {
      await this.writeApi.flush();
    } catch (err) {
      console.error(`[TelemetryError] Failed to flush points: ${err.message}`);
    }
  }
}

// Export a singleton instance
export const telemetryService = new TelemetryService();