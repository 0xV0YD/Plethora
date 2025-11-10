export interface SimulationConfig {
  target_endpoint: string;
  num_agents: number;
  test_duration_seconds: number;
  ramp_up_period_seconds: number;
}

export type SimulationStatus = "PENDING" | "RUNNING" | "STOPPING" | "COMPLETED" | "FAILED";

export interface TimePoint {
  timestamp: number;
  rps: number;
  latency: number;
}

export interface Metrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatencyMs: number;
  errorCounts: Record<string, number>;
  timeSeries: TimePoint[];
}

export interface SimulationStatusResponse {
  simulation_id: string;
  status: SimulationStatus;
  elapsedSeconds: number;
  totalDuration: number;
  activeAgents: number;
  metrics: Metrics;
}

export interface DeploymentResponse {
  simulation_id: string;
  dashboard_url?: string;
}
