import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MetricCard } from "./MetricCard";
import { PerformanceChart } from "./PerformanceChart";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, CheckCircle2, XCircle, StopCircle, TrendingUp } from "lucide-react";
import { SimulationStatus } from "@/types/simulation";
import { toast } from "sonner";

interface SimulationDashboardProps {
  simulationId: string;
  onStop?: () => void;
}

export function SimulationDashboard({ simulationId, onStop }: SimulationDashboardProps) {
  const [isStopping, setIsStopping] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["simulation", simulationId],
    queryFn: () => api.getSimulationStatus(simulationId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "RUNNING" || status === "PENDING" ? 1500 : false;
    },
  });

  const handleStop = async () => {
    setIsStopping(true);
    try {
      await api.stopSimulation(simulationId);
      toast.success("Simulation stopped successfully");
      onStop?.();
    } catch (error) {
      toast.error("Failed to stop simulation");
    } finally {
      setIsStopping(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading simulation data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <XCircle className="h-12 w-12 mx-auto mb-4" />
            <p>Failed to load simulation data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { metrics, status, elapsedSeconds, totalDuration, activeAgents } = data;
  const progress = (elapsedSeconds / totalDuration) * 100;
  const successRate = metrics.totalRequests > 0 
    ? ((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(1) 
    : "0.0";

  const currentRPS = metrics.timeSeries.length > 0 
    ? metrics.timeSeries[metrics.timeSeries.length - 1].rps 
    : 0;

  const getStatusBadge = (status: SimulationStatus) => {
    const variants: Record<SimulationStatus, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      PENDING: { variant: "outline", label: "Pending" },
      RUNNING: { variant: "default", label: "Running" },
      STOPPING: { variant: "secondary", label: "Stopping" },
      COMPLETED: { variant: "outline", label: "Completed" },
      FAILED: { variant: "destructive", label: "Failed" },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Simulation {simulationId}</CardTitle>
              <div className="flex items-center gap-3 mt-2">
                {getStatusBadge(status)}
                <span className="text-sm text-muted-foreground">
                  {activeAgents} active agents
                </span>
              </div>
            </div>
            {(status === "RUNNING" || status === "PENDING") && (
              <Button 
                variant="destructive" 
                onClick={handleStop}
                disabled={isStopping}
              >
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Test
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{elapsedSeconds}s / {totalDuration}s</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Throughput"
          value={`${currentRPS} req/s`}
          icon={TrendingUp}
          variant="default"
          subtitle="Current requests per second"
        />
        <MetricCard
          title="Avg. Latency"
          value={`${metrics.averageLatencyMs}ms`}
          icon={Clock}
          variant="warning"
          subtitle="Average response time"
        />
        <MetricCard
          title="Success Rate"
          value={`${successRate}%`}
          icon={CheckCircle2}
          variant="success"
          subtitle={`${metrics.successfulRequests} / ${metrics.totalRequests}`}
        />
        <MetricCard
          title="Failed Requests"
          value={metrics.failedRequests}
          icon={XCircle}
          variant="error"
          subtitle={`${((metrics.failedRequests / metrics.totalRequests) * 100).toFixed(1)}% error rate`}
        />
      </div>

      {/* Performance Chart */}
      {metrics.timeSeries.length > 0 && (
        <PerformanceChart data={metrics.timeSeries} />
      )}

      {/* Error Breakdown */}
      {Object.keys(metrics.errorCounts).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Error Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(metrics.errorCounts).map(([errorType, count]) => (
                <div key={errorType} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{errorType}</span>
                  <Badge variant="destructive">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
