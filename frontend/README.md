# Gym Management System Frontend

This is the React/Next.js frontend for the Gym Management System.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Build

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Features

- Search members by name
- View all gym members in a table
- See member details (name, age, phone, payment date, expiration date)
- Monitor membership status (active, expiring soon, expired)
- Add new members with automatic expiration calculation
- View list of expired members
