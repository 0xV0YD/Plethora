import { SimulationConfig } from "@/pages/Index";
import { CheckCircle2, Download, Rocket } from "lucide-react";

interface SummaryStepProps {
  config: SimulationConfig;
  onBack: () => void;
  onDeploy: () => void;
}

export const SummaryStep = ({ config, onBack, onDeploy }: SummaryStepProps) => {
  const handleSaveLocal = () => {
    const yaml = Object.entries(config)
      .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${value}"` : value}`)
      .join('\n');
    
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = config.outputFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-slide-in-up">
      <div className="bg-card rounded-2xl p-8 space-y-6 glow-box border border-border">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-success terminal-glow" />
          <h2 className="text-3xl font-bold font-mono text-success terminal-glow">
            Configuration Complete
          </h2>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="grid gap-4">
          <SummaryItem icon="🔧" label="Backend Endpoint" value={config.backendEndpoint} />
          <SummaryItem icon="🎯" label="Target Endpoint" value={config.targetEndpoint} />
          <SummaryItem icon="⚡" label="Concurrent Agents" value={config.numAgents.toLocaleString()} />
          <SummaryItem icon="⏱️" label="Test Duration" value={`${config.testDuration} seconds`} />
          <SummaryItem icon="📈" label="Ramp-up Period" value={`${config.rampUpPeriod} seconds`} />
          <SummaryItem icon="🌊" label="Traffic Pattern" value={config.trafficPattern} />
          <SummaryItem icon="⛓️" label="Solana Network" value={config.solanaNetwork} />
          <SummaryItem icon="💰" label="Wallet Pool Size" value={`${config.payerWalletCount} wallets`} />
          <SummaryItem icon="💾" label="Output File" value={config.outputFile} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={onBack}
          className="p-6 bg-muted text-muted-foreground rounded-xl font-mono hover:bg-muted/80 transition-all"
        >
          <span className="text-2xl mb-2 block">←</span>
          <span className="text-sm">Go Back</span>
        </button>
        
        <button
          onClick={handleSaveLocal}
          className="p-6 bg-card border border-border rounded-xl font-mono hover:border-primary/50 transition-all glow-box group"
        >
          <Download className="w-8 h-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-sm text-foreground">Save Locally</span>
        </button>
        
        <button
          onClick={onDeploy}
          className="p-6 bg-primary text-primary-foreground rounded-xl font-mono font-bold glow-box hover:scale-105 transition-all group"
        >
          <Rocket className="w-8 h-8 mx-auto mb-2 group-hover:animate-float" />
          <span className="text-sm">Deploy & Run</span>
        </button>
      </div>
    </div>
  );
};

const SummaryItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
    <span className="text-2xl">{icon}</span>
    <div className="flex-1">
      <div className="text-sm text-muted-foreground font-mono">{label}</div>
      <div className="text-foreground font-mono font-bold">{value}</div>
    </div>
  </div>
);
