import { SimulationConfig, DeploymentResponse, SimulationStatusResponse } from "@/types/simulation";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8888";

export const api = {
  deploySimulation: async (config: SimulationConfig): Promise<DeploymentResponse> => {
    console.log(config)
    const response = await fetch(`${API_BASE}/api/simulation/deploy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (!response.ok) throw new Error("Failed to deploy simulation");
    return response.json();
  },

  getSimulationStatus: async (id: string): Promise<SimulationStatusResponse> => {
    const response = await fetch(`${API_BASE}/api/simulation/${id}/status`);
    if (!response.ok) throw new Error("Failed to fetch simulation status");
    return response.json();
  },

  stopSimulation: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/simulation/${id}/stop`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to stop simulation");
  },
};
