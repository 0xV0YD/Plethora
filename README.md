# 🚀 Plethora - x402 Simulator & Load Testing Suite

<div align="center">

**Battle-test your x402-enabled APIs before production**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solana](https://img.shields.io/badge/Solana-Devnet-14F195?logo=solana)](https://solana.com)
[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go)](https://golang.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Usage](#-usage) • [Documentation](#-documentation)

</div>

---

## 📖 Overview

**Plethora** is a comprehensive load testing and simulation framework designed specifically for x402-enabled APIs. It simulates thousands of autonomous AI agents making concurrent micropayments on the Solana devnet, providing critical insights into your application's **performance**, **scalability**, and **resilience** under real-world pressure.

### The Problem We Solve

When you build an API monetized with x402, manual testing only answers *"Does it work?"* but leaves critical questions unanswered:

- **Scalability**: What happens when 1,000 agents access your API simultaneously?
- **Resilience**: Can your app handle failed Solana transactions gracefully?
- **Performance**: How does response time degrade under heavy load?
- **Cost**: What are your actual Solana network fees at scale?

Plethora provides the **missing piece** of the development lifecycle, moving x402 from prototype to production-ready.

---

## ✨ Features

### 🎯 Core Capabilities

- **Concurrent Agent Simulation**: Spin up thousands of virtual agents making real x402 payments
- **Real-time Analytics Dashboard**: Monitor throughput, response times, and error rates live
- **Interactive CLI**: Configure and control simulations from your terminal
- **Blockchain Integration**: Full Solana devnet/testnet support with wallet management
- **Multiple Load Patterns**: Constant load, spike testing, stress testing until failure
- **Comprehensive Reporting**: Detailed breakdowns of HTTP errors, blockchain failures, and performance metrics

### 🛠️ Components

| Component | Description |
|-----------|-------------|
| **go-cli** | Interactive command-line interface for simulation control |
| **engine** | Core simulation engine managing virtual agents and payments |
| **dashboard** | Web App version of our CLI App |
| **x402-test** | Protected backend service for testing x402 implementations |
| **solana-stress-forge** | Real-time analytics and monitoring web interface |

---

## 🚀 Quick Start

### Prerequisites

- **Go** 1.21 or higher
- **Node.js** 18 or higher
- **npm** or **yarn**
- Solana CLI tools (optional, for wallet management)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/plethora.git
cd plethora
```

#### 2. Setup the Engine

The engine manages wallet pools and payment processing.

```bash
cd engine
npm install
```

**Configure Wallets**: Create a `wallets.json` file in the `engine` directory with your pre-funded Solana devnet wallets:

```json
{
  "wallets": [
    {
      "publicKey": "YOUR_PUBLIC_KEY_1",
      "privateKey": "YOUR_PRIVATE_KEY_1"
    },
    {
      "publicKey": "YOUR_PUBLIC_KEY_2",
      "privateKey": "YOUR_PRIVATE_KEY_2"
    }
  ],
  "network": "devnet"
}
```

**Start the Engine**:

```bash
node server.js
```

The engine will start on `http://localhost:3000` (or your configured port).

#### 3. Setup the Protected Backend (x402-test)

This is your test x402-enabled API endpoint.

```bash
cd ../x402-test
npm install
node server.js
```

The protected backend will start on `http://localhost:4000` (default).

#### 4. Launch the Dashboard

The dashboard provides real-time visualization of your simulation metrics.

```bash
cd ../dashboard
npm install
npm start
```

The dashboard will open automatically at `http://localhost:5000`.

#### 5. Run the CLI

The interactive CLI guides you through the entire simulation process.

```bash
cd ../go-cli
go run main.go
```

**Follow the interactive prompts**:
- Enter your target x402 API endpoint
- Configure the number of concurrent agents
- Select your load pattern (constant, spike, or stress test)
- Set test duration and ramp-up period
- Start the simulation!

The CLI will automatically orchestrate all components and display real-time progress.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Plethora Suite                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐    │
│  │          │         │          │         │          │    │
│  │   CLI    │────────▶│  Engine  │────────▶│ x402 API │    │
│  │ (Go)     │         │ (Node)   │         │ (Test)   │    │
│  │          │         │          │         │          │    │
│  └──────────┘         └────┬─────┘         └──────────┘    │
│                            │                                 │
│                            │                                 │
│                            ▼                                 │
│                     ┌──────────┐                            │
│                     │          │                            │
│                     │ Solana   │                            │
│                     │ Devnet   │                            │
│                     │          │                            │
│                     └──────────┘                            │
│                            │                                 │
│                            │                                 │
│                            ▼                                 │
│                     ┌──────────┐                            │
│                     │          │                            │
│                     │Dashboard │                            │
│                     │Analytics │                            │
│                     │          │                            │
│                     └──────────┘                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Workflow

1. **CLI** receives user configuration and starts the simulation
2. **Engine** spawns virtual agents that execute the x402 payment flow:
   - Make initial GET request → receive 402 Payment Required
   - Construct & sign Solana SPL token transfer
   - Submit transaction to Solana network
   - Make authenticated request with transaction signature
   - Record metrics (success/failure, response time)
3. **Dashboard** displays real-time metrics and visualizations
4. **x402-test** backend serves as the protected API being tested

---

## 📊 Usage

### Running a Basic Load Test

```bash
cd go-cli
go run main.go
```

**Example Configuration**:
```yaml
backend_endpoint: http://localhost:3000/api/v1
target_endpoint: http://localhost:4021/premium/content
num_agents: 15
test_duration_seconds: 10
ramp_up_period_seconds: 10
traffic_pattern: Constant Load
solana_network: devnet
payer_wallet_count: 10
output_file: config.yaml
```

### Monitoring Results

Once the simulation starts, open the dashboard at `the url shown in the terminal` to monitor:

- **Throughput**: Requests per second
- **Response Times**: Average, median, p95, p99
- **Error Rates**: HTTP errors vs blockchain errors
- **Time-series Graphs**: Performance over time
- **Transaction Success Rate**: Solana payment confirmations

### Advanced Configurations

#### Spike Load Testing
Simulates sudden traffic bursts:
```yaml
Load Pattern: Spike
Peak Agents: 5000
Spike Duration: 30 seconds
Rest Duration: 60 seconds
```

#### Stress Testing
Continuously increases load until failure:
```yaml
Load Pattern: Stress
Starting Agents: 100
Increment: 100 agents/minute
```

---

## 📚 Documentation



**Dashboard** (`url which is shown in the terminal`)
- The whole analytics of the simulation for  metrics


### Configuration Files

#### `config.yaml` Structure
```yaml
backend_endpoint: string       # Engine API endpoint
target_endpoint: string         # x402-protected API to test
num_agents: integer            # Number of concurrent agents
test_duration_seconds: integer # Total test duration
ramp_up_period_seconds: integer # Gradual agent spawn period
traffic_pattern: string        # Constant/Spike/Stress
solana_network: string         # devnet/testnet/mainnet
payer_wallet_count: integer    # Number of wallets in pool
output_file: string            # Results output path
```

#### `wallets.json` Structure
```json
{
  "wallets": [
    {
      "publicKey": "Base58PublicKey",
      "privateKey": "[byte array or base58]"
    }
  ],
  "network": "devnet|testnet|mainnet-beta"
}
```

---



### Tech Stack

- **Go**: Follow standard Go formatting (`gofmt`)
- **JavaScript/TypeScript**: ESLint + Prettier


---



## 🙏 Acknowledgments

- [Solana Foundation](https://solana.com) for blockchain infrastructure
- [x402 Protocol](https://x402.org) for micropayment standards
- Open source community for incredible tools and libraries

---


<div align="center">

**Made with ❤️ for the x402 community**

⭐ Star us on GitHub if Plethora helps your project!

</div>