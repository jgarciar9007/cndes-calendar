require('dotenv').config();
const { Pool } = require('pg');

async function cleanup() {
    console.log('Connecting to database...');
    const pool = new Pool({
        host: process.env.DB_HOST || '192.168.20.3',
        user: process.env.DB_USER || 'cndes',
        password: process.env.DB_PASSWORD || 'PGCndes2026*',
        database: process.env.DB_NAME || 'calendar_db',
        port: process.env.DB_PORT || 5432,
    });

    const client = await pool.connect();
    try {
        console.log('Cleaning tables: events, locations, participants...');
        await client.query('DELETE FROM events');
        await client.query('DELETE FROM locations');
        await client.query('DELETE FROM participants');
        
        console.log('Resetting admin user...');
        await client.query('DELETE FROM users');
        await client.query('INSERT INTO users (id, username, password, name, role) VALUES ($1, $2, $3, $4, $5)',
            ['usr-admin', 'admin', 'Cndes2026*', 'Administrador', 'admin']);
        
        console.log('Database cleanup and admin reset successful.');
    } catch (err) {
        console.error('Cleanup failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

cleanup();
