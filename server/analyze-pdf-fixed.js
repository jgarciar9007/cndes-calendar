const fs = require('fs');
const pdf = require('node-polyglot'); // Not this one.
// Let's try to just use another library if pdf-parse is weird.
// Wait, I'll try to find where pdf-parse is.
const pdf_parse = require('pdf-parse');
console.log("Exported keys:", Object.keys(pdf_parse));

async function run() {
    const dataBuffer = fs.readFileSync(process.argv[2]);
    // Try if it's a default export
    let parseFunc = (typeof pdf_parse === 'function') ? pdf_parse : pdf_parse.default;
    if (!parseFunc && typeof pdf_parse === 'object') {
       // Sometimes it's exported as a property? No, usually not.
    }
    
    try {
        const data = await parseFunc(dataBuffer);
        console.log("TEXT:\n", data.text);
    } catch(e) {
        console.error("Fail:", e);
    }
}
run();
