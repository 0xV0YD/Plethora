import { StepContainer } from "../StepContainer";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface StepDurationProps {
  value: number;
  onChange: (value: number) => void;
}

export const StepDuration = ({ value, onChange }: StepDurationProps) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  return (
    <StepContainer
      title="Duration Settings"
      emoji="⏱️"
      description="Set how long your load test should run"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-foreground font-mono">Test Duration</Label>
          <div className="flex items-center justify-center gap-4 my-8">
            <Clock className="w-8 h-8 text-primary terminal-glow" />
            <div className="text-5xl font-bold font-mono text-primary terminal-glow-strong">
              {minutes > 0 && <span>{minutes}<span className="text-2xl">m</span> </span>}
              <span>{seconds}<span className="text-2xl">s</span></span>
            </div>
          </div>
          <Slider
            value={[value]}
            onValueChange={([v]) => onChange(v)}
            min={10}
            max={600}
            step={10}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>10s</span>
            <span>5min</span>
            <span>10min</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[60, 300, 600].map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={`p-3 rounded-lg font-mono text-sm transition-all ${
                value === preset
                  ? "bg-primary text-primary-foreground glow-box"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {preset / 60}min
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground font-mono">
          💡 Longer tests provide more accurate performance metrics
        </p>
      </div>
    </StepContainer>
  );
};
