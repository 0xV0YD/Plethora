package ui

import (
	"fmt"
	"log"
	"strconv"

	"github.com/manifoldco/promptui"
)

func PromptStringEnhanced(label, defaultVal, hint string) string {
	if hint != "" {
		DimColor.Printf("  ℹ️  %s\n\n", hint)
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

func PromptIntEnhanced(label string, defaultVal int, hint string) int {
	if hint != "" {
		DimColor.Printf("  ℹ️  %s\n\n", hint)
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

func PromptSelectEnhanced(label string, items, descriptions []string) string {
	fmt.Println()
	for i, item := range items {
		if i < len(descriptions) {
			fmt.Printf("  %d. %s\n", i+1, item)
			DimColor.Printf("     %s\n", descriptions[i])
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
