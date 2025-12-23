# Gym Management System Backend

Express.js API server for the Gym Management System.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Production

```bash
npm start
```

## Environment Variables

Create a `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/gym-system
PORT=5000
NODE_ENV=development
```

## API Endpoints

### Members

- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member
- `GET /api/members/search?name=...` - Search members by name
- `GET /api/members/expired/list` - Get expired members

### Health Check

- `GET /api/health` - Check API status

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote)

## Database Setup

Make sure MongoDB is running:

```bash
# For local MongoDB
mongod
```

Or use MongoDB Atlas (cloud) by updating the MONGODB_URI in .env
