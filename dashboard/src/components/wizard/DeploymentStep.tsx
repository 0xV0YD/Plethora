import { useEffect, useState } from "react";
import { SimulationConfig } from "@/pages/Index";
import { Loader2, CheckCircle2, AlertCircle, BarChart3, Clock, Users } from "lucide-react";

interface DeploymentStepProps {
  config: SimulationConfig;
}

export const DeploymentStep = ({ config }: DeploymentStepProps) => {
  const [status, setStatus] = useState<"connecting" | "uploading" | "deploying" | "success" | "error">("connecting");
  const [progress, setProgress] = useState(0);
  const [deploymentData, setDeploymentData] = useState({
    simulationId: "",
    agentsSpawned: 0,
    startTime: "",
    estimatedEnd: "",
  });

  useEffect(() => {
    const simulate = async () => {
      // Connecting
      setStatus("connecting");
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(33);

      // Uploading
      setStatus("uploading");
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(66);

      // Deploying
      setStatus("deploying");
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProgress(100);

      // Success
      setStatus("success");
      setDeploymentData({
        simulationId: `sim_${Math.random().toString(36).substring(7)}`,
        agentsSpawned: config.numAgents,
        startTime: new Date().toLocaleTimeString(),
        estimatedEnd: new Date(Date.now() + config.testDuration * 1000).toLocaleTimeString(),
      });
    };

    simulate();
  }, [config]);

  return (
    <div className="space-y-8 animate-slide-in-up">
      <div className="bg-card rounded-2xl p-8 space-y-6 glow-box border border-border">
        {status !== "success" ? (
          <>
            <div className="flex items-center gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin terminal-glow" />
              <div>
                <h2 className="text-2xl font-bold font-mono text-primary terminal-glow">
                  {status === "connecting" && "Connecting to Backend..."}
                  {status === "uploading" && "Uploading Configuration..."}
                  {status === "deploying" && "Deploying Simulation..."}
                </h2>
                <p className="text-sm text-muted-foreground font-mono">
                  Please wait while we set up your load test
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-500 animate-pulse-glow"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>Initializing...</span>
                <span>{progress}%</span>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 font-mono text-xs space-y-1 text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className={status === "connecting" ? "text-primary terminal-glow" : "text-success"}>
                  {status === "connecting" ? "⟳" : "✓"} Establishing connection
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={status === "uploading" ? "text-primary terminal-glow" : status === "connecting" ? "" : "text-success"}>
                  {status === "connecting" ? "○" : status === "uploading" ? "⟳" : "✓"} Uploading config
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={status === "deploying" ? "text-primary terminal-glow" : status === "connecting" || status === "uploading" ? "" : "text-success"}>
                  {status === "connecting" || status === "uploading" ? "○" : status === "deploying" ? "⟳" : "✓"} Spawning agents
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-12 h-12 text-success terminal-glow-strong animate-float" />
              <div>
                <h2 className="text-3xl font-bold font-mono text-success terminal-glow">
                  Deployment Successful!
                </h2>
                <p className="text-sm text-muted-foreground font-mono">
                  Your simulation is now running
                </p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-success/50 to-transparent" />

            <div className="grid md:grid-cols-2 gap-4">
              <InfoCard
                icon={<BarChart3 className="w-5 h-5" />}
                label="Simulation ID"
                value={deploymentData.simulationId}
              />
              <InfoCard
                icon={<Users className="w-5 h-5" />}
                label="Agents Spawned"
                value={deploymentData.agentsSpawned.toLocaleString()}
              />
              <InfoCard
                icon={<Clock className="w-5 h-5" />}
                label="Start Time"
                value={deploymentData.startTime}
              />
              <InfoCard
                icon={<Clock className="w-5 h-5" />}
                label="Estimated End"
                value={deploymentData.estimatedEnd}
              />
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-primary">Next Steps</h3>
                  <ul className="space-y-1 text-sm font-mono text-muted-foreground">
                    <li>• Monitor your simulation in real-time</li>
                    <li>• View metrics and performance data</li>
                    <li>• Analyze results when complete</li>
                  </ul>
                </div>
              </div>
            </div>

            <button className="w-full p-4 bg-primary text-primary-foreground rounded-lg font-mono font-bold glow-box hover:scale-105 transition-all">
              View Live Dashboard →
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="p-4 bg-muted/30 rounded-lg space-y-2">
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span className="text-xs font-mono">{label}</span>
    </div>
    <div className="text-lg font-mono font-bold text-primary terminal-glow">
      {value}
    </div>
  </div>
);
