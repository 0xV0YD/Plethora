import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimePoint } from "@/types/simulation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PerformanceChartProps {
  data: TimePoint[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const formattedData = data.map((point) => ({
    time: new Date(point.timestamp * 1000).toLocaleTimeString(),
    rps: point.rps,
    latency: point.latency,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="time" 
              className="text-xs text-muted-foreground"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              yAxisId="left"
              className="text-xs text-muted-foreground"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              label={{ value: "RPS", angle: -90, position: "insideLeft" }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              className="text-xs text-muted-foreground"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              label={{ value: "Latency (ms)", angle: 90, position: "insideRight" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="rps" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              dot={false}
              name="Requests/sec"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="latency" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              dot={false}
              name="Latency (ms)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
