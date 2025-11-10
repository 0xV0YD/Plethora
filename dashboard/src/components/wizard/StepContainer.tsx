import { ReactNode } from "react";

interface StepContainerProps {
  title: string;
  emoji: string;
  description: string;
  children: ReactNode;
}

export const StepContainer = ({ title, emoji, description, children }: StepContainerProps) => {
  return (
    <div className="bg-card rounded-2xl p-8 space-y-6 glow-box border border-border">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-float">{emoji}</span>
          <h2 className="text-3xl font-bold font-mono text-primary terminal-glow">
            {title}
          </h2>
        </div>
        <p className="text-muted-foreground font-mono text-sm pl-14">
          {description}
        </p>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};
