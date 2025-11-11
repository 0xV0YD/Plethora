package ui

import (
	"fmt"
	"strings"
	"time"

	"x402-wizard/client"
	"x402-wizard/config"
)

func ShowAnimatedProgress(current, total int) {
	percentage := float64(current) / float64(total) * 100
	filled := int(percentage / 5)

	fmt.Println()
	DimColor.Print("  Progress: [")

	// Animated filling
	for i := 0; i < filled; i++ {
		if percentage < 30 {
			NeonGreen.Print("█")
		} else if percentage < 70 {
			NeonYellow.Print("█")
		} else {
			GlowCyan.Print("█")
		}
		time.Sleep(30 * time.Millisecond)
	}

	DimColor.Print(strings.Repeat("░", 20-filled))
	GlowCyan.Printf("] %.0f%%\n", percentage)
}

func VisualizeScaleAnimated(label string, value, max int) {
	percentage := float64(value) / float64(max) * 100
	if percentage > 100 {
		percentage = 100
	}

	filled := int(percentage / 5)
	fmt.Println()
	GlowYellow.Printf("  %s Load Scale:\n", label)
	fmt.Print("  ")

	// Animated bar
	for i := 0; i < filled; i++ {
		if percentage < 30 {
			NeonGreen.Print("█")
		} else if percentage < 70 {
			NeonYellow.Print("█")
		} else {
			NeonRed.Print("█")
		}
		time.Sleep(30 * time.Millisecond)
	}

	DimColor.Print(strings.Repeat("░", 20-filled))
	GlowMagenta.Printf(" %d/%d", value, max)

	// Status indicator
	if percentage < 30 {
		NeonGreen.Print("  [LIGHT]")
	} else if percentage < 70 {
		NeonYellow.Print("  [MODERATE]")
	} else {
		NeonRed.Print("  [HEAVY]")
	}
	fmt.Println()
}

func VisualizeDurationAnimated(seconds int) {
	minutes := seconds / 60
	remainingSeconds := seconds % 60

	fmt.Println()
	GlowCyan.Print("  ⏱️  Timeline: ")

	if minutes > 0 {
		GlowYellow.Printf("%d min ", minutes)
	}
	if remainingSeconds > 0 || minutes == 0 {
		GlowYellow.Printf("%d sec", remainingSeconds)
	}

	// Animated clock
	clock := []string{"🕐", "🕑", "🕒", "🕓", "🕔", "🕕"}
	for _, c := range clock {
		fmt.Printf("\r  %s  Timeline: ", c)
		if minutes > 0 {
			fmt.Printf("%d min ", minutes)
		}
		if remainingSeconds > 0 || minutes == 0 {
			fmt.Printf("%d sec", remainingSeconds)
		}
		time.Sleep(100 * time.Millisecond)
	}
	fmt.Println()
}

func VisualizeRampUpAnimated(rampUp, total int) {
	rampUpPercent := float64(rampUp) / float64(total) * 100

	fmt.Println()
	GlowMagenta.Println("  📈 Load Distribution:")
	fmt.Print("  ")

	rampUpBlocks := int(rampUpPercent / 5)
	fullLoadBlocks := 20 - rampUpBlocks

	// Animated ramp-up
	for i := 0; i < rampUpBlocks; i++ {
		NeonYellow.Print("▲")
		time.Sleep(30 * time.Millisecond)
	}
	for i := 0; i < fullLoadBlocks; i++ {
		NeonGreen.Print("█")
		time.Sleep(30 * time.Millisecond)
	}

	fmt.Println()
	GlowYellow.Printf("  ├─ Ramp-up: %ds (%.0f%%)\n", rampUp, rampUpPercent)
	GlowGreen.Printf("  └─ Full load: %ds (%.0f%%)\n", total-rampUp, 100-rampUpPercent)
}

func VisualizeWalletsAnimated(count int) {
	fmt.Println()
	GlowCyan.Println("  💰 Wallet Pool:")
	fmt.Print("  ")

	walletsToShow := count
	if walletsToShow > 20 {
		walletsToShow = 20
	}

	// Animated wallet display
	for i := 0; i < walletsToShow; i++ {
		if i%2 == 0 {
			GlowYellow.Print("💰 ")
		} else {
			NeonYellow.Print("💰 ")
		}
		time.Sleep(50 * time.Millisecond)
	}

	if count > 20 {
		DimColor.Printf("... (%d total)", count)
	}
	fmt.Println()
}

func PrintGlowingConfigSummary(cfg config.SimulationConfig) {
	GlowGreen.Println("\n✅ CONFIGURATION SUMMARY")
	fmt.Println()

	GlowMagenta.Println("  ╔════════════════════════════════════════════════════════════════╗")

	printGlowSummaryLine("Backend Endpoint", cfg.BackendEndpoint, "🔧")
	printGlowSummaryLine("Target Endpoint", cfg.TargetEndpoint, "🎯")
	printGlowSummaryLine("Concurrent Agents", fmt.Sprintf("%d", cfg.NumAgents), "⚡")
	printGlowSummaryLine("Test Duration", fmt.Sprintf("%d seconds", cfg.TestDuration), "⏱️")
	printGlowSummaryLine("Ramp-up Period", fmt.Sprintf("%d seconds", cfg.RampUpPeriod), "📈")
	printGlowSummaryLine("Traffic Pattern", cfg.TrafficPattern, "🌊")
	printGlowSummaryLine("Solana Network", cfg.SolanaNetwork, "⛓️")
	printGlowSummaryLine("Wallet Pool Size", fmt.Sprintf("%d wallets", cfg.PayerWalletCount), "💰")
	printGlowSummaryLine("Output File", cfg.OutputFile, "💾")

	GlowMagenta.Println("  ╚════════════════════════════════════════════════════════════════╝")
}

func printGlowSummaryLine(label, value, emoji string) {
	GlowMagenta.Print("  ║  ")
	fmt.Printf("%s  ", emoji)
	GlowYellow.Printf("%-20s", label+":")
	GlowCyan.Print(value)
	padding := 60 - len(label) - len(value) - 5
	if padding > 0 {
		fmt.Print(strings.Repeat(" ", padding))
	}
	GlowMagenta.Println("  ║")
}

func PrintGlowingDeploymentInfo(resp *client.DeploymentResponse) {
	GlowCyan.Println("  ╔════════════════════════════════════════════════════════════════╗")
	GlowCyan.Println("  ║              📊 DEPLOYMENT DETAILS                            ║")
	GlowCyan.Println("  ╚════════════════════════════════════════════════════════════════╝")
	fmt.Println()

	printGlowSummaryLine("Simulation ID", resp.SimulationID, "🆔")
	printGlowSummaryLine("Status", resp.Status, "📍")
	printGlowSummaryLine("Agents Spawned", fmt.Sprintf("%d", resp.AgentsSpawned), "🤖")
	printGlowSummaryLine("Start Time", resp.StartTime.Format("15:04:05 MST"), "🕐")
	printGlowSummaryLine("Estimated End", resp.EstimatedEnd.Format("15:04:05 MST"), "🕑")

	if resp.DashboardURL != "" {
		printGlowSummaryLine("Dashboard", resp.DashboardURL, "📈")
	}

	if resp.Message != "" {
		fmt.Println()
		GlowYellow.Printf("  💬 %s\n", resp.Message)
	}
	fmt.Println()
}

func PrintNextStepsEnhanced(filename string) {
	fmt.Println()
	GlowMagenta.Println("  ╔════════════════════════════════════════════════════════════════╗")
	GlowMagenta.Println("  ║                    📋 NEXT STEPS                              ║")
	GlowMagenta.Println("  ╚════════════════════════════════════════════════════════════════╝")
	fmt.Println()

	GlowCyan.Println("  1. Monitor your simulation:")
	DimColor.Println("     ./x402-wizard status <simulation-id>")
	fmt.Println()

	GlowCyan.Println("  2. View configuration:")
	DimColor.Printf("     cat %s\n\n", filename)

	GlowCyan.Println("  3. Analyze results when complete")
	fmt.Println()

	GlowGreen.Println("  🚀 Happy testing!")
}
