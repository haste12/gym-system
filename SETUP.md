# Environment Setup Guide

## Quick Start (Windows)

### 1. Install Prerequisites

#### Node.js

- Download: https://nodejs.org/ (LTS version)
- Install and verify:

```powershell
node --version
npm --version
```

#### MongoDB

- Download: https://www.mongodb.com/try/download/community
- Install with default settings
- MongoDB will start automatically as a service

### 2. Start Services

#### MongoDB (if not running automatically)

```powershell
net start MongoDB
```

#### Backend Server

```powershell
cd backend
npm install
npm run dev
```

#### Frontend Server (new terminal)

```powershell
cd frontend
npm install
npm run dev
```

### 3. Access Application

Open browser and go to: **http://localhost:3000**

---

## Detailed Installation

### Windows Setup

#### Step 1: Install Node.js

1. Download from https://nodejs.org/
2. Run installer (choose "Add to PATH" during installation)
3. Restart computer
4. Open PowerShell and verify:
   ```powershell
   node --version  # Should show v14.0.0 or higher
   npm --version   # Should show 6.0.0 or higher
   ```

#### Step 2: Install MongoDB

1. Download Community Edition from https://www.mongodb.com/try/download/community
2. Run installer
3. Accept license agreement
4. Choose "Complete" setup
5. Check "Install MongoDB as a Service"
6. Accept default service name and port (27017)
7. Uncheck "MongoDB Compass" (optional)
8. Finish installation

#### Step 3: Setup Backend

```powershell
# Navigate to backend folder
cd C:\Users\User\OneDrive\Desktop\Gym-system\backend

# Install dependencies (first time only)
npm install

# Verify installation
npm list express mongoose

# Start development server
npm run dev
```

You should see:

```
Connected to MongoDB
Server is running on port 5000
```

#### Step 4: Setup Frontend (new PowerShell window)

```powershell
# Navigate to frontend folder
cd C:\Users\User\OneDrive\Desktop\Gym-system\frontend

# Install dependencies (first time only)
npm install

# Verify installation
npm list next react

# Start development server
npm run dev
```

You should see:

```
ready - started server on 0.0.0.0:3000
```

#### Step 5: Access Application

Open browser: http://localhost:3000

---

## macOS Setup

### Prerequisites

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify
node --version
npm --version
```

### MongoDB Installation

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Stop MongoDB (when needed)
brew services stop mongodb-community

# Check status
brew services list
```

### Setup Project

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## Linux Setup (Ubuntu/Debian)

### Prerequisites

```bash
# Update package list
sudo apt update

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

### MongoDB Installation

```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

### Setup Project

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## MongoDB Atlas (Cloud Alternative)

If you prefer not to install MongoDB locally:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new cluster (free tier)
4. Get connection string:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gym-system?retryWrites=true&w=majority
   ```
6. Replace `username` and `password` with your credentials
7. Start backend: `npm run dev`

---

## Troubleshooting

### "Port 3000 already in use"

```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual ID)
taskkill /PID <PID> /F

# Or use different port:
# In frontend/.env.local add: PORT=3001
```

### "Port 5000 already in use"

```powershell
# Find and kill
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change in backend/.env: PORT=5001
```

### "MongoDB connection refused"

```powershell
# Windows: Start MongoDB service
net start MongoDB

# Check if running
tasklist | findstr mongod
```

### "Module not found" errors

```powershell
# Delete node_modules and reinstall
rm -r node_modules
npm install
```

### "CORS error in browser"

- Ensure backend is running on http://localhost:5000
- Check frontend .env.local has: NEXT_PUBLIC_API_URL=http://localhost:5000/api
- Restart frontend server after changes

---

## Development Workflow

### Terminal 1 - MongoDB (if running locally)

```powershell
# Just verify it's running
net start MongoDB
```

### Terminal 2 - Backend

```powershell
cd Gym-system\backend
npm run dev
```

### Terminal 3 - Frontend

```powershell
cd Gym-system\frontend
npm run dev
```

### Open Browser

- http://localhost:3000

---

## Useful Commands

### Backend

```powershell
npm run dev      # Development mode (with auto-reload)
npm start        # Production mode
npm install      # Install dependencies
```

### Frontend

```powershell
npm run dev      # Development server
npm run build    # Create production build
npm start        # Run production build
npm run lint     # Check code quality
```

### MongoDB

```powershell
# Windows
net start MongoDB    # Start service
net stop MongoDB     # Stop service
tasklist | findstr mongod  # Check if running
```

---

## Next Steps

1. Add first member in the UI
2. Test search functionality
3. Try setting different expiration dates
4. Check expired members list
5. Read main README.md for full feature documentation
