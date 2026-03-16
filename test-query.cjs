const fetch = require('node-fetch');

async function testQuery() {
    try {
        const response = await fetch('http://localhost:3001/api/ai/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: 'hola' })
        });
        const data = await response.json();
        console.log('Query: hola');
        console.log('Answer:', data.answer);

        const response2 = await fetch('http://localhost:3001/api/ai/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: '¿Qué hay hoy?' })
        });
        const data2 = await response2.json();
        console.log('\nQuery: ¿Qué hay hoy?');
        console.log('Answer:', data2.answer);
    } catch (err) {
        console.error('Test failed:', err.message);
    }
}

testQuery();
