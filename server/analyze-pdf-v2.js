const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extractText(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error("File does not exist:", filePath);
        return;
    }
    const dataBuffer = fs.readFileSync(filePath);
    try {
        const parser = new PDFParse();
        const data = await parser.parse(dataBuffer);
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
