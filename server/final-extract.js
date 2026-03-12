const fs = require('fs');
const pdf = require('pdf-parse');

async function extract() {
    try {
        const dataBuffer = fs.readFileSync('uploads/1773309852871-AGENDA CNDES-3-3-26.pdf');
        // pdf-parse is usually just the function itself
        const data = await pdf(dataBuffer);
        console.log("=== START TEXT ===");
        console.log(data.text);
        console.log("=== END TEXT ===");
    } catch (e) {
        console.log("Error:", e);
    }
}
extract();
