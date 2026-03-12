const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extract() {
    try {
        const dataBuffer = fs.readFileSync('uploads/1773309852871-AGENDA CNDES-3-3-26.pdf');
        const parser = new PDFParse();
        const data = await parser.parse(dataBuffer);
        
        console.log("=== METADATA ===");
        console.log(JSON.stringify(data.metadata, null, 2));
        
        console.log("=== START TEXT ===");
        console.log(data.text);
        console.log("=== END TEXT ===");
        
        if (data.pages && data.pages.length > 0) {
            console.log("=== FIRST PAGE TABLES? ===");
            // Some parsers extract tables specifically
            console.log(JSON.stringify(data.pages[0].tables || "No tables key", null, 2));
        }

    } catch (e) {
        console.log("Error details:", e);
        if (e.stack) console.log(e.stack);
    }
}
extract();
