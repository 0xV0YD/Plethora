import { useParams } from "react-router-dom";
import { SimulationDashboard } from "@/components/SimulationDashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Simulation ID</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <SimulationDashboard simulationId={id} />
      </main>
    </div>
  );
}
