# x402 Load Test Engine - Complete Setup Guide

This project consists of three parts:
1. **React Dashboard** (Frontend) - Beautiful real-time monitoring UI
2. **Go Backend** (Load Engine) - Handles load testing simulation
3. **Express.js x402 Server** (Test Target) - Your x402 payment API

## 📁 Project Structure

```
.
├── backend/              # Go load testing engine
│   ├── main.go
│   ├── agent.go
│   ├── simulation.go
│   ├── metrics.go
│   ├── handler.go
│   ├── blockchain.go
│   └── web/             # Alternative HTML dashboard
├── x402-server/         # Express.js x402 payment API
│   ├── server.js
│   ├── .env
│   └── package.json
├── src/                 # React dashboard (this repo)
└── SETUP.md            # This file
```

## 🚀 Step-by-Step Setup

### Step 1: Install Prerequisites

You need:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Go** (v1.21 or higher) - [Download](https://go.dev/dl/)

Verify installations:
```bash
node --version
npm --version
go version
```

### Step 2: Setup the x402 Payment Server

This is your test target - the API that will receive payment requests.

```bash
# Navigate to x402 server directory
cd x402-server

# Install dependencies
npm install

# Start the server (runs on port 4021)
npm start
```

You should see:
```
Server listening at http://localhost:4021
```

**Keep this terminal running!** ✅

### Step 3: Setup the Go Backend (Load Engine)

This runs the actual load testing simulation.

Open a **NEW terminal** and run:

```bash
# Navigate to backend directory
cd backend

# Download Go dependencies
go mod download

# Run the backend (runs on port 8888)
go run .
```

You should see:
```
🚀 Starting x402 Load Test Engine...
✅ Engine listening on http://localhost:8888
```

**Keep this terminal running too!** ✅

### Step 4: Setup the React Dashboard

This is the beautiful UI for monitoring tests.

Open a **THIRD terminal** and run:

```bash
# Install dependencies (from project root)
npm install

# Start the React dev server
npm run dev
```

The dashboard will open at `http://localhost:8888` (Vite dev server).

## 🎯 Running Your First Load Test

1. **Open the React Dashboard** in your browser
2. You'll see the configuration form with default values:
   - Target Endpoint: `http://localhost:4021/weather`
   - Virtual Agents: 50
   - Duration: 60 seconds
   - Ramp-Up: 10 seconds

3. **Click "Deploy Simulation"**
4. Watch the real-time dashboard update with:
   - Throughput (requests/sec)
   - Average latency
   - Success rate
   - Performance charts

## 🔧 Troubleshooting

### Error: "Failed to deploy simulation"
- ✅ Make sure the Go backend is running on port 8888
- ✅ Check that you ran `go mod download` first

### Error: "NetworkError when attempting to fetch"
- ✅ Verify all three servers are running
- ✅ Check for CORS issues (backend has CORS enabled)

### x402 Payment Errors
- ✅ Make sure the x402-server is running on port 4021
- ✅ Check the `.env` file has correct configuration

### Port Already in Use
If port 8888 or 4021 is taken:
- Change the Go backend port in `backend/main.go`
- Change the x402 server port in `x402-server/server.js`
- Update `VITE_API_URL` in the React app's `.env`

## 📊 Understanding the Results

- **Throughput**: Requests per second your API can handle
- **Latency**: Average time for complete x402 payment flow
- **Success Rate**: % of successful 402 → payment → 200 flows
- **Error Breakdown**: HTTP errors vs blockchain transaction failures

## 🎥 Demo Tips for Hackathon

1. Start with 10 agents, show it working
2. Gradually increase to 50, 100+ agents
3. Point out the real-time charts updating
4. Highlight the x402 payment flow completion
5. Show error handling when you overwhelm the server

## 📝 Notes

- The blockchain transactions are **mocked** for demo purposes
- Real blockchain integration would use Solana SDK
- The React dashboard auto-refreshes every 1.5 seconds
- Simulations automatically stop after the configured duration

---

**Built for x402 Hackathon - Best Dev Tool Category** 🏆
