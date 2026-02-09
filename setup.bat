@echo off
REM Admin Dashboard Setup Script for Windows

echo.
echo 🚀 Starting Admin Dashboard Setup...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✓ Node.js is installed
echo.

REM Setup Backend
echo Setting up Backend...
cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    echo ✓ Backend dependencies installed
) else (
    echo ✓ Backend dependencies already installed
)

echo Backend setup complete!
echo.

REM Setup Frontend
echo Setting up Frontend...
cd ..\frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    echo ✓ Frontend dependencies installed
) else (
    echo ✓ Frontend dependencies already installed
)

REM Ensure leaflet-draw is installed
echo Ensuring leaflet-draw is installed...
npm list leaflet-draw >nul 2>&1
if errorlevel 1 (
    call npm install leaflet-draw --legacy-peer-deps
    echo ✓ leaflet-draw installed
) else (
    echo ✓ leaflet-draw is installed
)

echo Frontend setup complete!
echo.

echo ✅ Setup Complete!
echo.
echo Next steps:
echo 1. Create MySQL database and tables (see README.md)
echo 2. Update .env file in backend folder if needed
echo 3. Start backend: cd backend && npm run dev
echo 4. Start frontend: cd frontend && npm run dev
echo.
echo Happy coding! 🎉
echo.
pause
