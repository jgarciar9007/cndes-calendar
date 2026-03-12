const PDFParser = require("pdf2json");

const pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    console.log("=== PDF DATA READY ===");
    const pages = pdfData.Pages;
    pages.forEach((page, pageIdx) => {
        console.log(`--- Page ${pageIdx + 1} ---`);
        const texts = page.Texts;
        // Collect text items with their coordinates
        const items = texts.map(t => ({
            x: t.x,
            y: t.y,
            text: decodeURIComponent(t.R[0].T)
        }));
        
        // Sort by Y then X
        items.sort((a, b) => (a.y - b.y) || (a.x - b.x));
        
        items.forEach(item => {
            console.log(`[x:${item.x.toFixed(2)}, y:${item.y.toFixed(2)}] ${item.text}`);
        });
    });
});

const filePath = process.argv[2] || "uploads/1773309852871-AGENDA CNDES-3-3-26.pdf";
pdfParser.loadPDF(filePath);
