package main

import (
	"fmt"
	"time"

	"x402-wizard/client"
	"x402-wizard/config"
	"x402-wizard/ui"

	"github.com/briandowns/spinner"
)

func main() {
	ui.ClearScreen()
	ui.ShowWelcomeAnimation()
	time.Sleep(800 * time.Millisecond)

	ui.PrintEnhancedBanner()
	time.Sleep(500 * time.Millisecond)

	ui.PrintGlowSection("Welcome to the x402 Simulator Setup Wizard")
	ui.PrintGradientText("✨ This tool will help you configure your load test interactively", "cyan", "magenta")
	ui.PrintNeonDivider()

	time.Sleep(300 * time.Millisecond)

	cfg := config.SimulationConfig{}
	stepNumber := 1

	// Step 1: Backend Endpoint
	ui.PrintNeonStep(stepNumber, "Backend Configuration", "🔧")
	stepNumber++
	cfg.BackendEndpoint = ui.PromptStringWithGlow(
		"Enter the x402 backend API endpoint",
		"http://localhost:8080/api",
		"This is your x402 coordinator backend",
	)
	ui.ShowAnimatedProgress(1, 9)
	ui.PrintSuccessCheckmark("Backend configured")

	// Step 2: Target Endpoint
	ui.PrintNeonStep(stepNumber, "Target Configuration", "🎯")
	stepNumber++
	cfg.TargetEndpoint = ui.PromptStringWithGlow(
		"Enter the target API endpoint to test",
		"https://api.my-service.com/data",
		"This is where your simulated traffic will be directed",
	)
	ui.ShowAnimatedProgress(2, 9)
	ui.PrintSuccessCheckmark("Target configured")

	// Step 3: Number of Agents
	ui.PrintNeonStep(stepNumber, "Load Configuration", "⚡")
	stepNumber++
	cfg.NumAgents = ui.PromptIntWithGlow(
		"How many concurrent agents?",
		1000,
		"More agents = higher load. Recommended: 100-5000",
	)
	ui.VisualizeScaleAnimated("Agents", cfg.NumAgents, 5000)
	ui.ShowAnimatedProgress(3, 9)
	ui.PrintSuccessCheckmark("Load configured")

	// Step 4: Test Duration
	ui.PrintNeonStep(stepNumber, "Duration Settings", "⏱️")
	stepNumber++
	cfg.TestDuration = ui.PromptIntWithGlow(
		"Test duration (seconds)",
		300,
		"How long should the simulation run?",
	)
	ui.VisualizeDurationAnimated(cfg.TestDuration)
	ui.ShowAnimatedProgress(4, 9)
	ui.PrintSuccessCheckmark("Duration set")

	// Step 5: Ramp-up Period
	ui.PrintNeonStep(stepNumber, "Ramp-up Configuration", "📈")
	stepNumber++
	cfg.RampUpPeriod = ui.PromptIntWithGlow(
		"Ramp-up period (seconds)",
		60,
		"Gradual increase before hitting full load",
	)
	ui.VisualizeRampUpAnimated(cfg.RampUpPeriod, cfg.TestDuration)
	ui.ShowAnimatedProgress(5, 9)
	ui.PrintSuccessCheckmark("Ramp-up configured")

	// Step 6: Traffic Pattern
	ui.PrintNeonStep(stepNumber, "Traffic Pattern", "🌊")
	stepNumber++
	cfg.TrafficPattern = ui.PromptSelectWithGlow(
		"Choose a traffic pattern",
		[]string{"Constant Load", "Spike Load", "Stress Test"},
		[]string{
			"Steady continuous load throughout the test",
			"Sudden bursts of traffic to test resilience",
			"Gradually increasing load to find breaking point",
		},
	)
	ui.ShowAnimatedProgress(6, 9)
	ui.PrintSuccessCheckmark("Pattern selected")

	// Step 7: Solana Network
	ui.PrintNeonStep(stepNumber, "Blockchain Network", "⛓️")
	stepNumber++
	cfg.SolanaNetwork = ui.PromptSelectWithGlow(
		"Select Solana network",
		[]string{"devnet", "testnet", "mainnet-beta"},
		[]string{
			"Development network (safe for testing)",
			"Test network (more realistic environment)",
			"Production network (use with caution!)",
		},
	)
	ui.ShowAnimatedProgress(7, 9)
	ui.PrintSuccessCheckmark("Network selected")

	// Step 8: Wallet Pool
	ui.PrintNeonStep(stepNumber, "Wallet Configuration", "💰")
	stepNumber++
	cfg.PayerWalletCount = ui.PromptIntWithGlow(
		"Pre-funded wallet pool size",
		10,
		"Number of wallets to distribute the load",
	)
	ui.VisualizeWalletsAnimated(cfg.PayerWalletCount)
	ui.ShowAnimatedProgress(8, 9)
	ui.PrintSuccessCheckmark("Wallets configured")

	// Step 9: Output File
	ui.PrintNeonStep(stepNumber, "Output Settings", "💾")
	stepNumber++
	cfg.OutputFile = ui.PromptStringWithGlow(
		"Output config filename",
		"config.yaml",
		"Where to save your configuration",
	)
	ui.ShowAnimatedProgress(9, 9)
	ui.PrintSuccessCheckmark("Output configured")

	// Summary & Confirm
	ui.PrintNeonDivider()
	ui.PrintGlowingConfigSummary(cfg)
	ui.PrintNeonDivider()

	confirm := ui.PromptSelectWithGlow(
		"Save and deploy this configuration?",
		[]string{"Yes, save and deploy!", "Save locally only", "No, cancel"},
		[]string{
			"Save config and send to x402 backend",
			"Only save configuration file",
			"Discard and exit",
		},
	)

	if confirm == "No, cancel" {
		ui.PrintPulsingError("\n❌ Setup cancelled")
		ui.PrintDimText("No configuration was saved.")
		ui.ShowExitAnimation()
		return
	}

	// Save configuration with animation
	ui.PrintNeonDivider()
	s := spinner.New(spinner.CharSets[14], 100*time.Millisecond)
	s.Suffix = " 💾 Saving configuration..."
	s.Color("cyan")
	s.Start()
	time.Sleep(2 * time.Second)
	cfg.SaveConfig()
	s.Stop()
	ui.PrintGlowSuccess(fmt.Sprintf("\n✓ Configuration saved to %s", cfg.OutputFile))

	// Deploy to backend if requested
	if confirm == "Yes, save and deploy!" {
		deployToBackend(cfg)
	}

	ui.PrintNextStepsEnhanced(cfg.OutputFile)
	ui.ShowExitAnimation()
}

func deployToBackend(cfg config.SimulationConfig) {
	ui.PrintNeonDivider()
	ui.PrintGlowSection("Deploying to x402 Backend")

	s := spinner.New(spinner.CharSets[11], 100*time.Millisecond)
	s.Suffix = " 🚀 Connecting to backend..."
	s.Color("magenta")
	s.Start()
	time.Sleep(2 * time.Second)
	s.Stop()

	backendClient := client.NewBackendClient(cfg.BackendEndpoint)

	s = spinner.New(spinner.CharSets[14], 100*time.Millisecond)
	s.Suffix = " 📤 Uploading configuration..."
	s.Color("cyan")
	s.Start()
	time.Sleep(2 * time.Second)

	response, err := backendClient.DeploySimulation(cfg)
	s.Stop()

	if err != nil {
		ui.PrintPulsingError(fmt.Sprintf("\n❌ Failed to deploy: %v", err))
		ui.PrintDimText("You can still run the simulation manually using the saved config file.")
		return
	}

	// Show deployment result with animation
	fmt.Println()
	ui.PrintSuccessAnimation()
	ui.PrintGlowSuccess("🎉 Deployment Successful!")
	fmt.Println()
	ui.PrintGlowingDeploymentInfo(response)
}
