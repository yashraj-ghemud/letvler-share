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

## Production Deployment (Render)

### Backend Deployment

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Set root directory to `backend`
6. Build Command: `npm install`
7. Start Command: `node server.js`
8. Click "Deploy Web Service"

### Frontend Deployment

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Set root directory to `frontend`
5. Build Command: `npm install && npm run build`
6. Publish Directory: `dist`
7. Add Environment Variable:
   - Key: `VITE_BACKEND_URL`
   - Value: `https://letvler-share.onrender.com` (your backend URL)
8. Click "Deploy Static Site"

**Alternative:** Use the `render.yaml` file in the `frontend/` folder for automatic deployment configuration.

### Production URL Structure

- Frontend: `https://your-frontend-url.onrender.com`
- Backend: `https://letvler-share.onrender.com`
- Direct download: `https://letvler-share.onrender.com/99` (2-digit code)

## Notes

- Maximum 100 concurrent uploads (00-99)
- With 2-minute auto-delete, slots free up quickly
- Perfect for classroom presentations
- Zero database setup required
