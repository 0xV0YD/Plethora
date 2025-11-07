package main

import (
	"fmt"
	"time"

	"x402-wizard/client"
	"x402-wizard/config"
	"x402-wizard/ui"
)

func main() {
	ui.ClearScreen()
	ui.PrintBanner()
	time.Sleep(500 * time.Millisecond)

	ui.PrintSection("Welcome to the x402 Simulator Setup Wizard")
	ui.InfoColor.Println("✨ This tool will help you configure your load test interactively")
	ui.PrintDivider()

	time.Sleep(300 * time.Millisecond)

	cfg := config.SimulationConfig{}
	stepNumber := 1

	// Step 1: Backend Endpoint
	ui.PrintStep(stepNumber, "Backend Configuration", "🔧")
	stepNumber++
	cfg.BackendEndpoint = ui.PromptStringEnhanced(
		"Enter the x402 backend API endpoint",
		"http://localhost:8080/api",
		"This is your x402 coordinator backend",
	)
	ui.ShowProgress(1, 9)

	// Step 2: Target Endpoint
	ui.PrintStep(stepNumber, "Target Configuration", "🎯")
	stepNumber++
	cfg.TargetEndpoint = ui.PromptStringEnhanced(
		"Enter the target API endpoint to test",
		"https://api.my-service.com/data",
		"This is where your simulated traffic will be directed",
	)
	ui.ShowProgress(2, 9)

	// Step 3: Number of Agents
	ui.PrintStep(stepNumber, "Load Configuration", "⚡")
	stepNumber++
	cfg.NumAgents = ui.PromptIntEnhanced(
		"How many concurrent agents?",
		1000,
		"More agents = higher load. Recommended: 100-5000",
	)
	ui.VisualizeScale("Agents", cfg.NumAgents, 5000)
	ui.ShowProgress(3, 9)

	// Step 4: Test Duration
	ui.PrintStep(stepNumber, "Duration Settings", "⏱️")
	stepNumber++
	cfg.TestDuration = ui.PromptIntEnhanced(
		"Test duration (seconds)",
		300,
		"How long should the simulation run?",
	)
	ui.VisualizeDuration(cfg.TestDuration)
	ui.ShowProgress(4, 9)

	// Step 5: Ramp-up Period
	ui.PrintStep(stepNumber, "Ramp-up Configuration", "📈")
	stepNumber++
	cfg.RampUpPeriod = ui.PromptIntEnhanced(
		"Ramp-up period (seconds)",
		60,
		"Gradual increase before hitting full load",
	)
	ui.VisualizeRampUp(cfg.RampUpPeriod, cfg.TestDuration)
	ui.ShowProgress(5, 9)

	// Step 6: Traffic Pattern
	ui.PrintStep(stepNumber, "Traffic Pattern", "🌊")
	stepNumber++
	cfg.TrafficPattern = ui.PromptSelectEnhanced(
		"Choose a traffic pattern",
		[]string{"Constant Load", "Spike Load", "Stress Test"},
		[]string{
			"Steady continuous load throughout the test",
			"Sudden bursts of traffic to test resilience",
			"Gradually increasing load to find breaking point",
		},
	)
	ui.ShowProgress(6, 9)

	// Step 7: Solana Network
	ui.PrintStep(stepNumber, "Blockchain Network", "⛓️")
	stepNumber++
	cfg.SolanaNetwork = ui.PromptSelectEnhanced(
		"Select Solana network",
		[]string{"devnet", "testnet", "mainnet-beta"},
		[]string{
			"Development network (safe for testing)",
			"Test network (more realistic environment)",
			"Production network (use with caution!)",
		},
	)
	ui.ShowProgress(7, 9)

	// Step 8: Wallet Pool
	ui.PrintStep(stepNumber, "Wallet Configuration", "💰")
	stepNumber++
	cfg.PayerWalletCount = ui.PromptIntEnhanced(
		"Pre-funded wallet pool size",
		10,
		"Number of wallets to distribute the load",
	)
	ui.VisualizeWallets(cfg.PayerWalletCount)
	ui.ShowProgress(8, 9)

	// Step 9: Output File
	ui.PrintStep(stepNumber, "Output Settings", "💾")
	stepNumber++
	cfg.OutputFile = ui.PromptStringEnhanced(
		"Output config filename",
		"config.yaml",
		"Where to save your configuration",
	)
	ui.ShowProgress(9, 9)

	// Summary & Confirm
	ui.PrintDivider()
	ui.PrintConfigSummary(cfg)
	ui.PrintDivider()

	confirm := ui.PromptSelectEnhanced(
		"Save and deploy this configuration?",
		[]string{"Yes, save and deploy!", "Save locally only", "No, cancel"},
		[]string{
			"Save config and send to x402 backend",
			"Only save configuration file",
			"Discard and exit",
		},
	)

	if confirm == "No, cancel" {
		ui.ErrorColor.Println("\n❌ Setup cancelled")
		ui.DimColor.Println("No configuration was saved.")
		return
	}

	// Save configuration
	ui.PrintDivider()
	fmt.Print("💾 Saving configuration")
	ui.AnimateDots(3)
	cfg.SaveConfig()
	ui.SuccessColor.Printf("\n\n✓ Configuration saved to %s\n", cfg.OutputFile)

	// Deploy to backend if requested
	if confirm == "Yes, save and deploy!" {
		deployToBackend(cfg)
	}

	ui.PrintNextSteps(cfg.OutputFile)
}

func deployToBackend(cfg config.SimulationConfig) {
	ui.PrintDivider()
	ui.PrintSection("Deploying to x402 Backend")

	fmt.Print("🚀 Connecting to backend")
	ui.AnimateDots(3)
	fmt.Println()

	backendClient := client.NewBackendClient(cfg.BackendEndpoint)

	// Deploy configuration
	fmt.Print("📤 Uploading configuration")
	ui.AnimateDots(3)
	fmt.Println()

	response, err := backendClient.DeploySimulation(cfg)
	if err != nil {
		ui.ErrorColor.Printf("\n❌ Failed to deploy: %v\n", err)
		ui.DimColor.Println("You can still run the simulation manually using the saved config file.")
		return
	}

	// Show deployment result
	fmt.Println()
	ui.SuccessColor.Println("🎉 Deployment Successful!")
	fmt.Println()
	ui.PrintDeploymentInfo(response)
}
