@echo off
REM Quick start script for Gym Management System on Windows

echo.
echo ===============================================
echo Gym Management System - Windows Quick Start
echo ===============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo OK - Node.js found
node --version
echo OK - npm version:
npm --version

echo.
echo Checking MongoDB...
where mongod >nul 2>nul
if errorlevel 1 (
    echo WARNING: MongoDB not found in PATH
    echo Make sure MongoDB is running on localhost:27017
) else (
    echo OK - MongoDB found
)

echo.
echo Setting up Backend...
cd backend
call npm install
if errorlevel 1 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)
echo OK - Backend dependencies installed

echo.
echo Setting up Frontend...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)
echo OK - Frontend dependencies installed

echo.
echo ===============================================
echo Setup Complete!
echo ===============================================
echo.
echo To run the application:
echo.
echo 1. Start MongoDB (if not running):
echo    net start MongoDB
echo.
echo 2. Start Backend in Terminal 1:
echo    cd backend
echo    npm run dev
echo.
echo 3. Start Frontend in Terminal 2:
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open browser: http://localhost:3000
echo.
echo ===============================================
echo.
pause
