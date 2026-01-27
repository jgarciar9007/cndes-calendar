const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs-extra');

const DB_PATH = path.join(__dirname, 'database.sqlite');
const DATA_DIR = path.join(__dirname, 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const LOCATIONS_FILE = path.join(DATA_DIR, 'locations.json');
const PARTICIPANTS_FILE = path.join(DATA_DIR, 'participants.json');

const db = new Database(DB_PATH); // verbose: console.log

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

function init() {
    // Create tables
    db.prepare(`
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            title TEXT,
            start TEXT,
            end TEXT,
            location TEXT,
            description TEXT,
            participants TEXT,
            attachments TEXT
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS locations (
            name TEXT PRIMARY KEY
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS participants (
            name TEXT PRIMARY KEY
        )
    `).run();

    // Check if empty and migrate
    const eventCount = db.prepare('SELECT count(*) as count FROM events').get();
    if (eventCount.count === 0 && fs.existsSync(EVENTS_FILE)) {
        console.log('Migrating events from JSON to SQLite...');
        const events = fs.readJsonSync(EVENTS_FILE);
        const insert = db.prepare(`
            INSERT INTO events (id, title, start, end, location, description, participants, attachments)
            VALUES (@id, @title, @start, @end, @location, @description, @participants, @attachments)
        `);
        const insertMany = db.transaction((events) => {
            for (const event of events) {
                insert.run({
                    id: event.id,
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    location: event.location,
                    description: event.description || '',
                    participants: JSON.stringify(event.participants || []),
                    attachments: JSON.stringify(event.attachments || [])
                });
            }
        });
        insertMany(events);
        console.log(`Migrated ${events.length} events.`);
    }

    const locCount = db.prepare('SELECT count(*) as count FROM locations').get();
    if (locCount.count === 0 && fs.existsSync(LOCATIONS_FILE)) {
        console.log('Migrating locations from JSON to SQLite...');
        const locations = fs.readJsonSync(LOCATIONS_FILE);
        const insert = db.prepare('INSERT OR IGNORE INTO locations (name) VALUES (?)');
        const insertMany = db.transaction((locs) => {
            for (const loc of locs) insert.run(loc);
        });
        insertMany(locations);
        console.log(`Migrated ${locations.length} locations.`);
    }

    const partCount = db.prepare('SELECT count(*) as count FROM participants').get();
    if (partCount.count === 0 && fs.existsSync(PARTICIPANTS_FILE)) {
        console.log('Migrating participants from JSON to SQLite...');
        const participants = fs.readJsonSync(PARTICIPANTS_FILE);
        const insert = db.prepare('INSERT OR IGNORE INTO participants (name) VALUES (?)');
        const insertMany = db.transaction((parts) => {
            for (const part of parts) insert.run(part);
        });
        insertMany(participants);
        console.log(`Migrated ${participants.length} participants.`);
    }
}

// Data Access Object

const eventQueries = {
    getAll: () => {
        const rows = db.prepare('SELECT * FROM events').all();
        return rows.map(row => ({
            ...row,
            participants: JSON.parse(row.participants),
            attachments: JSON.parse(row.attachments)
        }));
    },
    replaceAll: (events) => {
        const deleteStmt = db.prepare('DELETE FROM events');
        const insertStmt = db.prepare(`
            INSERT INTO events (id, title, start, end, location, description, participants, attachments)
            VALUES (@id, @title, @start, @end, @location, @description, @participants, @attachments)
        `);

        const transaction = db.transaction((events) => {
            deleteStmt.run();
            for (const event of events) {
                insertStmt.run({
                    id: event.id,
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    location: event.location,
                    description: event.description || '',
                    participants: JSON.stringify(event.participants || []),
                    attachments: JSON.stringify(event.attachments || [])
                });
            }
        });
        transaction(events);
    }
};

const locationQueries = {
    getAll: () => {
        return db.prepare('SELECT name FROM locations').all().map(r => r.name);
    },
    replaceAll: (locations) => {
        const transaction = db.transaction((locs) => {
            db.prepare('DELETE FROM locations').run();
            const insert = db.prepare('INSERT INTO locations (name) VALUES (?)');
            for (const loc of locs) insert.run(loc);
        });
        transaction(locations);
    }
};

const participantQueries = {
    getAll: () => {
        return db.prepare('SELECT name FROM participants').all().map(r => r.name);
    },
    replaceAll: (participants) => {
        const transaction = db.transaction((parts) => {
            db.prepare('DELETE FROM participants').run();
            const insert = db.prepare('INSERT INTO participants (name) VALUES (?)');
            for (const part of parts) insert.run(part);
        });
        transaction(participants);
    }
};

module.exports = {
    init,
    events: eventQueries,
    locations: locationQueries,
    participants: participantQueries
};
