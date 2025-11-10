import { StepContainer } from "../StepContainer";
import { Activity, Zap, TrendingUp } from "lucide-react";

interface StepPatternProps {
  value: string;
  onChange: (value: string) => void;
}

const patterns = [
  {
    name: "Constant Load",
    description: "Steady continuous load throughout the test",
    icon: Activity,
    visual: "━━━━━━━━━━",
  },
  {
    name: "Spike Load",
    description: "Sudden bursts of traffic to test resilience",
    icon: Zap,
    visual: "━╻━╻━╻━╻━",
  },
  {
    name: "Stress Test",
    description: "Gradually increasing load to find breaking point",
    icon: TrendingUp,
    visual: "╱╱╱╱╱━━━━━",
  },
];

export const StepPattern = ({ value, onChange }: StepPatternProps) => {
  return (
    <StepContainer
      title="Traffic Pattern"
      emoji="🌊"
      description="Choose how traffic should be distributed over time"
    >
      <div className="grid gap-4">
        {patterns.map((pattern) => {
          const Icon = pattern.icon;
          const isSelected = value === pattern.name;
          
          return (
            <button
              key={pattern.name}
              onClick={() => onChange(pattern.name)}
              className={`text-left p-6 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 glow-box"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold font-mono ${
                      isSelected ? "text-primary terminal-glow" : "text-foreground"
                    }`}>
                      {pattern.name}
                    </h3>
                    {isSelected && (
                      <span className="text-xs font-mono text-primary terminal-glow">✓ SELECTED</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    {pattern.description}
                  </p>
                  <div className="text-2xl font-mono text-primary terminal-glow pt-2">
                    {pattern.visual}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </StepContainer>
  );
};
