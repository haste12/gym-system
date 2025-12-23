# Deploying Gym Management System to Vercel

This guide will walk you through deploying your Gym Management System to Vercel with MongoDB Atlas.

## Prerequisites

1. **GitHub Account** - To connect your repository to Vercel
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas Account** - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## Step 1: Set Up MongoDB Atlas

### 1.1 Create a Free Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in or create a new account
3. Click **"Build a Database"**
4. Select **"M0 FREE"** tier
5. Choose a cloud provider and region (closest to your users)
6. Click **"Create Cluster"**

### 1.2 Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username and password (save these!)
5. Set user privileges to **"Read and write to any database"**
6. Click **"Add User"**

### 1.3 Whitelist IP Addresses

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for Vercel)
4. Click **"Confirm"**

### 1.4 Get Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@...`)
5. Replace `<password>` with your database user password
6. Replace `<database>` with `gym-system` (or your preferred database name)

**Example:**
```
mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/gym-system?retryWrites=true&w=majority
```

---

## Step 2: Prepare Your Project

### 2.1 Push to GitHub

1. Initialize git repository (if not already done):
   ```bash
   cd Gym-system
   git init
   git add .
   git commit -m "Initial commit - Gym Management System"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/gym-system.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Deploy to Vercel

### 3.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3.2 Configure Project

1. **Root Directory**: Set to `frontend`
2. **Framework Preset**: Next.js (auto-detected)
3. **Build Command**: `npm run build` (auto-filled)
4. **Output Directory**: `.next` (auto-filled)

### 3.3 Add Environment Variables

Click **"Environment Variables"** and add the following:

| Name | Value |
|------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Your Gmail App Password* |

**\*How to get Gmail App Password:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification (if not already enabled)
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select "Mail" and "Other (Custom name)"
5. Enter "Gym System" and click Generate
6. Copy the 16-character password

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. You'll get a URL like: `https://gym-system.vercel.app`

---

## Step 4: Test Your Deployment

### 4.1 Test Login

1. Visit your Vercel URL
2. You should be redirected to the login page
3. Login with:
   - **Username**: `admin`
   - **Password**: `admin@123`

### 4.2 Test Member Operations

1. Try adding a new member
2. Search for members
3. Update member information
4. Delete a member

### 4.3 Test Email Functionality

1. Add a member with an email address
2. Use the test email feature to verify email sending works

---

## Step 5: Set Up Daily Expiration Checks (Optional)

Since Vercel serverless functions don't support cron jobs on the free tier, you can use a free external service:

### Option 1: Cron-job.org (Free)

1. Go to [cron-job.org](https://cron-job.org)
2. Create a free account
3. Create a new cron job:
   - **URL**: `https://your-app.vercel.app/api/members/check-expirations`
   - **Schedule**: Daily at 9:00 AM
   - **Title**: "Gym Expiration Check"
4. Save and enable the job

### Option 2: Manual Trigger

You can manually trigger the expiration check by visiting:
```
https://your-app.vercel.app/api/members/check-expirations
```

---

## Troubleshooting

### Build Errors

If you get build errors:
1. Check the Vercel build logs
2. Make sure all dependencies are in `package.json`
3. Verify the root directory is set to `frontend`

### Database Connection Issues

If members aren't loading:
1. Verify your MongoDB connection string is correct
2. Check that you whitelisted all IP addresses (0.0.0.0/0)
3. Ensure database user has proper permissions

### Email Not Sending

If emails aren't working:
1. Verify you're using a Gmail App Password, not your regular password
2. Check that 2-Step Verification is enabled on your Google account
3. Test with the `/api/members/test-email` endpoint

---

## Updating Your Deployment

Whenever you push changes to GitHub:
1. Vercel will automatically rebuild and redeploy
2. No manual intervention needed!

---

## Environment Variables Reference

Create a `.env.local` file in the `frontend` directory for local development:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gym-system
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Never commit `.env.local` to GitHub!** (It's already in `.gitignore`)

---

## Support

If you encounter issues:
- Check Vercel deployment logs
- Verify all environment variables are set correctly
- Ensure MongoDB Atlas is configured properly
- Test API endpoints individually

---

**Congratulations! Your Gym Management System is now live! 🎉**
