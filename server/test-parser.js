const DeterministicParser = require("./deterministic-parser");

async function test() {
    const file = process.argv[2] || "uploads/1773309995331-AGENDA CNDES-9-3-26.pdf";
    try {
        console.log("Testing deterministic parser with:", file);
        const results = await DeterministicParser.processDocument(file);
        console.log("=== RESULTS ===");
        console.log(JSON.stringify(results, null, 2));
    } catch (e) {
        console.error("Test failed:", e);
    }
}
test();
