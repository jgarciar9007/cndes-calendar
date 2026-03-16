const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const helmet = require('helmet');
const compression = require('compression');
const crypto = require('crypto');
const db = require('./db'); // Import DB module

const app = express();
const PORT = process.env.PORT || 3001;

// Polyfill/Fallback for crypto.randomUUID
const safeUUID = () => {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Middleware
// Middleware de seguridad relajado para acceso por IP local
app.use(compression());
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    originAgentCluster: false
}));
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve Static Files
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
fs.ensureDirSync(path.join(__dirname, 'uploads'));

// Initialize Database
// Initialize Database
db.init().catch(err => {
    console.error("Database initialization failed:", err);
});

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
app.get('/api/events', async (req, res) => {
    try {
        const events = await db.events.getAll();
        res.json(events);
    } catch (error) {
        console.error("Error reading events:", error);
        res.status(500).json({ error: 'Failed to read events' });
    }
});

app.post('/api/events', async (req, res) => {
    try {
        await db.events.replaceAll(req.body);
        res.json({ success: true });
    } catch (error) {
        console.error("Error saving events:", error);
        res.status(500).json({ error: 'Failed to save events' });
    }
});

// LOCATIONS
app.get('/api/locations', async (req, res) => {
    try {
        const data = await db.locations.getAll();
        res.json(data);
    } catch (error) {
        console.error("Error reading locations:", error);
        res.status(500).json({ error: 'Failed to read locations' });
    }
});

app.post('/api/locations', async (req, res) => {
    try {
        await db.locations.replaceAll(req.body);
        res.json({ success: true });
    } catch (error) {
        console.error("Error saving locations:", error);
        res.status(500).json({ error: 'Failed to save locations' });
    }
});

// PARTICIPANTS
app.get('/api/participants', async (req, res) => {
    try {
        const data = await db.participants.getAll();
        res.json(data);
    } catch (error) {
        console.error("Error reading participants:", error);
        res.status(500).json({ error: 'Failed to read participants' });
    }
});

app.post('/api/participants', async (req, res) => {
    try {
        await db.participants.replaceAll(req.body);
        res.json({ success: true });
    } catch (error) {
        console.error("Error saving participants:", error);
        res.status(500).json({ error: 'Failed to save participants' });
    }
});

// AUTH
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.users.getByUsername(username);

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

app.post('/api/auth/change-password', async (req, res) => {
    try {
        const { username, currentPassword, newPassword } = req.body;

        if (!username || !currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const user = await db.users.getByUsername(username);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        if (user.password !== currentPassword) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
        }

        const success = await db.users.updatePassword(user.id, newPassword);
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

const aiService = require('./ai.service');

// FILE UPLOAD & AI PROCESSING
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
        id: safeUUID(),
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        data: fileUrl,
        path: req.file.path // Relative path for server-side processing
    });
});

app.post('/api/ai/process-document', async (req, res) => {
    try {
        const { filePath, mimeType } = req.body;
        if (!filePath) {
            return res.status(400).json({ error: 'Missing filePath' });
        }

        // Security & Resolution: Ensure filePath is within the uploads directory
        // Handle both relative paths, absolute paths and URLs (/uploads/...)
        const uploadsDir = path.join(__dirname, 'uploads');
        let relativePath = filePath;
        
        if (filePath.includes('uploads')) {
            // Strip everything before 'uploads' to get a relative path we can trust
            const parts = filePath.split(path.sep === '/' ? '/' : /[\\\/]/);
            const uploadsIndex = parts.indexOf('uploads');
            if (uploadsIndex !== -1) {
                relativePath = parts.slice(uploadsIndex + 1).join(path.sep);
            }
        } else {
            relativePath = path.basename(filePath);
        }

        const absolutePath = path.join(uploadsDir, relativePath);

        if (!absolutePath.startsWith(uploadsDir)) {
            console.error("Access denied to path:", absolutePath, "Uploads dir:", uploadsDir);
            return res.status(403).json({ error: 'Access denied' });
        }

        if (!fs.existsSync(absolutePath)) {
            console.error("File not found for AI processing:", absolutePath);
            return res.status(404).json({ error: 'File not found' });
        }

        const activities = await aiService.processDocument(absolutePath, mimeType);
        res.json(activities);
    } catch (error) {
        console.error("AI Processing error:", error);
        res.status(500).json({ 
            error: error.message || 'Error interno al procesar el documento.',
            details: error.toString()
        });
    }
});

app.post('/api/ai/query', async (req, res) => {
    try {
        const { question } = req.body;
        console.log(`[LectorAPI] Received question: "${question}"`);
        if (!question) {
            return res.status(400).json({ error: 'Falta la pregunta del usuario.' });
        }

        const answer = await aiService.askLector(question);
        console.log(`[LectorAPI] Sending answer preview: "${answer.substring(0, 50)}..."`);
        res.json({ answer });
    } catch (error) {
        console.error("Lector Assistant Error:", error);
        res.status(500).json({ 
            error: error.message || 'Error interno en el Asistente Lector.',
            details: error.toString()
        });
    }
});

// SPA Fallback
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
