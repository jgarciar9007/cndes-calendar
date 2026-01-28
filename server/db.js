const { Pool } = require('pg');

const pool = new Pool({
    host: '192.168.20.3',
    user: 'cndes',
    password: 'PGCndes2026*',
    database: 'calendar_db',
    port: 5432,
    max: 20
});

async function init() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS events (
                id TEXT PRIMARY KEY,
                title TEXT,
                "start" TEXT,
                "end" TEXT,
                location TEXT,
                description TEXT,
                participants TEXT,
                attachments TEXT
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT UNIQUE,
                password TEXT,
                name TEXT,
                role TEXT
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS locations (
                name TEXT PRIMARY KEY
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS participants (
                name TEXT PRIMARY KEY
            );
        `);

        // Ensure default admin exists if users table is empty
        const res = await client.query('SELECT count(*) FROM users');
        if (parseInt(res.rows[0].count) === 0) {
            console.log('Initializing default admin user...');
            await client.query('INSERT INTO users (id, username, password, name, role) VALUES ($1, $2, $3, $4, $5)',
                ['usr-admin', 'admin', 'admin123', 'Administrador', 'admin']);
        }

    } catch (err) {
        console.error("Error initializing database tables:", err);
    } finally {
        client.release();
    }
}

const userQueries = {
    getByUsername: async (username) => {
        const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return res.rows[0];
    },
    updatePassword: async (id, newPassword) => {
        const res = await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newPassword, id]);
        return res.rowCount > 0;
    }
};

const eventQueries = {
    getAll: async () => {
        const res = await pool.query('SELECT * FROM events');
        return res.rows.map(row => ({
            ...row,
            start: row.start,
            end: row.end,
            participants: JSON.parse(row.participants || '[]'),
            attachments: JSON.parse(row.attachments || '[]')
        }));
    },
    replaceAll: async (events) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM events');
            const insertText = 'INSERT INTO events (id, title, "start", "end", location, description, participants, attachments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
            for (const event of events) {
                await client.query(insertText, [
                    event.id,
                    event.title,
                    event.start,
                    event.end,
                    event.location,
                    event.description || '',
                    JSON.stringify(event.participants || []),
                    JSON.stringify(event.attachments || [])
                ]);
            }
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }
};

const locationQueries = {
    getAll: async () => {
        const res = await pool.query('SELECT name FROM locations');
        return res.rows.map(r => r.name);
    },
    replaceAll: async (locations) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM locations');
            for (const loc of locations) {
                await client.query('INSERT INTO locations (name) VALUES ($1)', [loc]);
            }
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }
};

const participantQueries = {
    getAll: async () => {
        const res = await pool.query('SELECT name FROM participants');
        return res.rows.map(r => r.name);
    },
    replaceAll: async (participants) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM participants');
            for (const part of participants) {
                await client.query('INSERT INTO participants (name) VALUES ($1)', [part]);
            }
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }
};

module.exports = {
    init,
    events: eventQueries,
    locations: locationQueries,
    participants: participantQueries,
    users: userQueries
};
