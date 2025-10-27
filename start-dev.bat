@echo off
echo ========================================
echo Weather Disaster Tracker - Starting...
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting development servers...
echo.
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the servers
echo.

REM Start both servers
start cmd /k "echo Starting Frontend... && npm run dev"
start cmd /k "echo Starting Backend... && npm run server"

echo Both servers are starting in separate windows!
pause

