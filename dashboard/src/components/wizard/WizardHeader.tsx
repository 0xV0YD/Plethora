import { Terminal } from "lucide-react";

export const WizardHeader = () => {
  return (
    <div className="text-center space-y-6 py-8 animate-slide-in-up">
      <div className="inline-block p-4 bg-card rounded-2xl glow-box">
        <Terminal className="w-16 h-16 text-primary terminal-glow-strong" />
      </div>
      <div className="space-y-2">
        <h1 className="text-6xl font-bold font-mono terminal-glow-strong bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          X402 SIMULATOR
        </h1>
        <p className="text-xl text-muted-foreground font-mono">
          Load Test Configuration Wizard
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono">
        <span className="inline-block w-2 h-2 bg-success rounded-full animate-pulse"></span>
        <span>System Online</span>
      </div>
    </div>
  );
};
