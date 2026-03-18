const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

async function checkEvents() {
    try {
        const res = await pool.query("SELECT * FROM events WHERE start LIKE '2026-03-17%'");
        console.log(`Found ${res.rows.length} events for 2026-03-17:`);
        res.rows.forEach(row => {
            console.log(`- ${row.title} at ${row.start}`);
        });
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkEvents();
