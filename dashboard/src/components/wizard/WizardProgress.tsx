interface WizardProgressProps {
  current: number;
  total: number;
}

export const WizardProgress = ({ current, total }: WizardProgressProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-3 animate-slide-in-up">
      <div className="flex justify-between items-center font-mono text-sm">
        <span className="text-primary terminal-glow">Step {current}/{total}</span>
        <span className="text-muted-foreground">{Math.round(percentage)}% Complete</span>
      </div>
      <div className="relative h-3 bg-muted rounded-full overflow-hidden glow-border">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
      </div>
      <div className="flex justify-between">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-8 h-1 rounded-full transition-all duration-300 ${
              i < current
                ? "bg-primary glow-box"
                : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
