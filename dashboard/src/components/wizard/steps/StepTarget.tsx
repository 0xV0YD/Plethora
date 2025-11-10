import { StepContainer } from "../StepContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepTargetProps {
  value: string;
  onChange: (value: string) => void;
}

export const StepTarget = ({ value, onChange }: StepTargetProps) => {
  return (
    <StepContainer
      title="Target Configuration"
      emoji="🎯"
      description="Define the API endpoint you want to load test"
    >
      <div className="space-y-3">
        <Label htmlFor="target" className="text-foreground font-mono">
          Target API Endpoint
        </Label>
        <Input
          id="target"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono bg-input border-border text-foreground glow-border"
          placeholder="https://api.my-service.com/data"
        />
        <p className="text-xs text-muted-foreground font-mono">
          💡 All simulated traffic will be directed to this endpoint
        </p>
      </div>
    </StepContainer>
  );
};
