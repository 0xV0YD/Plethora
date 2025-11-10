#!/bin/bash

echo "🚀 x402 Load Test Engine - Quick Start Script"
echo "=============================================="
echo ""

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install Go 1.21+ from https://go.dev/dl/"
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Prerequisites check passed!"
echo ""

# Start x402 server in background
echo "📡 Starting x402 Payment Server (port 4021)..."
cd x402-server
npm install > /dev/null 2>&1
npm start &
X402_PID=$!
cd ..
echo "✅ x402 server started (PID: $X402_PID)"

# Wait a moment for x402 server to start
sleep 2

# Start Go backend in background
echo "⚙️  Starting Go Load Engine (port 8888)..."
cd backend
go mod download > /dev/null 2>&1
go run . &
GO_PID=$!
cd ..
echo "✅ Go backend started (PID: $GO_PID)"

# Wait for backend to be ready
sleep 2

# Start React dashboard
echo "🎨 Starting React Dashboard..."
npm install > /dev/null 2>&1
npm run dev &
REACT_PID=$!

echo ""
echo "=============================================="
echo "✅ All services started successfully!"
echo ""
echo "📊 Open your browser to: http://localhost:8888"
echo ""
echo "To stop all services, press Ctrl+C"
echo "=============================================="

# Trap to kill all background processes on exit
trap "kill $X402_PID $GO_PID $REACT_PID 2>/dev/null" EXIT

# Wait for user to stop
wait
