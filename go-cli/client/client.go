package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"x402-wizard/config"
)

// BackendClient handles communication with x402 backend
type BackendClient struct {
	baseURL    string
	httpClient *http.Client
}

// DeploymentResponse represents the response from the backend
type DeploymentResponse struct {
	SimulationID  string    `json:"simulation_id"`
	Status        string    `json:"status"`
	Message       string    `json:"message"`
	AgentsSpawned int       `json:"agents_spawned"`
	StartTime     time.Time `json:"start_time"`
	EstimatedEnd  time.Time `json:"estimated_end"`
	DashboardURL  string    `json:"dashboard_url,omitempty"`
}

// NewBackendClient creates a new backend client
func NewBackendClient(baseURL string) *BackendClient {
	return &BackendClient{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// DeploySimulation sends the configuration to the x402 backend
func (bc *BackendClient) DeploySimulation(cfg config.SimulationConfig) (*DeploymentResponse, error) {
	url := fmt.Sprintf("%s/simulation/deploy", bc.baseURL)

	jsonData, err := json.Marshal(cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal config: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "x402-wizard/2.0")

	resp, err := bc.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("backend returned error (status %d): %s", resp.StatusCode, string(body))
	}

	var deployResp DeploymentResponse
	if err := json.Unmarshal(body, &deployResp); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return &deployResp, nil
}

// GetSimulationStatus retrieves the status of a running simulation
func (bc *BackendClient) GetSimulationStatus(simulationID string) (*DeploymentResponse, error) {
	url := fmt.Sprintf("%s/simulation/%s/status", bc.baseURL, simulationID)

	resp, err := bc.httpClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to get status: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("backend returned error (status %d): %s", resp.StatusCode, string(body))
	}

	var statusResp DeploymentResponse
	if err := json.Unmarshal(body, &statusResp); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return &statusResp, nil
}

// StopSimulation stops a running simulation
func (bc *BackendClient) StopSimulation(simulationID string) error {
	url := fmt.Sprintf("%s/simulation/%s/stop", bc.baseURL, simulationID)

	req, err := http.NewRequest("POST", url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := bc.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("backend returned error (status %d): %s", resp.StatusCode, string(body))
	}

	return nil
}
