import { StepContainer } from "../StepContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

interface StepOutputProps {
  value: string;
  onChange: (value: string) => void;
}

export const StepOutput = ({ value, onChange }: StepOutputProps) => {
  return (
    <StepContainer
      title="Output Settings"
      emoji="💾"
      description="Specify where to save your configuration"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="output" className="text-foreground font-mono">
            Output Filename
          </Label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="output"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="font-mono bg-input border-border text-foreground glow-border pl-11"
              placeholder="config.yaml"
            />
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            💡 Configuration will be saved in YAML format
          </p>
        </div>

        <div className="bg-muted/30 rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
            <FileText className="w-4 h-4 text-primary" />
            <span>Preview: Configuration Structure</span>
          </div>
          <div className="bg-background rounded p-4 font-mono text-xs text-primary/80 space-y-1">
            <div>backend_endpoint: "..."</div>
            <div>target_endpoint: "..."</div>
            <div>num_agents: ...</div>
            <div>test_duration_seconds: ...</div>
            <div>ramp_up_period_seconds: ...</div>
            <div>traffic_pattern: "..."</div>
            <div>solana_network: "..."</div>
            <div>payer_wallet_count: ...</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {["config.yaml", "simulation.yaml", "loadtest.yaml", "custom.yaml"].map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={`p-3 rounded-lg font-mono text-sm transition-all ${
                value === preset
                  ? "bg-primary text-primary-foreground glow-box"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </StepContainer>
  );
};
