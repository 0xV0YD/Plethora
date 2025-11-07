package ui

import (
	"fmt"
	"strings"

	"github.com/fatih/color"
)

func ShowProgress(current, total int) {
	percentage := float64(current) / float64(total) * 100
	filled := int(percentage / 5)

	fmt.Println()
	DimColor.Print("  Progress: [")
	SuccessColor.Print(strings.Repeat("█", filled))
	DimColor.Print(strings.Repeat("░", 20-filled))
	DimColor.Printf("] %.0f%%\n", percentage)
}

func VisualizeScale(label string, value, max int) {
	percentage := float64(value) / float64(max) * 100
	if percentage > 100 {
		percentage = 100
	}

	filled := int(percentage / 5)
	fmt.Println()
	InfoColor.Printf("  %s Load Scale:\n  ", label)

	if percentage < 30 {
		color.New(color.FgGreen).Print(strings.Repeat("█", filled))
	} else if percentage < 70 {
		color.New(color.FgYellow).Print(strings.Repeat("█", filled))
	} else {
		color.New(color.FgRed).Print(strings.Repeat("█", filled))
	}

	DimColor.Print(strings.Repeat("░", 20-filled))
	fmt.Printf(" %d/%d\n", value, max)
}

func VisualizeDuration(seconds int) {
	minutes := seconds / 60
	remainingSeconds := seconds % 60

	fmt.Println()
	InfoColor.Print("  Timeline: ")

	if minutes > 0 {
		SuccessColor.Printf("%d min ", minutes)
	}
	if remainingSeconds > 0 || minutes == 0 {
		SuccessColor.Printf("%d sec", remainingSeconds)
	}
	fmt.Println()
}

func VisualizeRampUp(rampUp, total int) {
	rampUpPercent := float64(rampUp) / float64(total) * 100

	fmt.Println()
	InfoColor.Println("  Load Distribution:")
	fmt.Print("  ")

	rampUpBlocks := int(rampUpPercent / 5)
	fullLoadBlocks := 20 - rampUpBlocks

	color.New(color.FgYellow).Print(strings.Repeat("▲", rampUpBlocks))
	color.New(color.FgGreen).Print(strings.Repeat("█", fullLoadBlocks))

	DimColor.Printf("\n  ├─ Ramp-up: %ds (%.0f%%)", rampUp, rampUpPercent)
	DimColor.Printf("\n  └─ Full load: %ds (%.0f%%)\n", total-rampUp, 100-rampUpPercent)
}

func VisualizeWallets(count int) {
	fmt.Println()
	InfoColor.Println("  Wallet Pool:")

	walletsToShow := count
	if walletsToShow > 20 {
		walletsToShow = 20
	}

	fmt.Print("  ")
	for i := 0; i < walletsToShow; i++ {
		SuccessColor.Print("💰 ")
	}

	if count > 20 {
		DimColor.Printf("... (%d total)", count)
	}
	fmt.Println()
}
