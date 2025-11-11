package ui

import (
	"fmt"
	"strings"
	"time"

	"github.com/fatih/color"
)

var (
	// Neon color palette
	NeonCyan    = color.New(color.FgCyan, color.Bold)
	NeonMagenta = color.New(color.FgMagenta, color.Bold)
	NeonGreen   = color.New(color.FgGreen, color.Bold)
	NeonRed     = color.New(color.FgRed, color.Bold)
	NeonYellow  = color.New(color.FgYellow, color.Bold)
	NeonBlue    = color.New(color.FgBlue, color.Bold)

	// Glow effects
	GlowCyan    = color.New(color.FgHiCyan, color.Bold)
	GlowMagenta = color.New(color.FgHiMagenta, color.Bold)
	GlowGreen   = color.New(color.FgHiGreen, color.Bold)
	GlowYellow  = color.New(color.FgHiYellow, color.Bold)

	// Standard colors
	DimColor   = color.New(color.FgWhite, color.Faint)
	BrightText = color.New(color.FgWhite, color.Bold)
)

func ClearScreen() {
	fmt.Print("\033[H\033[2J")
}

func PrintEnhancedBanner() {
	banner := `
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   ██╗  ██╗██╗  ██╗ ██████╗ ██████╗     ██╗    ██╗██╗███████╗ █████╗ ║
║   ╚██╗██╔╝██║  ██║██╔═████╗╚════██╗    ██║    ██║██║╚══███╔╝██╔══██╗║
║    ╚███╔╝ ███████║██║██╔██║ █████╔╝    ██║ █╗ ██║██║  ███╔╝ ███████║║
║    ██╔██╗ ╚════██║████╔╝██║██╔═══╝     ██║███╗██║██║ ███╔╝  ██╔══██║║
║   ██╔╝ ██╗     ██║╚██████╔╝███████╗    ╚███╔███╔╝██║███████╗██║  ██║║
║   ╚═╝  ╚═╝     ╚═╝ ╚═════╝ ╚══════╝     ╚══╝╚══╝ ╚═╝╚══════╝╚═╝  ╚═╝║
║                                                                       ║
║              ⚡ LOAD SIMULATOR CONFIGURATION WIZARD ⚡               ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
`
	GlowCyan.Println(banner)
}

func PrintGlowSection(title string) {
	fmt.Println()
	GlowMagenta.Print("╔═══════════════════════════════════════════════════════════════╗\n")
	GlowMagenta.Printf("║  ")
	GlowCyan.Printf("%-59s", strings.ToUpper(title))
	GlowMagenta.Printf("  ║\n")
	GlowMagenta.Print("╚═══════════════════════════════════════════════════════════════╝\n")
	fmt.Println()
}

func PrintNeonStep(num int, title, emoji string) {
	fmt.Println()
	GlowMagenta.Print("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n")
	GlowCyan.Printf("┃  Step %d/9  ", num)
	NeonYellow.Printf("▸ %s %s", title, emoji)
	fmt.Println()
	GlowMagenta.Print("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n")
	fmt.Println()
}

func PrintNeonDivider() {
	GlowCyan.Println("\n" + strings.Repeat("━", 70))
}

func PrintGradientText(text, startColor, endColor string) {
	colors := map[string]*color.Color{
		"cyan":    NeonCyan,
		"magenta": NeonMagenta,
		"green":   NeonGreen,
		"yellow":  NeonYellow,
	}

	c := colors[startColor]
	if c == nil {
		c = NeonCyan
	}
	c.Println("  " + text)
}

func PrintDimText(text string) {
	DimColor.Println("  " + text)
}

func ShowWelcomeAnimation() {
	frames := []string{
		"⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏",
	}

	GlowCyan.Print("\n  Loading x402 Wizard  ")
	for i := 0; i < 20; i++ {
		fmt.Printf("\r  Loading x402 Wizard  %s", frames[i%len(frames)])
		time.Sleep(80 * time.Millisecond)
	}
	fmt.Print("\r  Loading x402 Wizard  ✓\n\n")
}

func ShowExitAnimation() {
	fmt.Println()
	GlowGreen.Println("  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
	GlowCyan.Println("  ⚡ Thank you for using x402 Wizard! ⚡")
	GlowGreen.Println("  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
	fmt.Println()
}

func PrintSuccessCheckmark(message string) {
	fmt.Println()
	GlowGreen.Printf("  ✓ %s\n", message)
	time.Sleep(200 * time.Millisecond)
}

func PrintGlowSuccess(message string) {
	GlowGreen.Println("  " + message)
}

func PrintPulsingError(message string) {
	for i := 0; i < 3; i++ {
		fmt.Print("\r" + message)
		time.Sleep(200 * time.Millisecond)
		fmt.Print("\r" + strings.Repeat(" ", len(message)))
		time.Sleep(200 * time.Millisecond)
	}
	NeonRed.Println(message)
}

func PrintSuccessAnimation() {
	sparkles := []string{"✦", "✧", "★", "☆", "✦", "✧"}
	for _, s := range sparkles {
		fmt.Printf("\r  %s SUCCESS %s", s, s)
		time.Sleep(100 * time.Millisecond)
	}
	fmt.Println()
}
