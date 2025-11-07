package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/fatih/color"
	"github.com/manifoldco/promptui"
	"gopkg.in/yaml.v3"
)

// SimulationConfig represents the structure of the YAML config
type SimulationConfig struct {
	TargetEndpoint   string `yaml:"target_endpoint"`
	NumAgents        int    `yaml:"num_agents"`
	TestDuration     int    `yaml:"test_duration_seconds"`
	RampUpPeriod     int    `yaml:"ramp_up_period_seconds"`
	TrafficPattern   string `yaml:"traffic_pattern"`
	SolanaNetwork    string `yaml:"solana_network"`
	PayerWalletCount int    `yaml:"payer_wallet_count"`
	OutputFile       string `yaml:"output_file"`
}

var (
	titleColor     = color.New(color.FgCyan, color.Bold)
	successColor   = color.New(color.FgGreen, color.Bold)
	errorColor     = color.New(color.FgRed, color.Bold)
	infoColor      = color.New(color.FgYellow)
	highlightColor = color.New(color.FgMagenta, color.Bold)
	dimColor       = color.New(color.FgWhite, color.Faint)
)

func main() {
	clearScreen()
	printBanner()
	time.Sleep(500 * time.Millisecond)

	printSection("Welcome to the x402 Simulator Setup Wizard")
	infoColor.Println("✨ This tool will help you configure your load test interactively")
	printDivider()

	time.Sleep(300 * time.Millisecond)

	config := SimulationConfig{}
	stepNumber := 1

	// --- Step 1: Target Endpoint ---
	printStep(stepNumber, "Target Configuration", "🎯")
	stepNumber++
	config.TargetEndpoint = promptStringEnhanced(
		"Enter the target API endpoint",
		"https://api.my-service.com/data",
		"This is where your simulated traffic will be directed",
	)
	showProgress(1, 8)

	// --- Step 2: Number of Agents ---
	printStep(stepNumber, "Load Configuration", "⚡")
	stepNumber++
	config.NumAgents = promptIntEnhanced(
		"How many concurrent agents?",
		1000,
		"More agents = higher load. Recommended: 100-5000",
	)
	visualizeScale("Agents", config.NumAgents, 5000)
	showProgress(2, 8)

	// --- Step 3: Test Duration ---
	printStep(stepNumber, "Duration Settings", "⏱️")
	stepNumber++
	config.TestDuration = promptIntEnhanced(
		"Test duration (seconds)",
		300,
		"How long should the simulation run?",
	)
	visualizeDuration(config.TestDuration)
	showProgress(3, 8)

	// --- Step 4: Ramp-up Period ---
	printStep(stepNumber, "Ramp-up Configuration", "📈")
	stepNumber++
	config.RampUpPeriod = promptIntEnhanced(
		"Ramp-up period (seconds)",
		60,
		"Gradual increase before hitting full load",
	)
	visualizeRampUp(config.RampUpPeriod, config.TestDuration)
	showProgress(4, 8)

	// --- Step 5: Traffic Pattern ---
	printStep(stepNumber, "Traffic Pattern", "🌊")
	stepNumber++
	config.TrafficPattern = promptSelectEnhanced(
		"Choose a traffic pattern",
		[]string{"Constant Load", "Spike Load", "Stress Test"},
		[]string{
			"Steady continuous load throughout the test",
			"Sudden bursts of traffic to test resilience",
			"Gradually increasing load to find breaking point",
		},
	)
	showProgress(5, 8)

	// --- Step 6: Solana Network ---
	printStep(stepNumber, "Blockchain Network", "⛓️")
	stepNumber++
	config.SolanaNetwork = promptSelectEnhanced(
		"Select Solana network",
		[]string{"devnet", "testnet", "mainnet-beta"},
		[]string{
			"Development network (safe for testing)",
			"Test network (more realistic environment)",
			"Production network (use with caution!)",
		},
	)
	showProgress(6, 8)

	// --- Step 7: Wallet Pool ---
	printStep(stepNumber, "Wallet Configuration", "💰")
	stepNumber++
	config.PayerWalletCount = promptIntEnhanced(
		"Pre-funded wallet pool size",
		10,
		"Number of wallets to distribute the load",
	)
	visualizeWallets(config.PayerWalletCount)
	showProgress(7, 8)

	// --- Step 8: Output File ---
	printStep(stepNumber, "Output Settings", "💾")
	stepNumber++
	config.OutputFile = promptStringEnhanced(
		"Output config filename",
		"config.yaml",
		"Where to save your configuration",
	)
	showProgress(8, 8)

	// --- Step 9: Summary & Confirm ---
	printDivider()
	printConfigSummary(config)
	printDivider()

	confirm := promptSelectEnhanced(
		"Save this configuration?",
		[]string{"Yes, save it!", "No, cancel"},
		[]string{
			"Save configuration and proceed",
			"Discard and exit",
		},
	)

	if confirm != "Yes, save it!" {
		errorColor.Println("\n❌ Setup cancelled")
		dimColor.Println("No configuration was saved.")
		return
	}

	// --- Step 10: Save to YAML ---
	printDivider()
	fmt.Print("💾 Saving configuration")
	animateDots(3)

	saveConfig(config)

	successColor.Printf("\n\n🎉 Success! Configuration saved to %s\n\n", config.OutputFile)

	printNextSteps(config.OutputFile)
}

func clearScreen() {
	fmt.Print("\033[H\033[2J")
}

func printBanner() {
	banner := `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     ██╗  ██╗██╗  ██╗ ██████╗ ██████╗                    ║
║     ╚██╗██╔╝██║  ██║██╔═████╗╚════██╗                   ║
║      ╚███╔╝ ███████║██║██╔██║ █████╔╝                   ║
║      ██╔██╗ ╚════██║████╔╝██║██╔═══╝                    ║
║     ██╔╝ ██╗     ██║╚██████╔╝███████╗                   ║
║     ╚═╝  ╚═╝     ╚═╝ ╚═════╝ ╚══════╝                   ║
║                                                           ║
║              LOAD SIMULATOR CONFIGURATION                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`
	titleColor.Println(banner)
}

func printSection(title string) {
	fmt.Println()
	titleColor.Printf("═══ %s ═══\n\n", strings.ToUpper(title))
}

func printStep(num int, title, emoji string) {
	fmt.Println()
	highlightColor.Printf("┌─ Step %d/8: %s %s\n", num, title, emoji)
	dimColor.Println("└─────────────────────────────────────────")
	fmt.Println()
}

func printDivider() {
	dimColor.Println("\n" + strings.Repeat("─", 60))
}

func promptStringEnhanced(label, defaultVal, hint string) string {
	if hint != "" {
		dimColor.Printf("  ℹ️  %s\n\n", hint)
	}

	templates := &promptui.PromptTemplates{
		Prompt:  "{{ . | cyan }}{{ \": \" | cyan }}",
		Valid:   "{{ . | cyan }}{{ \": \" | cyan }}",
		Invalid: "{{ . | red }}{{ \": \" | red }}",
		Success: "{{ . | green }}{{ \": \" | green }}",
	}

	prompt := promptui.Prompt{
		Label:     label,
		Default:   defaultVal,
		Templates: templates,
	}

	result, err := prompt.Run()
	if err != nil {
		log.Fatalf("Prompt failed: %v\n", err)
	}
	return result
}

func promptIntEnhanced(label string, defaultVal int, hint string) int {
	if hint != "" {
		dimColor.Printf("  ℹ️  %s\n\n", hint)
	}

	templates := &promptui.PromptTemplates{
		Prompt:  "{{ . | cyan }}{{ \": \" | cyan }}",
		Valid:   "{{ . | cyan }}{{ \": \" | cyan }}",
		Invalid: "{{ . | red }}{{ \"✗ \" | red }}{{ . | red }}",
		Success: "{{ . | green }}{{ \": \" | green }}",
	}

	prompt := promptui.Prompt{
		Label:     fmt.Sprintf("%s (default: %d)", label, defaultVal),
		Default:   fmt.Sprintf("%d", defaultVal),
		Templates: templates,
		Validate: func(input string) error {
			val, err := strconv.Atoi(input)
			if err != nil {
				return fmt.Errorf("please enter a valid number")
			}
			if val <= 0 {
				return fmt.Errorf("value must be positive")
			}
			return nil
		},
	}

	result, err := prompt.Run()
	if err != nil {
		log.Fatalf("Prompt failed: %v\n", err)
	}
	val, _ := strconv.Atoi(result)
	return val
}

func promptSelectEnhanced(label string, items, descriptions []string) string {
	fmt.Println()
	for i, item := range items {
		if i < len(descriptions) {
			fmt.Printf("  %d. %s\n", i+1, item)
			dimColor.Printf("     %s\n", descriptions[i])
		}
	}
	fmt.Println()

	templates := &promptui.SelectTemplates{
		Label:    "{{ . | cyan }}",
		Active:   "▸ {{ . | cyan | bold }}",
		Inactive: "  {{ . | white }}",
		Selected: "{{ \"✓\" | green | bold }} {{ . | green }}",
	}

	prompt := promptui.Select{
		Label:     label,
		Items:     items,
		Templates: templates,
	}

	_, result, err := prompt.Run()
	if err != nil {
		log.Fatalf("Prompt failed: %v\n", err)
	}
	return result
}

func showProgress(current, total int) {
	percentage := float64(current) / float64(total) * 100
	filled := int(percentage / 5)

	fmt.Println()
	dimColor.Print("  Progress: [")
	successColor.Print(strings.Repeat("█", filled))
	dimColor.Print(strings.Repeat("░", 20-filled))
	dimColor.Printf("] %.0f%%\n", percentage)
}

func visualizeScale(label string, value, max int) {
	percentage := float64(value) / float64(max) * 100
	if percentage > 100 {
		percentage = 100
	}

	filled := int(percentage / 5)
	fmt.Println()
	infoColor.Printf("  %s Load Scale:\n  ", label)

	if percentage < 30 {
		color.New(color.FgGreen).Print(strings.Repeat("█", filled))
	} else if percentage < 70 {
		color.New(color.FgYellow).Print(strings.Repeat("█", filled))
	} else {
		color.New(color.FgRed).Print(strings.Repeat("█", filled))
	}

	dimColor.Print(strings.Repeat("░", 20-filled))
	fmt.Printf(" %d/%d\n", value, max)
}

func visualizeDuration(seconds int) {
	minutes := seconds / 60
	remainingSeconds := seconds % 60

	fmt.Println()
	infoColor.Print("  Timeline: ")

	if minutes > 0 {
		successColor.Printf("%d min ", minutes)
	}
	if remainingSeconds > 0 || minutes == 0 {
		successColor.Printf("%d sec", remainingSeconds)
	}
	fmt.Println()
}

func visualizeRampUp(rampUp, total int) {
	rampUpPercent := float64(rampUp) / float64(total) * 100

	fmt.Println()
	infoColor.Println("  Load Distribution:")
	fmt.Print("  ")

	rampUpBlocks := int(rampUpPercent / 5)
	fullLoadBlocks := 20 - rampUpBlocks

	color.New(color.FgYellow).Print(strings.Repeat("▲", rampUpBlocks))
	color.New(color.FgGreen).Print(strings.Repeat("█", fullLoadBlocks))

	dimColor.Printf("\n  ├─ Ramp-up: %ds (%.0f%%)", rampUp, rampUpPercent)
	dimColor.Printf("\n  └─ Full load: %ds (%.0f%%)\n", total-rampUp, 100-rampUpPercent)
}

func visualizeWallets(count int) {
	fmt.Println()
	infoColor.Println("  Wallet Pool:")

	walletsToShow := count
	if walletsToShow > 20 {
		walletsToShow = 20
	}

	fmt.Print("  ")
	for i := 0; i < walletsToShow; i++ {
		successColor.Print("💰 ")
	}

	if count > 20 {
		dimColor.Printf("... (%d total)", count)
	}
	fmt.Println()
}

func printConfigSummary(config SimulationConfig) {
	successColor.Println("\n✅ CONFIGURATION SUMMARY")
	fmt.Println()

	printSummaryLine("Target Endpoint", config.TargetEndpoint, "🎯")
	printSummaryLine("Concurrent Agents", fmt.Sprintf("%d", config.NumAgents), "⚡")
	printSummaryLine("Test Duration", fmt.Sprintf("%d seconds", config.TestDuration), "⏱️")
	printSummaryLine("Ramp-up Period", fmt.Sprintf("%d seconds", config.RampUpPeriod), "📈")
	printSummaryLine("Traffic Pattern", config.TrafficPattern, "🌊")
	printSummaryLine("Solana Network", config.SolanaNetwork, "⛓️")
	printSummaryLine("Wallet Pool Size", fmt.Sprintf("%d wallets", config.PayerWalletCount), "💰")
	printSummaryLine("Output File", config.OutputFile, "💾")
}

func printSummaryLine(label, value, emoji string) {
	fmt.Printf("  %s  ", emoji)
	infoColor.Printf("%-20s", label+":")
	highlightColor.Println(value)
}

func animateDots(count int) {
	for i := 0; i < count; i++ {
		time.Sleep(400 * time.Millisecond)
		fmt.Print(".")
	}
}

func printNextSteps(filename string) {
	titleColor.Println("📋 NEXT STEPS:")
	fmt.Println()
	dimColor.Println("  1. Review your configuration:")
	fmt.Printf("     cat %s\n\n", filename)
	dimColor.Println("  2. Start your load test:")
	fmt.Println("     ./x402-simulator run --config " + filename)
	fmt.Println()
	dimColor.Println("  3. Monitor results and analyze performance")
	fmt.Println()
	successColor.Println("🚀 Happy testing!\n")
}

func saveConfig(config SimulationConfig) {
	data, err := yaml.Marshal(&config)
	if err != nil {
		log.Fatalf("Error marshaling YAML: %v\n", err)
	}

	err = os.WriteFile(config.OutputFile, data, 0644)
	if err != nil {
		log.Fatalf("Error writing config file: %v\n", err)
	}
}
