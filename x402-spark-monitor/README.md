# x402 Load Test Engine 🚀

A professional load testing tool for x402 payment APIs. Monitor throughput, latency, and blockchain transaction performance in real-time.

![x402 Load Test Engine](https://img.shields.io/badge/x402-Hackathon-blue)
![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)

## 🎯 What is This?

This is a **complete infrastructure tool** for developers building with x402 payment APIs. It simulates hundreds of concurrent virtual agents performing the full x402 payment handshake:

1. **GET request** → Receives `402 Payment Required`
2. **Blockchain payment** → Sends SPL token transaction
3. **Authorized GET** → Receives `200 OK` with content

All while collecting real-time metrics on throughput, latency, and error rates.

## ✨ Features

- 🔥 **Concurrent Load Testing** - Simulate 1-1000+ virtual agents
- 📊 **Real-Time Dashboard** - Beautiful charts and live metrics
- ⚡ **x402 Payment Flow** - Complete handshake simulation
- 🎯 **Performance Analytics** - Throughput, latency, error breakdown
- 🚀 **Easy Setup** - Just 3 commands to get started

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  React Dashboard│─────▶│  Go Load Engine  │─────▶│  x402 API       │
│  (Port 8888)    │      │  (Port 8888)     │      │  (Port 4021)    │
│  Visualization  │◀─────│  Orchestration   │◀─────│  Payment Flow   │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

## 🚀 Quick Start

See [SETUP.md](./SETUP.md) for detailed installation instructions.

### Prerequisites
- Node.js 18+
- Go 1.21+

### 3-Step Launch

**Terminal 1** - Start x402 Test Server:
```bash
cd x402-server
npm install && npm start
```

**Terminal 2** - Start Go Backend:
```bash
cd backend
go mod download && go run .
```

**Terminal 3** - Start React Dashboard:
```bash
npm install && npm run dev
```

Open `http://localhost:8888` and deploy your first load test! 🎉

## 📊 Dashboard Features

### Real-Time Metrics
- **Throughput**: Requests per second
- **Latency**: Average response time in ms
- **Success Rate**: Percentage of successful transactions
- **Error Breakdown**: HTTP vs Blockchain failures

### Performance Charts
- Time-series visualization of RPS and latency
- Live updates every 1.5 seconds
- Historical data for entire test run

### Simulation Control
- Configure agents, duration, ramp-up period
- Stop tests mid-flight
- Track progress with live status updates

## 🎯 Use Cases

- **API Performance Testing** - Find your throughput limits
- **Payment Flow Validation** - Ensure x402 works under load
- **Bottleneck Identification** - Pinpoint slow components
- **SLA Verification** - Confirm response time requirements
- **Capacity Planning** - Determine infrastructure needs

## 🏆 Hackathon Category

**Best x402 Dev Tool** - This is core infrastructure that empowers every x402 developer to build better, more reliable payment APIs.

## 📝 Configuration

Edit `x402-server/.env` to customize your x402 payment settings:

```env
FACILITATOR_URL=https://facilitator.payai.network
NETWORK=base-sepolia
ADDRESS=0x12654BBd384bf8FF90CFC0CA8b9400C539160a0F
```

## 🔧 Tech Stack

- **Frontend**: React 18, TypeScript, Recharts, TailwindCSS, shadcn/ui
- **Backend**: Go 1.21, Goroutines for concurrency
- **Test Target**: Express.js, x402-express middleware
- **Blockchain**: Solana SDK (mocked for demo)

## 📖 API Reference

### Deploy Simulation
```bash
POST /api/simulation/deploy
Content-Type: application/json

{
  "target_endpoint": "http://localhost:4021/weather",
  "num_agents": 50,
  "test_duration_seconds": 60,
  "ramp_up_period_seconds": 10
}
```

### Get Status
```bash
GET /api/simulation/{id}/status
```

### Stop Simulation
```bash
POST /api/simulation/{id}/stop
```

## 🎥 Demo Video

[Coming Soon]

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

Built with ❤️ for the x402 Hackathon

---

**Need Help?** See [SETUP.md](./SETUP.md) for detailed setup instructions.
