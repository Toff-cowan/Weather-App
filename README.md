# Weather Disaster Tracker

A modern web application for tracking hurricanes, managing emergency reports, and coordinating disaster response.

## Features

- 🤖 AI-powered disaster safety chatbot
- 🗺️ Live storm tracking with satellite imagery
- 🚨 Emergency report system with email/SMS alerts
- 📊 Real-time analytics and storm data
- 💾 MongoDB database for report storage
- 📡 Bluetooth emergency network
- 📞 Regional emergency contacts

## Quick Start

```bash
npm install
npm run dev      # Frontend (port 3000)
npm run server   # Backend (port 5000)
```

## Configuration

Create `.env` file:

```env
GOOGLE_GEMINI_KEY=your_key
SENDGRID_API_KEY=your_key
EMAIL_FROM=your_email
EMERGENCY_EMAIL_TO=emergency_email
DATABASE_URL=mongodb_connection_string
PORT=5000
```

## Tech Stack

- React + Vite
- Express.js
- MongoDB
- Google Gemini AI
- SendGrid
- Tailwind CSS
- Chart.js

## API Endpoints

- `GET /api/health` - Service status
- `GET /api/active-storms` - Current storms
- `GET /api/storm-analytics` - Storm data
- `POST /api/emergency-report` - Submit report
- `POST /api/chat` - AI chatbot
- `GET /api/reports` - All reports

## Email

christoffcowan10@gmail.com
