const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionTimeoutMillis: 5000
});

async function test() {
    console.log(`Connecting to ${process.env.DB_HOST}...`);
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connection SUCCESSFUL:', res.rows[0]);
    } catch (err) {
        console.error('Connection FAILED:', err.message);
    } finally {
        await pool.end();
    }
}

test();
