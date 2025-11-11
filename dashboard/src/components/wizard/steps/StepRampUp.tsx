import { StepContainer } from "../StepContainer";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";

interface StepRampUpProps {
  value: number;
  totalDuration: number;
  onChange: (value: number) => void;
}

export const StepRampUp = ({ value, totalDuration, onChange }: StepRampUpProps) => {
  const rampUpPercentage = (value / totalDuration) * 100;
  const fullLoadPercentage = 100 - rampUpPercentage;

  return (
    <StepContainer
      title="Ramp-up Configuration"
      emoji="📈"
      description="Gradually increase load before hitting maximum capacity"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-foreground font-mono">Ramp-up Period</Label>
            <span className="text-2xl font-bold font-mono text-primary terminal-glow">
              {value}s
            </span>
          </div>
          <Slider
            value={[value]}
            onValueChange={([v]) => onChange(v)}
            min={0}
            max={Math.min(totalDuration, 300)}
            step={5}
            className="py-4"
          />
        </div>

        <div className="bg-muted/30 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 text-sm font-mono text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-warning" />
            <span>Load Distribution Timeline</span>
          </div>
          
          <div className="relative h-8 bg-background rounded-lg overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-warning/70 flex items-center justify-center text-xs font-mono text-warning-foreground"
              style={{ width: `${rampUpPercentage}%` }}
            >
              {rampUpPercentage > 15 && "Ramp-up"}
            </div>
            <div
              className="absolute top-0 h-full bg-success flex items-center justify-center text-xs font-mono text-success-foreground"
              style={{ left: `${rampUpPercentage}%`, width: `${fullLoadPercentage}%` }}
            >
              {fullLoadPercentage > 15 && "Full Load"}
            </div>
          </div>

          <div className="flex justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-warning/70 rounded" />
              <span className="text-muted-foreground">
                Ramp-up: {value}s ({rampUpPercentage.toFixed(0)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded" />
              <span className="text-muted-foreground">
                Full: {totalDuration - value}s ({fullLoadPercentage.toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-mono">
          💡 Gradual ramp-up prevents overwhelming your system at start
        </p>
      </div>
    </StepContainer>
  );
};
