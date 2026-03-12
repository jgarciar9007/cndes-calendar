const fs = require('fs');
const pdf = require('pdf-parse');

async function extractText(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error("File does not exist:", filePath);
        return;
    }
    let dataBuffer = fs.readFileSync(filePath);
    try {
        const data = await pdf(dataBuffer);
        console.log("--- TEXT CONTENT START ---");
        console.log(data.text);
        console.log("--- TEXT CONTENT END ---");
    } catch (err) {
        console.error("Error parsing PDF:", err);
    }
}

const filePath = process.argv[2];
if (filePath) {
    extractText(filePath);
} else {
    console.log("Please provide a file path.");
}
