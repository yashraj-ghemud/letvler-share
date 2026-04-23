# Letvler - Instant File Share

A minimalist, high-speed file sharing web application for classroom presentations.

## Prerequisites

**Node.js must be installed on your system.**

If you don't have Node.js installed, download it from: https://nodejs.org/

Verify installation by running:
```bash
node --version
npm --version
```

## Features

- **No Database**: Pure in-memory storage
- **2-Digit Codes**: Simple 00-99 codes for file sharing
- **Auto-Delete**: Files automatically delete after 2 minutes
- **Drag & Drop**: Easy file upload interface
- **Hacker UI**: Clean, terminal-style interface
- **URL Access**: Direct download via `letvler.com/99` format

## Tech Stack

- **Backend**: Node.js, Express, Multer
- **Frontend**: React, Vite, Tailwind CSS
- **Storage**: Temporary filesystem with automatic cleanup

## Setup Instructions

### Step 1: Install Backend Dependencies

Open a terminal in the `backend` folder and run:
```bash
cd backend
npm install
```

### Step 2: Start Backend Server

In the same terminal (backend folder):
```bash
npm start
```

Backend runs on `http://localhost:3000`

### Step 3: Install Frontend Dependencies

Open a NEW terminal in the `frontend` folder and run:
```bash
cd frontend
npm install
```

### Step 4: Start Frontend Dev Server

In the same terminal (frontend folder):
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## How It Works

1. **Upload**: Drag & drop a file → Get a 2-digit code (e.g., "42")
2. **Share**: Tell your students the code
3. **Download**: Students enter code or visit `localhost:5173/42`

## URL Structure

- Upload: `POST /upload` (multipart/form-data)
- Download: `GET /:code` (e.g., `/99`)
- Health: `GET /api/health`

## Auto-Deletion

Files are automatically deleted from disk and memory after exactly 2 minutes (120,000ms) using `setTimeout` and `fs.unlink`.

## Production Deployment

For production, the backend catch-all route `/:code` handles direct URL access. Configure your domain (e.g., letvler.com) to point to the backend server.

## Notes

- Maximum 100 concurrent uploads (00-99)
- With 2-minute auto-delete, slots free up quickly
- Perfect for classroom presentations
- Zero database setup required
