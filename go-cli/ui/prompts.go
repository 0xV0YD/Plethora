package ui

import (
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/manifoldco/promptui"
)

func PromptStringWithGlow(label, defaultVal, hint string) string {
	if hint != "" {
		GlowYellow.Printf("  ℹ️  %s\n\n", hint)
	}

	templates := &promptui.PromptTemplates{
		Prompt:  "{{ . | cyan | bold }}{{ \" ▸ \" | cyan }}",
		Valid:   "{{ . | cyan | bold }}{{ \" ▸ \" | cyan }}",
		Invalid: "{{ . | red | bold }}{{ \" ✗ \" | red }}{{ . | red }}",
		Success: "{{ . | green | bold }}{{ \" ✓ \" | green }}",
	}

	prompt := promptui.Prompt{
		Label:     "  " + label,
		Default:   defaultVal,
		Templates: templates,
	}

	result, err := prompt.Run()
	if err != nil {
		log.Fatalf("Prompt failed: %v\n", err)
	}

	// Animate acceptance
	time.Sleep(100 * time.Millisecond)
	return result
}

func PromptIntWithGlow(label string, defaultVal int, hint string) int {
	if hint != "" {
		GlowYellow.Printf("  ℹ️  %s\n\n", hint)
	}

	templates := &promptui.PromptTemplates{
		Prompt:  "{{ . | cyan | bold }}{{ \" ▸ \" | cyan }}",
		Valid:   "{{ . | cyan | bold }}{{ \" ▸ \" | cyan }}",
		Invalid: "{{ . | red | bold }}{{ \" ✗ \" | red }}{{ . | red }}",
		Success: "{{ . | green | bold }}{{ \" ✓ \" | green }}",
	}

	prompt := promptui.Prompt{
		Label:     fmt.Sprintf("  %s (default: %d)", label, defaultVal),
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

	time.Sleep(100 * time.Millisecond)
	return val
}

func PromptSelectWithGlow(label string, items, descriptions []string) string {
	fmt.Println()
	for i, item := range items {
		if i < len(descriptions) {
			GlowCyan.Printf("  %d. %s\n", i+1, item)
			DimColor.Printf("     %s\n", descriptions[i])
		}
	}
	fmt.Println()

	templates := &promptui.SelectTemplates{
		Label:    "{{ . | cyan | bold }}",
		Active:   "  {{ \"▸\" | magenta | bold }} {{ . | cyan | bold }}",
		Inactive: "    {{ . | white }}",
		Selected: "  {{ \"✓\" | green | bold }} {{ . | green | bold }}",
	}

	searcher := func(input string, index int) bool {
		item := strings.ToLower(items[index])
		input = strings.ToLower(input)
		return strings.Contains(item, input)
	}

	prompt := promptui.Select{
		Label:     "  " + label,
		Items:     items,
		Templates: templates,
		Size:      len(items),
		Searcher:  searcher,
	}

	_, result, err := prompt.Run()
	if err != nil {
		log.Fatalf("Prompt failed: %v\n", err)
	}

	time.Sleep(100 * time.Millisecond)
	return result
}
