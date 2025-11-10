import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  variant?: "default" | "success" | "warning" | "error";
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend = "neutral", 
  subtitle,
  variant = "default" 
}: MetricCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-lg",
          variant === "success" && "bg-success/10 text-success",
          variant === "warning" && "bg-accent/10 text-accent",
          variant === "error" && "bg-destructive/10 text-destructive",
          variant === "default" && "bg-primary/10 text-primary"
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
