import { StepContainer } from "../StepContainer";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";

interface StepWalletsProps {
  value: number;
  onChange: (value: number) => void;
}

export const StepWallets = ({ value, onChange }: StepWalletsProps) => {
  const displayWallets = Math.min(value, 20);
  
  return (
    <StepContainer
      title="Wallet Configuration"
      emoji="💰"
      description="Configure pre-funded wallet pool for distributing load"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-foreground font-mono">Wallet Pool Size</Label>
            <span className="text-3xl font-bold font-mono text-primary terminal-glow">
              {value}
            </span>
          </div>
          <Slider
            value={[value]}
            onValueChange={([v]) => onChange(v)}
            min={1}
            max={100}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>1</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4 text-sm font-mono text-muted-foreground">
            <Wallet className="w-4 h-4 text-primary" />
            <span>Visual Wallet Pool</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: displayWallets }).map((_, i) => (
              <div
                key={i}
                className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary glow-box animate-slide-in-up"
                style={{ animationDelay: `${i * 0.02}s` }}
              >
                <Wallet className="w-5 h-5" />
              </div>
            ))}
            {value > 20 && (
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground font-mono text-xs">
                +{value - 20}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[5, 10, 25, 50].map((preset) => (
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

        <p className="text-xs text-muted-foreground font-mono">
          💡 More wallets = better load distribution across the blockchain
        </p>
      </div>
    </StepContainer>
  );
};
