@echo off
echo ============================================
echo 🚀 x402 Load Test Engine - Quick Start
echo ============================================
echo.

REM Check if Go is installed
where go >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Go is not installed. Please install Go 1.21+ from https://go.dev/dl/
    pause
    exit /b 1
)

REM Check if Node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!
echo.

REM Start x402 server
echo 📡 Starting x402 Payment Server (port 4021)...
start "x402-server" cmd /k "cd x402-server && npm install && npm start"
timeout /t 3 /nobreak >nul
echo ✅ x402 server started
echo.

REM Start Go backend
echo ⚙️  Starting Go Load Engine (port 8888)...
start "Go Backend" cmd /k "cd backend && go mod download && go run ."
timeout /t 3 /nobreak >nul
echo ✅ Go backend started
echo.

REM Start React dashboard
echo 🎨 Starting React Dashboard...
start "React Dashboard" cmd /k "npm install && npm run dev"
echo ✅ React dashboard starting...
echo.

echo ============================================
echo ✅ All services are starting!
echo.
echo 📊 Open your browser to: http://localhost:8888
echo.
echo Close the terminal windows to stop services
echo ============================================
echo.
pause
