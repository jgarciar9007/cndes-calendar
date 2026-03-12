const PDFParser = require("pdf2json");

class DeterministicParser {
    static async processDocument(filePath) {
        console.log(`[DeterministicParser] Loading PDF: ${filePath}`);
        return new Promise((resolve, reject) => {
            const pdfParser = new PDFParser();

            pdfParser.on("pdfParser_dataError", errData => {
                console.error("[DeterministicParser] PDF Parser Error:", errData.parserError);
                reject(new Error(errData.parserError));
            });
            
            pdfParser.on("pdfParser_dataReady", pdfData => {
                try {
                    console.log("[DeterministicParser] PDF data ready, starting extraction...");
                    const activities = this.parsePdfData(pdfData);
                    console.log(`[DeterministicParser] Extraction complete. Found ${activities.length} rows/activities.`);
                    resolve(activities);
                } catch (e) {
                    console.error("[DeterministicParser] Error during parsing:", e);
                    reject(e);
                }
            });

            pdfParser.loadPDF(filePath);
        });
    }

    static parsePdfData(pdfData) {
        const activities = [];
        let currentDate = "";

        // Common X-coordinate ranges for columns in CNDES Agenda format
        const COLUMNS = {
            ORDER: { min: 0, max: 4.5 },
            TIME: { min: 4.6, max: 9.5 },
            LOCATION: { min: 9.6, max: 17.5 },
            SUBJECT: { min: 17.6, max: 36 },
            PARTICIPANTS: { min: 36.1, max: 100 }
        };

        const pages = pdfData.Pages;
        if (!pages || pages.length === 0) {
            console.warn("[DeterministicParser] PDF has no pages.");
            return [];
        }
        
        // 1. Extract potential date from the first page
        const firstPageText = pages[0].Texts.map(t => decodeURIComponent(t.R[0].T)).join(" ").replace(/\s+/g, " ");
        currentDate = this.extractDate(firstPageText);
        console.log(`[DeterministicParser] Document Date detected: ${currentDate}`);

        pages.forEach((page, pageIdx) => {
            const items = page.Texts.map(t => ({
                x: t.x,
                y: t.y,
                text: decodeURIComponent(t.R[0].T).trim()
            })).filter(item => item.text.length > 0);

            // Group by Y coordinate (rows) with tolerance
            const rows = [];
            items.forEach(item => {
                let row = rows.find(r => Math.abs(r.y - item.y) < 0.35); // Slightly tighter tolerance
                if (!row) {
                    row = { y: item.y, texts: [] };
                    rows.push(row);
                }
                row.texts.push(item);
            });

            rows.sort((a, b) => a.y - b.y);

            let currentActivity = null;

            rows.forEach(row => {
                // Determine if this row starts a new activity (has number in first column)
                // Also look for time as a secondary signal if order is missing
                const hasOrder = row.texts.some(t => t.x >= COLUMNS.ORDER.min && t.x <= COLUMNS.ORDER.max && /^\d+$/.test(t.text));
                const hasTime = row.texts.some(t => t.x >= COLUMNS.TIME.min && t.x <= COLUMNS.TIME.max && /\d{1,2}:\d{2}/.test(t.text));
                
                if (hasOrder || (hasTime && !currentActivity)) {
                    if (currentActivity) {
                        activities.push(this.finalizeActivity(currentActivity, currentDate));
                    }
                    
                    currentActivity = {
                        title: "",
                        startTime: "",
                        endTime: "",
                        location: "",
                        description: "",
                        participants: []
                    };
                }

                if (!currentActivity) return;

                row.texts.sort((a, b) => a.x - b.x);

                row.texts.forEach(t => {
                    if (t.x >= COLUMNS.TIME.min && t.x <= COLUMNS.TIME.max) {
                        currentActivity.startTime += t.text;
                    } else if (t.x >= COLUMNS.LOCATION.min && t.x <= COLUMNS.LOCATION.max) {
                        currentActivity.location += (currentActivity.location ? " " : "") + t.text;
                    } else if (t.x >= COLUMNS.SUBJECT.min && t.x <= COLUMNS.SUBJECT.max) {
                        currentActivity.title += (currentActivity.title ? " " : "") + t.text;
                    } else if (t.x >= COLUMNS.PARTICIPANTS.min && t.x <= COLUMNS.PARTICIPANTS.max) {
                        const cleanPart = t.text.replace(/^[•\-\s]+/, "").trim();
                        if (cleanPart) {
                            currentActivity.participants.push({ text: cleanPart, y: row.y });
                        }
                    }
                });
            });

            if (currentActivity) {
                activities.push(this.finalizeActivity(currentActivity, currentDate));
            }
        });

        return activities;
    }

    static extractDate(text) {
        const months = {
            "enero": "01", "febrero": "02", "marzo": "03", "abril": "04",
            "mayo": "05", "junio": "06", "julio": "07", "agosto": "08",
            "septiembre": "09", "octubre": "10", "noviembre": "11", "diciembre": "12"
        };
        
        const clean = text.toLowerCase().replace(/\s+/g, " ");
        // Match: 05 de Marzo de 2026 or similar
        const match = clean.match(/(\d{1,2})\s*de\s*(\w+)\s*(?:de\s*)?(\d{4})/);
        if (match) {
            const day = match[1].padStart(2, "0");
            const monthName = match[2];
            const month = months[monthName] || "01";
            const year = match[3];
            return `${year}-${month}-${day}`;
        }
        
        // Fallback search for YYYY-MM-DD
        const isoMatch = text.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) return isoMatch[0];

        // Return today if nothing found
        return new Date().toISOString().split("T")[0];
    }

    static finalizeActivity(activity, date) {
        // Clean times
        activity.startTime = activity.startTime.replace(/[^\d:]/g, "");
        if (activity.startTime.length === 4 && !activity.startTime.includes(":")) {
            activity.startTime = activity.startTime.slice(0, 2) + ":" + activity.startTime.slice(2);
        }
        
        // Handle time ranges if found in same field (e.g. "09:00-10:00")
        if (activity.startTime.includes("-")) {
            const parts = activity.startTime.split("-");
            activity.startTime = parts[0];
            activity.endTime = parts[1];
        }

        // Merge participant lines based on Y proximity
        const mergedParticipants = [];
        let currentP = "";
        let lastY = -1;

        activity.participants.forEach(p => {
            if (lastY === -1 || Math.abs(p.y - lastY) < 0.6) {
                currentP += (currentP ? " " : " ") + p.text;
            } else {
                if (currentP.trim()) mergedParticipants.push(this.cleanName(currentP));
                currentP = p.text;
            }
            lastY = p.y;
        });
        if (currentP.trim()) mergedParticipants.push(this.cleanName(currentP));

        // Use title as description if it's long, or for context
        if (activity.title.length > 120) {
            activity.description = activity.title;
            activity.title = activity.title.substring(0, 117) + "...";
        }

        // Default end time estimation
        if (!activity.endTime && activity.startTime.includes(":")) {
            const [h, m] = activity.startTime.split(":").map(Number);
            if (!isNaN(h)) {
                activity.endTime = `${String(h + 1).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;
            }
        }

        return {
            ...activity,
            date: date || new Date().toISOString().split("T")[0],
            participants: mergedParticipants.filter(p => p.length > 2)
        };
    }

    static cleanName(name) {
        return name.replace(/\s+/g, " ").trim();
    }
}

module.exports = DeterministicParser;
