#!/bin/bash
# Quick start script for Gym Management System

echo "🏋️  Gym Management System - Quick Start"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if MongoDB is accessible
echo "Checking MongoDB connection..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB found"
else
    echo "⚠️  MongoDB not found in PATH. Make sure MongoDB is running."
fi

echo ""
echo "Starting Gym Management System..."
echo ""

# Install backend dependencies
echo "📦 Setting up Backend..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "======================================"
echo "✅ Setup complete!"
echo ""
echo "To run the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "======================================"
