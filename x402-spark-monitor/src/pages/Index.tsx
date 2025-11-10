import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfigForm } from "@/components/ConfigForm";
import { api } from "@/lib/api";
import { SimulationConfig } from "@/types/simulation";
import { toast } from "sonner";
import { Activity, Zap, Shield, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async (config: SimulationConfig) => {
    setIsDeploying(true);
    try {
      const response = await api.deploySimulation(config);
      toast.success("Simulation deployed successfully!");
      navigate(`/dashboard/${response.simulation_id}`);
    } catch (error) {
      toast.error("Failed to deploy simulation. Make sure the Go backend is running on port 8888.");
      console.error(error);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              x402 Developer Tool
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Load Test Engine for x402 Payment APIs
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Stress-test your x402 payment flows with concurrent virtual agents. 
              Monitor throughput, latency, and error rates in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Activity className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Real-Time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track API throughput, response times, and error rates as your simulation runs with live dashboards.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-4" />
              <CardTitle>x402 Payment Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Simulates the complete x402 handshake: 402 response, blockchain payment, and authorized request.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Identify bottlenecks with detailed metrics on HTTP errors, blockchain failures, and latency distribution.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Deploy Form */}
        <div className="max-w-2xl mx-auto">
          <ConfigForm onDeploy={handleDeploy} isDeploying={isDeploying} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-sm text-muted-foreground">
            Built for the x402 Hackathon · Best x402 Dev Tool Category
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
