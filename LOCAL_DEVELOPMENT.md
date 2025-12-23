# Local Development Setup

## Quick Fix: Running Locally

Since you don't have MongoDB installed locally but the backend server has it configured, you have two options:

### Option 1: Use the Old Backend for Local Development (Recommended)

1. **Start the backend server** (in one terminal):
   ```bash
   cd backend
   npm start
   ```

2. **Update frontend to use backend API** (temporary for local dev):
   
   In `frontend/utils/api.js`, change line 4 to:
   ```javascript
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
   ```

3. **Start the frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

### Option 2: Use MongoDB Atlas for Local Development

1. **Create a free MongoDB Atlas cluster** (follow DEPLOYMENT.md steps 1.1-1.4)

2. **Create `.env.local` file** in the `frontend` folder:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

3. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

---

## For Production (Vercel)

The new API routes in `frontend/pages/api/` will work automatically on Vercel with MongoDB Atlas.

---

## Current Issue

You're getting a 500 error because:
- The new Next.js API routes need a MongoDB connection
- You don't have `.env.local` configured yet
- The `MONGODB_URI` environment variable is missing

**Quick Fix:** Use Option 1 above to run the old backend alongside the frontend for now.
