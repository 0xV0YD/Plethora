import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";
import { SimulationConfig } from "@/types/simulation";

interface ConfigFormProps {
  onDeploy: (config: SimulationConfig) => void;
  isDeploying: boolean;
}

export function ConfigForm({ onDeploy, isDeploying }: ConfigFormProps) {
  const [config, setConfig] = useState<SimulationConfig>({
    target_endpoint: "http://localhost:4021/weather",
    num_agents: 50,
    test_duration_seconds: 60,
    ramp_up_period_seconds: 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDeploy(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          Deploy Load Test
        </CardTitle>
        <CardDescription>
          Configure and launch your x402 API load test simulation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint">Target Endpoint</Label>
            <Input
              id="endpoint"
              type="url"
              placeholder="http://localhost:4021/weather"
              value={config.target_endpoint}
              onChange={(e) => setConfig({ ...config, target_endpoint: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agents">Virtual Agents</Label>
              <Input
                id="agents"
                type="number"
                min="1"
                max="1000"
                value={config.num_agents}
                onChange={(e) => setConfig({ ...config, num_agents: parseInt(e.target.value) })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                min="10"
                max="3600"
                value={config.test_duration_seconds}
                onChange={(e) => setConfig({ ...config, test_duration_seconds: parseInt(e.target.value) })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rampup">Ramp-Up (seconds)</Label>
              <Input
                id="rampup"
                type="number"
                min="0"
                max="300"
                value={config.ramp_up_period_seconds}
                onChange={(e) => setConfig({ ...config, ramp_up_period_seconds: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isDeploying}>
            {isDeploying ? "Deploying..." : "Deploy Simulation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
