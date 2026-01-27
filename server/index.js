const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const helmet = require('helmet');
const compression = require('compression');
const crypto = require('crypto');
const db = require('./db'); // Import DB module

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(compression());
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
app.use(express.json({ limit: '50mb' }));

// Serve Static Files
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
fs.ensureDirSync(path.join(__dirname, 'uploads'));

// Initialize Database
try {
    db.init();
} catch (err) {
    console.error("Database initialization failed:", err);
}

// Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'))
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-';
        cb(null, uniquePrefix + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- API Routes ---

// EVENTS
app.get('/api/events', (req, res) => {
    try {
        const events = db.events.getAll();
        res.json(events);
    } catch (error) {
        console.error("Error reading events:", error);
        res.status(500).json({ error: 'Failed to read events' });
    }
});

app.post('/api/events', (req, res) => {
    try {
        db.events.replaceAll(req.body);
        res.json({ success: true });
    } catch (error) {
        console.error("Error saving events:", error);
        res.status(500).json({ error: 'Failed to save events' });
    }
});

// LOCATIONS
app.get('/api/locations', (req, res) => {
    try {
        const data = db.locations.getAll();
        res.json(data);
    } catch (error) {
        console.error("Error reading locations:", error);
        res.status(500).json({ error: 'Failed to read locations' });
    }
});

app.post('/api/locations', (req, res) => {
    try {
        db.locations.replaceAll(req.body);
        res.json({ success: true });
    } catch (error) {
        console.error("Error saving locations:", error);
        res.status(500).json({ error: 'Failed to save locations' });
    }
});

// PARTICIPANTS
app.get('/api/participants', (req, res) => {
    try {
        const data = db.participants.getAll();
        res.json(data);
    } catch (error) {
        console.error("Error reading participants:", error);
        res.status(500).json({ error: 'Failed to read participants' });
    }
});

app.post('/api/participants', (req, res) => {
    try {
        db.participants.replaceAll(req.body);
        res.json({ success: true });
    } catch (error) {
        console.error("Error saving participants:", error);
        res.status(500).json({ error: 'Failed to save participants' });
    }
});

// AUTH
app.post('/api/auth/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const user = db.users.getByUsername(username);

        if (user && user.password === password) {
            // In a real app, use hashing (bcrypt) and JWT tokens.
            // For now, returning user info matching current simple implementation.
            res.json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/auth/change-password', (req, res) => {
    try {
        const { username, currentPassword, newPassword } = req.body;

        if (!username || !currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const user = db.users.getByUsername(username);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        if (user.password !== currentPassword) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
        }

        const success = db.users.updatePassword(user.id, newPassword);
        if (success) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Failed to update password' });
        }
    } catch (error) {
        console.error("Password change error:", error);
        res.status(500).json({ error: 'Operation failed' });
    }
});

// FILE UPLOAD
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
        id: crypto.randomUUID(),
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        data: fileUrl
    });
});

// SPA Fallback
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database initialized.`);
});
