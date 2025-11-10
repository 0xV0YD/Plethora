import { useState } from "react";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { WizardProgress } from "@/components/wizard/WizardProgress";
import { StepBackend } from "@/components/wizard/steps/StepBackend";
import { StepTarget } from "@/components/wizard/steps/StepTarget";
import { StepLoad } from "@/components/wizard/steps/StepLoad";
import { StepDuration } from "@/components/wizard/steps/StepDuration";
import { StepRampUp } from "@/components/wizard/steps/StepRampUp";
import { StepPattern } from "@/components/wizard/steps/StepPattern";
import { StepNetwork } from "@/components/wizard/steps/StepNetwork";
import { StepWallets } from "@/components/wizard/steps/StepWallets";
import { StepOutput } from "@/components/wizard/steps/StepOutput";
import { SummaryStep } from "@/components/wizard/SummaryStep";
import { DeploymentStep } from "@/components/wizard/DeploymentStep";

export interface SimulationConfig {
  backendEndpoint: string;
  targetEndpoint: string;
  numAgents: number;
  testDuration: number;
  rampUpPeriod: number;
  trafficPattern: string;
  solanaNetwork: string;
  payerWalletCount: number;
  outputFile: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<SimulationConfig>({
    backendEndpoint: "http://localhost:8080/api",
    targetEndpoint: "https://api.my-service.com/data",
    numAgents: 1000,
    testDuration: 300,
    rampUpPeriod: 60,
    trafficPattern: "Constant Load",
    solanaNetwork: "devnet",
    payerWalletCount: 10,
    outputFile: "config.yaml",
  });
  const [isDeploying, setIsDeploying] = useState(false);

  const totalSteps = 9;

  const updateConfig = (key: keyof SimulationConfig, value: string | number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps + 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setCurrentStep(totalSteps + 1);
  };

  const renderStep = () => {
    if (currentStep === totalSteps) {
      return <SummaryStep config={config} onBack={prevStep} onDeploy={handleDeploy} />;
    }

    if (currentStep === totalSteps + 1) {
      return <DeploymentStep config={config} />;
    }

    const steps = [
      <StepBackend value={config.backendEndpoint} onChange={(v) => updateConfig("backendEndpoint", v)} />,
      <StepTarget value={config.targetEndpoint} onChange={(v) => updateConfig("targetEndpoint", v)} />,
      <StepLoad value={config.numAgents} onChange={(v) => updateConfig("numAgents", v)} />,
      <StepDuration value={config.testDuration} onChange={(v) => updateConfig("testDuration", v)} />,
      <StepRampUp 
        value={config.rampUpPeriod} 
        totalDuration={config.testDuration}
        onChange={(v) => updateConfig("rampUpPeriod", v)} 
      />,
      <StepPattern value={config.trafficPattern} onChange={(v) => updateConfig("trafficPattern", v)} />,
      <StepNetwork value={config.solanaNetwork} onChange={(v) => updateConfig("solanaNetwork", v)} />,
      <StepWallets value={config.payerWalletCount} onChange={(v) => updateConfig("payerWalletCount", v)} />,
      <StepOutput value={config.outputFile} onChange={(v) => updateConfig("outputFile", v)} />,
    ];

    return steps[currentStep];
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <WizardHeader />
        {currentStep < totalSteps && (
          <WizardProgress current={currentStep + 1} total={totalSteps} />
        )}
        <div className="animate-slide-in-up">
          {renderStep()}
        </div>
        {currentStep < totalSteps && (
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-muted text-muted-foreground rounded-lg font-mono disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted/80 transition-all"
            >
              ← Back
            </button>
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-mono font-bold glow-box hover:scale-105 transition-all"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
