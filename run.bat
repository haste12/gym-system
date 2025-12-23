@echo off
REM Run Gym Management System on Windows

echo.
echo ===============================================
echo Starting Gym Management System
echo ===============================================
echo.

REM Check MongoDB
echo Checking MongoDB...
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo WARNING: MongoDB service not running
    echo To start: net start MongoDB
) else (
    echo OK - MongoDB service is running
)

echo.
echo Make sure to run these commands in SEPARATE terminals:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo ===============================================
echo.
pause
