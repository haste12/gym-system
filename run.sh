#!/bin/bash
# Run Gym Management System

echo "🏋️  Starting Gym Management System"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check MongoDB
echo "Checking MongoDB..."
if pgrep mongod > /dev/null; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB doesn't appear to be running${NC}"
    echo "   Start it with: brew services start mongodb-community"
fi

echo ""
echo "======================================"
echo "Starting Backend on http://localhost:5000"
echo "======================================"
cd backend
npm run dev &
BACKEND_PID=$!

sleep 3

echo ""
echo "======================================"
echo "Starting Frontend on http://localhost:3000"
echo "======================================"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✅ Both servers are running!${NC}"
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
