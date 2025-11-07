package ui

import (
	"fmt"
	"strings"
	"time"

	"x402-wizard/client"
	"x402-wizard/config"

	"github.com/fatih/color"
)

var (
	TitleColor     = color.New(color.FgCyan, color.Bold)
	SuccessColor   = color.New(color.FgGreen, color.Bold)
	ErrorColor     = color.New(color.FgRed, color.Bold)
	InfoColor      = color.New(color.FgYellow)
	HighlightColor = color.New(color.FgMagenta, color.Bold)
	DimColor       = color.New(color.FgWhite, color.Faint)
)

func ClearScreen() {
	fmt.Print("\033[H\033[2J")
}

func PrintBanner() {
	banner := `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  ██████╗ ██╗     ███████╗████████╗██╗  ██╗ ██████╗      ║
║  ██╔══██╗██║     ██╔════╝╚══██╔══╝██║  ██║██╔═══██╗     ║
║  ██████╔╝██║     █████╗     ██║   ███████║██║   ██║     ║
║  ██╔═══╝ ██║     ██╔══╝     ██║   ██╔══██║██║   ██║     ║
║  ██║     ███████╗███████╗   ██║   ██║  ██║╚██████╔╝     ║
║  ╚═╝     ╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝      ║
║                                                           ║
║   ██████╗  █████╗                                        ║
║   ██╔══██╗██╔══██╗                                       ║
║   ██████╔╝███████║                                       ║
║   ██╔══██╗██╔══██║                                       ║
║   ██║  ██║██║  ██║                                       ║
║   ╚═╝  ╚═╝╚═╝  ╚═╝                                       ║
║                                                           ║
║              LOAD SIMULATOR CONFIGURATION                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`
	TitleColor.Println(banner)
}

func PrintSection(title string) {
	fmt.Println()
	TitleColor.Printf("═══ %s ═══\n\n", strings.ToUpper(title))
}

func PrintStep(num int, title, emoji string) {
	fmt.Println()
	HighlightColor.Printf("┌─ Step %d/9: %s %s\n", num, title, emoji)
	DimColor.Println("└─────────────────────────────────────────")
	fmt.Println()
}

func PrintDivider() {
	DimColor.Println("\n" + strings.Repeat("─", 60))
}

func AnimateDots(count int) {
	for i := 0; i < count; i++ {
		time.Sleep(400 * time.Millisecond)
		fmt.Print(".")
	}
}

func PrintConfigSummary(cfg config.SimulationConfig) {
	SuccessColor.Println("\n✅ CONFIGURATION SUMMARY")
	fmt.Println()

	printSummaryLine("Backend Endpoint", cfg.BackendEndpoint, "🔧")
	printSummaryLine("Target Endpoint", cfg.TargetEndpoint, "🎯")
	printSummaryLine("Concurrent Agents", fmt.Sprintf("%d", cfg.NumAgents), "⚡")
	printSummaryLine("Test Duration", fmt.Sprintf("%d seconds", cfg.TestDuration), "⏱️")
	printSummaryLine("Ramp-up Period", fmt.Sprintf("%d seconds", cfg.RampUpPeriod), "📈")
	printSummaryLine("Traffic Pattern", cfg.TrafficPattern, "🌊")
	printSummaryLine("Solana Network", cfg.SolanaNetwork, "⛓️")
	printSummaryLine("Wallet Pool Size", fmt.Sprintf("%d wallets", cfg.PayerWalletCount), "💰")
	printSummaryLine("Output File", cfg.OutputFile, "💾")
}

func printSummaryLine(label, value, emoji string) {
	fmt.Printf("  %s  ", emoji)
	InfoColor.Printf("%-22s", label+":")
	HighlightColor.Println(value)
}

func PrintDeploymentInfo(resp *client.DeploymentResponse) {
	SuccessColor.Println("📊 DEPLOYMENT DETAILS")
	fmt.Println()

	printSummaryLine("Simulation ID", resp.SimulationID, "🆔")
	printSummaryLine("Status", resp.Status, "📍")
	printSummaryLine("Agents Spawned", fmt.Sprintf("%d", resp.AgentsSpawned), "🤖")
	printSummaryLine("Start Time", resp.StartTime.Format("15:04:05 MST"), "🕐")
	printSummaryLine("Estimated End", resp.EstimatedEnd.Format("15:04:05 MST"), "🕑")

	if resp.DashboardURL != "" {
		printSummaryLine("Dashboard", resp.DashboardURL, "📈")
	}

	if resp.Message != "" {
		fmt.Println()
		InfoColor.Printf("  💬 %s\n", resp.Message)
	}
}

func PrintNextSteps(filename string) {
	fmt.Println()
	TitleColor.Println("📋 NEXT STEPS:")
	fmt.Println()
	DimColor.Println("  1. Monitor your simulation:")
	fmt.Println("     ./x402-wizard status <simulation-id>")
	fmt.Println()
	DimColor.Println("  2. View configuration:")
	fmt.Printf("     cat %s\n\n", filename)
	DimColor.Println("  3. Analyze results when complete")
	fmt.Println()
	SuccessColor.Println("🚀 Happy testing!\n")
}
