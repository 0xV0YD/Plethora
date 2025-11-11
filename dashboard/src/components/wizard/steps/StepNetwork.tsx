import { StepContainer } from "../StepContainer";
import { Network, AlertTriangle } from "lucide-react";

interface StepNetworkProps {
  value: string;
  onChange: (value: string) => void;
}

const networks = [
  {
    name: "devnet",
    label: "Development Network",
    description: "Safe testing environment for development",
    color: "success",
    warning: false,
  },
  {
    name: "testnet",
    label: "Test Network",
    description: "More realistic environment for pre-production testing",
    color: "warning",
    warning: false,
  },
  {
    name: "mainnet-beta",
    label: "Mainnet Beta",
    description: "Production network - use with extreme caution!",
    color: "destructive",
    warning: true,
  },
];

export const StepNetwork = ({ value, onChange }: StepNetworkProps) => {
  return (
    <StepContainer
      title="Blockchain Network"
      emoji="⛓️"
      description="Select the Solana network for your simulation"
    >
      <div className="grid gap-4">
        {networks.map((network) => {
          const isSelected = value === network.name;
          
          return (
            <button
              key={network.name}
              onClick={() => onChange(network.name)}
              className={`text-left p-6 rounded-xl border-2 transition-all ${
                isSelected
                  ? `border-${network.color} bg-${network.color}/10 glow-box`
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  isSelected 
                    ? `bg-${network.color} text-${network.color}-foreground` 
                    : "bg-muted text-muted-foreground"
                }`}>
                  <Network className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold font-mono ${
                      isSelected ? `text-${network.color} terminal-glow` : "text-foreground"
                    }`}>
                      {network.label}
                    </h3>
                    {isSelected && (
                      <span className={`text-xs font-mono text-${network.color} terminal-glow`}>
                        ✓ SELECTED
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    {network.description}
                  </p>
                  {network.warning && isSelected && (
                    <div className="flex items-center gap-2 text-destructive text-xs font-mono mt-3 p-2 bg-destructive/10 rounded">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Production network selected - ensure you understand the implications</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </StepContainer>
  );
};
