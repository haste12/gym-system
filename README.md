# Gym Management System - Complete Setup Guide

A full-stack gym membership management system built with React, Next.js, Express.js, MongoDB, and Tailwind CSS.

## Project Structure

```
Gym-system/
├── frontend/                 # Next.js + React + Tailwind CSS
│   ├── pages/
│   │   ├── index.js         # Main dashboard
│   │   └── _document.js
│   ├── components/
│   │   ├── SearchBar.js
│   │   ├── MembersTable.js
│   │   ├── ExpiredMembers.js
│   │   └── AddMemberForm.js
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   ├── api.js
│   │   └── dateUtils.js
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── backend/                  # Express.js + MongoDB
    ├── models/
    │   └── Member.js        # MongoDB schema
    ├── controllers/
    │   └── memberController.js
    ├── routes/
    │   └── members.js
    ├── server.js            # Main server file
    ├── package.json
    └── .env                 # Environment variables
```

## Features

✅ **Member Management**

- Add new gym members with name, age, Iraqi phone number
- Automatic expiration date calculation based on payment period (1, 3, 6, or 12 months)
- View all members in an organized table

✅ **Search & Filter**

- Real-time search by member name
- Filter and display results instantly

✅ **Membership Status Tracking**

- Active members (green status)
- Expiring soon members (yellow status - within 7 days)
- Expired members (red status)

✅ **Expired Members List**

- Dedicated section showing all expired memberships
- Contact information readily available for renewal

✅ **Responsive Design**

- Mobile-friendly interface
- Clean, modern UI with Tailwind CSS

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas cloud)
- **Git** (optional, for version control)

### MongoDB Setup

#### Option 1: Local MongoDB (Recommended for development)

1. Download and install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service:

   ```bash
   # Windows
   net start MongoDB

   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

#### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `.env` file in backend folder with your MongoDB URI

## Installation & Setup

### 1. Clone or Extract Project

```bash
cd Gym-system
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (already created, verify it exists)
# It should contain:
# MONGODB_URI=mongodb://localhost:27017/gym-system
# PORT=5000
# NODE_ENV=development

# Start the backend server (development mode with auto-reload)
npm run dev

# Or for production:
npm start
```

Backend will run on: **http://localhost:5000**

Check health: **http://localhost:5000/api/health**

### 3. Setup Frontend (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
# Content:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

Open http://localhost:3000 in your browser!

## Usage Guide

### Adding a Member

1. Fill in the "Add New Member" form with:

   - **Name**: Member's full name
   - **Age**: Member's age
   - **Phone Number**: Iraqi phone number (e.g., +964...")
   - **Payment Date**: Date of payment (defaults to today)
   - **Membership Duration**: Select 1, 3, 6, or 12 months

2. Click "Add Member" button
3. System automatically calculates expiration date
4. Member appears in the table

### Searching Members

1. Use the search bar at the top
2. Type member's name
3. Table filters in real-time
4. Click "Clear" to reset search

### Monitoring Memberships

- **Active** (Green): Membership is valid with more than 7 days remaining
- **Expiring Soon** (Yellow): Membership expires within 7 days (shows days left)
- **Expired** (Red): Membership has expired

### Expired Members Section

The "Expired Members" list shows:

- All members whose membership has expired
- Their name, phone number, and expiration date
- Perfect for sending renewal reminders

## API Endpoints Reference

### Base URL: `http://localhost:5000/api`

#### Members

| Method | Endpoint                    | Description         |
| ------ | --------------------------- | ------------------- |
| GET    | `/members`                  | Get all members     |
| GET    | `/members/:id`              | Get member by ID    |
| POST   | `/members`                  | Create new member   |
| PUT    | `/members/:id`              | Update member       |
| DELETE | `/members/:id`              | Delete member       |
| GET    | `/members/search?name=john` | Search by name      |
| GET    | `/members/expired/list`     | Get expired members |

#### Health Check

| Method | Endpoint  | Description      |
| ------ | --------- | ---------------- |
| GET    | `/health` | Check API status |

### Example Request (Create Member)

```bash
curl -X POST http://localhost:5000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "age": 28,
    "phoneNumber": "+964791234567",
    "paymentDate": "2025-12-06",
    "expirationDate": "2026-01-06",
    "months": 1
  }'
```

## Database Schema

### Member Collection

```javascript
{
  _id: ObjectId,
  name: String,                    // Member's full name
  age: Number,                     // Member's age
  phoneNumber: String,             // Iraqi phone number
  paymentDate: Date,               // Date of payment
  expirationDate: Date,            // Automatic expiration date
  months: Number,                  // Duration of membership
  createdAt: Date,                 // Created timestamp
  updatedAt: Date                  // Last updated timestamp
}
```

## Troubleshooting

### "Cannot connect to MongoDB"

- Ensure MongoDB is running
- Check `.env` file has correct MONGODB_URI
- For local: `mongodb://localhost:27017/gym-system`
- For Atlas: Check connection string format

### "API is not responding"

- Verify backend is running on port 5000
- Check that `npm run dev` completed without errors
- Look for port conflicts: `netstat -ano | findstr :5000` (Windows)

### "Frontend not loading"

- Ensure backend is running first
- Check `.env.local` has correct API URL
- Verify port 3000 is available
- Check browser console for errors (F12)

### Date issues

- Dates are calculated in user's local timezone
- Format: MM/DD/YYYY
- Expiration is automatic based on payment date + months

## Building for Production

### Frontend Build

```bash
cd frontend

# Create optimized build
npm run build

# Start production server
npm start
```

### Backend Production

```bash
cd backend

# Set environment
set NODE_ENV=production

# Start server
npm start
```

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://your-api-domain.com/api
```

### Backend (.env)

```
MONGODB_URI=mongodb://localhost:27017/gym-system
PORT=5000
NODE_ENV=development
```

For MongoDB Atlas, use:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gym-system?retryWrites=true&w=majority
```

## Technologies Used

### Frontend

- **React 18** - UI library
- **Next.js 14** - React framework with SSR
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client for API calls

### Backend

- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Auto-reload during development

### Additional Dependencies

- **dotenv** - Environment variable management

## Common Tasks

### Renew Member Subscription

1. Find member in table or search
2. Note the current expiration date
3. Update member with new payment date and expiration date (via API or by re-adding)

### Bulk Export Members

Modify the backend to add:

```javascript
// Add to routes
router.get("/export/csv", exportMembers);
```

### Send Renewal Reminders

Use the Expired Members list to get contact information and send SMS/Email notifications.

## Future Enhancements

- User authentication and authorization
- Member attendance tracking
- Payment history
- Email/SMS notifications for expiring memberships
- Admin dashboard with statistics
- Bulk import/export members
- Mobile app
- Payment integration
- Monthly reports and analytics

## Support & Help

For issues or questions:

1. Check the troubleshooting section above
2. Review API documentation
3. Check browser console and server logs
4. Ensure all prerequisites are installed correctly

## License

This project is free to use and modify.

---

**Happy managing your gym! 💪**
