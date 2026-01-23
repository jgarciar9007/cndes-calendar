const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const helmet = require('helmet');
const compression = require('compression');
const seedData = require('./seedData');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(compression()); // Compress all responses
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'"]
        }
    }
}));
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support large payloads if needed

// Serve Static Files (The React App)
app.use(express.static(path.join(__dirname, '../dist')));

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Data Persistence
const DATA_DIR = path.join(__dirname, 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const LOCATIONS_FILE = path.join(DATA_DIR, 'locations.json');
const PARTICIPANTS_FILE = path.join(DATA_DIR, 'participants.json');

// Ensure directories exist
fs.ensureDirSync(DATA_DIR);
fs.ensureDirSync(path.join(__dirname, 'uploads'));

// Initialize Data if not exists
const initializeData = () => {
    if (!fs.existsSync(EVENTS_FILE)) {
        console.log('Initializing events database...');
        fs.writeJsonSync(EVENTS_FILE, seedData.initialEvents, { spaces: 2 });
    }
    if (!fs.existsSync(LOCATIONS_FILE)) {
        console.log('Initializing locations database...');
        fs.writeJsonSync(LOCATIONS_FILE, seedData.initialLocations, { spaces: 2 });
    }
    if (!fs.existsSync(PARTICIPANTS_FILE)) {
        console.log('Initializing participants database...');
        fs.writeJsonSync(PARTICIPANTS_FILE, seedData.initialParticipants, { spaces: 2 });
    }
};

initializeData();

// Multer Storage Configuration (for File Uploads)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'))
    },
    filename: function (req, file, cb) {
        // Use original name but ensure uniqueness if needed.
        // For simplicity and user request "files in root", we keep original names if possible?
        // But collisions are bad. Let's use [timestamp]-[originalname]
        // This keeps it readable but unique.
        const uniquePrefix = Date.now() + '-';
        cb(null, uniquePrefix + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- API Routes ---

// EVENTS
app.get('/api/events', (req, res) => {
    try {
        // Read fresh every time to avoid stale cache issues in basic implementation
        const events = fs.readJsonSync(EVENTS_FILE);
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read events' });
    }
});

app.post('/api/events', (req, res) => {
    try {
        fs.writeJsonSync(EVENTS_FILE, req.body, { spaces: 2 });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save events' });
    }
});

// LOCATIONS
app.get('/api/locations', (req, res) => {
    try {
        const data = fs.readJsonSync(LOCATIONS_FILE);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read locations' });
    }
});

app.post('/api/locations', (req, res) => {
    try {
        fs.writeJsonSync(LOCATIONS_FILE, req.body, { spaces: 2 });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save locations' });
    }
});

// PARTICIPANTS
app.get('/api/participants', (req, res) => {
    try {
        const data = fs.readJsonSync(PARTICIPANTS_FILE);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read participants' });
    }
});

app.post('/api/participants', (req, res) => {
    try {
        fs.writeJsonSync(PARTICIPANTS_FILE, req.body, { spaces: 2 });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save participants' });
    }
});

// FILE UPLOAD
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct the public URL
    // Assuming the app is accessed via / (root) or proper relative path handling
    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
        id: crypto.randomUUID(),
        name: req.file.originalname, // Original readable name
        size: req.file.size,
        type: req.file.mimetype,
        data: fileUrl // We store the URL in the 'data' field to match existing frontend structure partially
    });
});

// SPA Fallback (Must be last)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Data directory: ${DATA_DIR}`);
    console.log(`Uploads directory: ${path.join(__dirname, 'uploads')}`);
});
