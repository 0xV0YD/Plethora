import { StepContainer } from "../StepContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepBackendProps {
  value: string;
  onChange: (value: string) => void;
}

export const StepBackend = ({ value, onChange }: StepBackendProps) => {
  return (
    <StepContainer
      title="Backend Configuration"
      emoji="🔧"
      description="Configure your x402 coordinator backend endpoint"
    >
      <div className="space-y-3">
        <Label htmlFor="backend" className="text-foreground font-mono">
          Backend API Endpoint
        </Label>
        <Input
          id="backend"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono bg-input border-border text-foreground glow-border"
          placeholder="http://localhost:8080/api"
        />
        <p className="text-xs text-muted-foreground font-mono">
          💡 This is your x402 coordinator backend service
        </p>
      </div>
    </StepContainer>
  );
};
