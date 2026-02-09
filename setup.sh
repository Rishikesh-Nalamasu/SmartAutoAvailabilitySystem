#!/bin/bash

# Admin Dashboard Setup Script

echo "🚀 Starting Admin Dashboard Setup..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo -e "${GREEN}✓ Node.js is installed${NC}"

# Setup Backend
echo -e "\n${BLUE}Setting up Backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi

echo -e "${BLUE}Backend setup complete!${NC}"

# Setup Frontend
echo -e "\n${BLUE}Setting up Frontend...${NC}"
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

# Ensure leaflet-draw is installed
echo "Ensuring leaflet-draw is installed..."
npm list leaflet-draw > /dev/null 2>&1
if [ $? -ne 0 ]; then
    npm install leaflet-draw --legacy-peer-deps
    echo -e "${GREEN}✓ leaflet-draw installed${NC}"
else
    echo -e "${GREEN}✓ leaflet-draw is installed${NC}"
fi

echo -e "${BLUE}Frontend setup complete!${NC}"

echo -e "\n${GREEN}✅ Setup Complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Create MySQL database and tables (see README.md)"
echo "2. Update .env file in backend folder if needed"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm run dev"
echo ""
echo "Happy coding! 🎉"
