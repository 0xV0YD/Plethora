import { StepContainer } from "../StepContainer";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface StepLoadProps {
  value: number;
  onChange: (value: number) => void;
}

export const StepLoad = ({ value, onChange }: StepLoadProps) => {
  const maxAgents = 5000;
  const percentage = (value / maxAgents) * 100;
  
  const getLoadColor = () => {
    if (percentage < 30) return "text-success";
    if (percentage < 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <StepContainer
      title="Load Configuration"
      emoji="⚡"
      description="Configure the number of concurrent agents for your load test"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-foreground font-mono">Concurrent Agents</Label>
            <span className={`text-3xl font-bold font-mono terminal-glow ${getLoadColor()}`}>
              {value.toLocaleString()}
            </span>
          </div>
          <Slider
            value={[value]}
            onValueChange={([v]) => onChange(v)}
            min={1}
            max={maxAgents}
            step={50}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>1</span>
            <span>2,500</span>
            <span>5,000</span>
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-mono text-muted-foreground">Load Intensity</span>
            <span className={`text-sm font-mono font-bold ${getLoadColor()}`}>
              {percentage < 30 ? "Light" : percentage < 70 ? "Moderate" : "Heavy"}
            </span>
          </div>
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                percentage < 30 ? "bg-success" : percentage < 70 ? "bg-warning" : "bg-destructive"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-mono">
          💡 Recommended: 100-5000 agents depending on your infrastructure
        </p>
      </div>
    </StepContainer>
  );
};
