const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

async function checkLector() {
    console.log("--- Checking Lector User ---");
    const lectorPool = new Pool({
        host: process.env.LECTOR_HOST || process.env.DB_HOST,
        user: process.env.LECTOR_USER,
        password: process.env.LECTOR_PASSWORD,
        database: process.env.LECTOR_DB || process.env.DB_NAME,
        port: process.env.DB_PORT || 5432
    });

    try {
        const res = await lectorPool.query('SELECT count(*) FROM events');
        console.log('Events Count:', res.rows[0].count);
        
        const sample = await lectorPool.query('SELECT * FROM events LIMIT 2');
        console.log('Sample Events:', JSON.stringify(sample.rows, null, 2));
    } catch (err) {
        console.error('Lector check FAILED:', err.message);
    } finally {
        await lectorPool.end();
    }
}

checkLector();
