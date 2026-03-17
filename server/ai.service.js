const fs = require("fs");
const fetch = require("node-fetch");
const pdf = require("pdf-parse");

/**
 * AI Service V9 (RESILIENCE MAX)
 */
class AIService {
    constructor() {
        this.openRouterKey = (process.env.OPENROUTER_API_KEY || "").trim();
        this.geminiKey = (process.env.GEMINI_API_KEY || "").trim();
        
        // Use very generic model IDs that OpenRouter usually routes correctly
        this.modelWaterfall = [
            "openrouter/auto",                // Let OpenRouter decide (Best for reliability)
            "google/gemini-2.0-flash-lite:free",
            "meta-llama/llama-3.3-70b-instruct:free",
            "google/gemma-3-27b-it:free",
            "mistralai/mistral-7b-instruct:free",
            "openrouter/free"                 // Any free model
        ];
        
        console.log("[AIService] Resilience Max initialized.");
    }

    async processDocument(filePath, mimeType) {
        console.log(`[AIService] Doc: ${filePath}`);
        try {
            let documentText = "";
            if (mimeType === "application/pdf") {
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdf(dataBuffer);
                documentText = data.text;
            } else {
                documentText = fs.readFileSync(filePath, "utf8");
            }

            if (!documentText || documentText.trim().length < 5) {
                throw new Error("No text in document.");
            }

            const cleanText = documentText.split('\n').filter(l => l.trim().length > 0).join(' | ');
            const prompt = `System: You are an agentic CNDES analyst. Extract data as JSON.
User: Content below is from a PDF agenda. Extract an array of objects [ { title, date, startTime, endTime, location, description, participants[] } ].
- date format: YYYY-MM-DD
- time format: HH:mm
- participants: array of strings

Content:
${cleanText.substring(0, 15000)}`;

            // 1. OpenRouter with exhaustive waterfall
            for (const model of this.modelWaterfall) {
                try {
                    console.log(`[AIService] OR Try: ${model}`);
                    const content = await this.callOpenRouter(prompt, model);
                    if (content) return this.parseJSON(content);
                } catch (err) {
                    console.warn(`[AIService] ${model} failed: ${err.message}`);
                    await new Promise(r => setTimeout(r, 1000));
                }
            }

            // 2. Direct Gemini Fallback - Fixing the URL and model
            if (this.geminiKey) {
                try {
                    console.log("[AIService] Trying Direct Gemini (gemini-1.5-flash)...");
                    const content = await this.callDirectGemini(prompt, "gemini-1.5-flash");
                    return this.parseJSON(content);
                } catch (err) {
                    console.error("[AIService] Direct Gemini failed:", err.message);
                }
            }

            throw new Error("Saturación total. Prueba de nuevo en 1 min.");

        } catch (error) {
            console.error("[AIService] Global Error:", error);
            throw error;
        }
    }

    async callOpenRouter(prompt, model) {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.openRouterKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://cndes-calendar.local",
                "X-Title": "CNDES Assistant"
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.1
            })
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error?.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content || "";
    }

    async callDirectGemini(prompt, model) {
        // v1beta is correct for flash
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiKey}`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.1 }
            })
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Gemini Error: ${res.status} - ${err.substring(0, 100)}`);
        }

        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    parseJSON(text) {
        try {
            const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(clean);
            if (Array.isArray(parsed)) return parsed;
            if (parsed.events) return parsed.events;
            if (parsed.activities) return parsed.activities;
            return [parsed];
        } catch (e) {
            const match = text.match(/\[[\s\S]*\]/);
            if (match) return JSON.parse(match[0]);
            throw new Error("Invalid JSON");
        }
    }

    async askLector(question) {
        try {
            const db = require('./db');
            if (question.toLowerCase().match(/^(hola|saludos|buenos)/)) return "¡Hola! Soy tu asistente CNDES.";

            const sqlPrompt = `Genera SQL SELECT para: "${question}". Tablas: events, locations. Responde solo el SQL.`;
            const sqlRaw = await this.callOpenRouter(sqlPrompt, "openrouter/auto");
            const sql = sqlRaw.replace(/```sql/gi, "").replace(/```/g, "").trim();
            
            if (!sql.toUpperCase().includes('SELECT')) return "No pude procesar la consulta.";

            const results = await db.queryAsLector(sql);
            const interpretPrompt = `Responde a "${question}" usando: ${JSON.stringify(results.slice(0, 10))}. NO menciones SQL.`;
            return await this.callOpenRouter(interpretPrompt, "openrouter/auto");
        } catch (err) {
            return "No hay datos para esa consulta.";
        }
    }
}

module.exports = new AIService();
