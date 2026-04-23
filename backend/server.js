const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// In-memory storage for file mappings
const fileMap = {};

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Generate random 2-digit code (00-99)
function generateCode() {
  return Math.floor(Math.random() * 100).toString().padStart(2, '0');
}

// Clean up file and memory
function cleanupFile(code, filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file ${filePath}:`, err);
    } else {
      console.log(`Deleted file: ${filePath}`);
    }
  });
  delete fileMap[code];
  console.log(`Removed code ${code} from memory`);
}

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const code = generateCode();
  const filePath = req.file.path;
  const originalName = req.file.originalname;

  // Store in memory
  fileMap[code] = {
    path: filePath,
    originalName: originalName,
    uploadedAt: Date.now()
  };

  console.log(`File uploaded with code: ${code}, path: ${filePath}`);

  // Set timeout to delete after 2 minutes (120000 ms)
  setTimeout(() => {
    cleanupFile(code, filePath);
  }, 120000);

  res.json({ code, originalName });
});

// Download endpoint via code
app.get('/:code', (req, res) => {
  const code = req.params.code;
  
  // Check if code exists
  if (!fileMap[code]) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Code Expired</title>
        <style>
          body {
            background: #0a0a0a;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <h1>Code Expired or Invalid</h1>
      </body>
      </html>
    `);
  }

  const fileInfo = fileMap[code];
  const filePath = fileInfo.path;

  // Check if file still exists on disk
  if (!fs.existsSync(filePath)) {
    delete fileMap[code];
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Code Expired</title>
        <style>
          body {
            background: #0a0a0a;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <h1>Code Expired or Invalid</h1>
      </body>
      </html>
    `);
  }

  // Trigger file download
  res.download(filePath, fileInfo.originalName, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).json({ error: 'Download failed' });
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeCodes: Object.keys(fileMap) });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
