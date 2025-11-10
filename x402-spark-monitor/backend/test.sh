#!/bin/bash

echo "🧪 Testing x402 Load Test Engine..."
echo ""

# Test 1: Check if server is running
echo "1️⃣  Testing server health..."
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/)
if [ "$HEALTH" == "200" ]; then
    echo "   ✅ Server is running"
else
    echo "   ❌ Server not responding (HTTP $HEALTH)"
    exit 1
fi

# Test 2: Deploy a simulation
echo ""
echo "2️⃣  Deploying test simulation..."
RESPONSE=$(curl -s -X POST http://localhost:8080/api/simulation/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "target_endpoint": "https://httpbin.org/status/402",
    "num_agents": 5,
    "test_duration_seconds": 15,
    "ramp_up_period_seconds": 2
  }')

echo "   Response: $RESPONSE"

# Extract simulation ID
SIM_ID=$(echo $RESPONSE | grep -o '"simulation_id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$SIM_ID" ]; then
    echo "   ❌ Failed to create simulation"
    exit 1
fi

echo "   ✅ Simulation created: $SIM_ID"
echo "   🌐 Dashboard: http://localhost:8080/dashboard/$SIM_ID"

# Test 3: Check simulation status
echo ""
echo "3️⃣  Checking simulation status..."
sleep 3
STATUS=$(curl -s http://localhost:8080/api/simulation/$SIM_ID/status)
echo "   Status: $STATUS" | jq '.' 2>/dev/null || echo "   Status: $STATUS"

# Test 4: Wait and check metrics
echo ""
echo "4️⃣  Waiting 10 seconds for metrics..."
sleep 10

STATUS=$(curl -s http://localhost:8080/api/simulation/$SIM_ID/status)
TOTAL_REQUESTS=$(echo $STATUS | grep -o '"totalRequests":[0-9]*' | cut -d':' -f2)

if [ ! -z "$TOTAL_REQUESTS" ] && [ "$TOTAL_REQUESTS" -gt "0" ]; then
    echo "   ✅ Metrics are being collected: $TOTAL_REQUESTS requests"
else
    echo "   ⚠️  No requests recorded yet"
fi

# Test 5: Stop simulation
echo ""
echo "5️⃣  Stopping simulation..."
STOP_RESPONSE=$(curl -s -X POST http://localhost:8080/api/simulation/$SIM_ID/stop)
echo "   Response: $STOP_RESPONSE"

echo ""
echo "🎉 All tests completed!"
echo ""
echo "📊 View the dashboard at: http://localhost:8080/dashboard/$SIM_ID"
echo ""