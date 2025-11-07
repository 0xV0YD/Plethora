package config

import (
	"log"
	"os"

	"gopkg.in/yaml.v3"
)

// SimulationConfig represents the structure of the YAML config
type SimulationConfig struct {
	BackendEndpoint  string `yaml:"backend_endpoint" json:"backend_endpoint"`
	TargetEndpoint   string `yaml:"target_endpoint" json:"target_endpoint"`
	NumAgents        int    `yaml:"num_agents" json:"num_agents"`
	TestDuration     int    `yaml:"test_duration_seconds" json:"test_duration_seconds"`
	RampUpPeriod     int    `yaml:"ramp_up_period_seconds" json:"ramp_up_period_seconds"`
	TrafficPattern   string `yaml:"traffic_pattern" json:"traffic_pattern"`
	SolanaNetwork    string `yaml:"solana_network" json:"solana_network"`
	PayerWalletCount int    `yaml:"payer_wallet_count" json:"payer_wallet_count"`
	OutputFile       string `yaml:"output_file" json:"output_file"`
}

// SaveConfig saves the configuration to a YAML file
func (c *SimulationConfig) SaveConfig() {
	data, err := yaml.Marshal(c)
	if err != nil {
		log.Fatalf("Error marshaling YAML: %v\n", err)
	}

	err = os.WriteFile(c.OutputFile, data, 0644)
	if err != nil {
		log.Fatalf("Error writing config file: %v\n", err)
	}
}
