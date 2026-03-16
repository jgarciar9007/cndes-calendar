const fs = require("fs");
const fetch = require("node-fetch");
const pdf = require("pdf-parse");

/**
 * AI Service V5 - Optimized for Local Extraction + Table Representation
 * "Enviamos la tabla a la IA y ella devuelve JSON"
 */
class AIService {
    constructor() {
        this.openRouterKey = (process.env.OPENROUTER_API_KEY || "").trim();
        
        // Waterfall with high-reliability free models
        this.modelWaterfall = [
            "google/gemini-2.0-flash-exp:free",
            "google/gemini-2.0-flash:free",
            "meta-llama/llama-3.3-70b-instruct:free",
            "google/gemma-2-9b-it:free",
            "mistralai/mistral-7b-instruct:free"
        ];
        
        console.log("[AIService] Waterfall initialized with key:", this.openRouterKey ? "PRESENT (ends in " + this.openRouterKey.slice(-4) + ")" : "MISSING");
    }

    async processDocument(filePath, mimeType) {
        console.log(`[AIService] Processing document: ${filePath}`);

        try {
            let documentText = "";
            
            // 1. Local Extraction (Pre-processing)
            if (mimeType === "application/pdf") {
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdf(dataBuffer);
                documentText = data.text;
            } else {
                documentText = fs.readFileSync(filePath, "utf8");
            }

            if (!documentText || documentText.trim().length < 10) {
                throw new Error("El documento está vacío o no se pudo extraer texto legible.");
            }

            // Clean text to look more like a "table" or structured content
            const cleanText = this.structureTextForAI(documentText);
            console.log(`[AIService] Structured text preview (100 chars): ${cleanText.substring(0, 100)}...`);

            // 2. IA Processing with Waterfall
            let lastError = null;
            for (const model of this.modelWaterfall) {
                try {
                    console.log(`[AIService] Sending data to model: ${model}`);
                    const result = await this.callAI(cleanText, model);
                    return result;
                } catch (err) {
                    lastError = err;
                    if (err.message.includes("429") || err.message.includes("400") || err.message.includes("404")) {
                        console.warn(`[AIService] Retryable error on ${model}. Next one...`);
                        await new Promise(r => setTimeout(r, 2000));
                        continue;
                    }
                    console.error(`[AIService] Fatal model error:`, err.message);
                    break;
                }
            }

            throw lastError || new Error("Error crítico en el motor de IA.");

        } catch (error) {
            console.error("[AIService] Global Error:", error);
            throw error;
        }
    }

    // Heurística para limpiar el texto y que parezca una tabla de actividades
    structureTextForAI(text) {
        return text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join(' | '); // Join with pipes to help LLMs see it as "tabular rows"
    }

    async callAI(cleanTableText, modelName) {
        if (!this.openRouterKey) throw new Error("API Key faltante (OPENROUTER_API_KEY)");

        // Prompt optimizado: "Te paso una tabla de texto, devuélveme el JSON"
        const prompt = `
        ANALISTA DE AGENDAS CNDES
        Detecta y extrae todas las actividades de la siguiente tabla de texto.
        
        REGLAS:
        - Debes devolver ÚNICAMENTE un array JSON válido.
        - Si no hay eventos, devuelve [].
        - Formato de fecha: YYYY-MM-DD.
        - Formato de hora: HH:mm.
        - IMPORTANTE HORA FIN: Si no se menciona la hora de fin, ESTIMALA de forma inteligente según el tipo de actividad (reuniones: 1h, discursos: 30min, galas: 2h, etc.). No la dejes vacía.
        - Campos requeridos: title, date, startTime, endTime, location, description, participants (array de nombres).

        TABLA DE DATOS DEL DOCUMENTO: 
        ---
        ${cleanTableText.substring(0, 15000)}
        ---
        
        RESPUESTA JSON:
        `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.openRouterKey}`,
                "HTTP-Referer": "https://cndes-calendar.local",
                "X-Title": "CNDES AI Extractor",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: modelName,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.1,
                response_format: { type: "json_object" } // Sugerencia de formato para modelos que lo soporten
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(`${err.error?.message || 'Error'} (Status: ${response.status})`);
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || "";
        
        return this.parseJSON(aiResponse);
    }

    parseJSON(text) {
        try {
            const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
            // Si la IA respondió un objeto con una propiedad que tiene el array, lo extraemos
            const parsed = JSON.parse(clean);
            if (Array.isArray(parsed)) return parsed;
            if (parsed.events && Array.isArray(parsed.events)) return parsed.events;
            if (parsed.activities && Array.isArray(parsed.activities)) return parsed.activities;
            return [parsed]; // Si es un solo objeto
        } catch (e) {
            console.error("[AIService] Error parseando JSON:", text);
            throw new Error("Formato de respuesta IA inválido.");
        }
    }
    async askLector(userQuestion) {
        if (!this.openRouterKey) throw new Error("API Key faltante (OPENROUTER_API_KEY)");

        const db = require('./db');
        
        // 0. Quick Greeting/Smalltalk check
        const lowers = userQuestion.toLowerCase().trim();
        const greetingRegex = /^(hola|buenos d.as|buenas tardes|buenas noches|saludos|hey|quien eres|que haces|como te va|como estas|quien eres)/i;
        if (greetingRegex.test(lowers)) {
            return "¡Hola! Soy el **Asistente de Agenda CNDES**. Estoy aquí para ayudarte a consultar información sobre las actividades planificadas, eventos y reuniones del CNDES. ¿En qué puedo ayudarte hoy?";
        }
        
        // Handle direct help questions
        if (lowers.includes("ayuda") || lowers.includes("que puedes hacer") || lowers.includes("funciona")) {
            return "Soy tu asistente para la **Agenda CNDES**. Puedes preguntarme cosas como:\n- *¿Qué reuniones hay hoy?*\n- *¿Cuándo es el próximo evento en la Sala de Plenos?*\n- *Lista las actividades de la próxima semana.*\n¡Estoy para ayudarte!";
        }

        // 1. Generate SQL
        const now = new Date().toISOString();
        const today = now.split('T')[0];
        
        const sqlPrompt = `
        Eres un generador de SQL experto para PostgreSQL enfocado en el sistema CNDES. 
        Tu objetivo es traducir la pregunta del usuario a una ÚNICA consulta SELECT válida.
        
        CONTEXTO ACTUAL:
        - Fecha/Hora (ISO): ${now}
        - Hoy es: ${today}

        TABLAS DISPONIBLES:
        - events (id, title, "start", "end", location, description, participants, attachments)
          Nota: "start" y "end" son strings ISO (ej: '2026-03-16T08:00:00.000Z').
          Nota: participants es un string que representa un array JSON (ej: '["Persona A", "Persona B"]').
        - locations (name)
        - participants (name)
        - users (id, username, name, role)

        REGLAS DE ORO:
        1. SOLO SELECT. Prohibido INSERT, UPDATE, DELETE.
        2. Búsquedas: Usa ILIKE con % (ej: title ILIKE '%reunión%').
        3. Fechas: Para buscar por día, usa LIKE '${today}%' o filtros sobre el string.
        4. Participantes: Como es JSON en string, usa: participants ILIKE '%nombre%'.
        5. Límite: Responde con el SQL puro, sin bloques markdown (\`\`\`).
        6. Estados especiales: 
           - Si es saludo: SELECT 'CONVERSATIONAL';
           - Si no hay datos: SELECT 'NOT_FOUND';

        PREGUNTA: "${userQuestion}"
        
        SQL:`;

        // 1. Generate SQL with Waterfall
        let generatedSQL = "";
        let sqlError = null;

        for (const model of this.modelWaterfall) {
            try {
                console.log(`[AIService] Generating SQL with model: ${model}`);
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${this.openRouterKey}`,
                        "HTTP-Referer": "https://cndes-calendar.local",
                        "X-Title": "CNDES AI Assistant",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [{ role: "user", content: sqlPrompt }],
                        temperature: 0.1
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`[AIService] OpenRouter Error (${response.status}) for ${model}:`, errorText);
                    throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 50)}`);
                }
                
                const data = await response.json();
                generatedSQL = data.choices?.[0]?.message?.content?.trim() || "";
                
                // Clean markdown blocks if any
                generatedSQL = generatedSQL.replace(/```sql/g, "").replace(/```/g, "").trim();
                
                if (generatedSQL) {
                    console.log(`[AIService] Generated SQL: ${generatedSQL}`);
                    break;
                }
            } catch (err) {
                console.warn(`[AIService] SQL generation failed with model ${model}: ${err.message}`);
                sqlError = err;
            }
        }

        if (!generatedSQL) {
            throw sqlError || new Error("No se pudo generar la consulta técnica.");
        }

        // 2. Execute SQL
        let results = [];
        try {
            if (generatedSQL.toUpperCase().includes('CONVERSATIONAL')) {
                return "¡Hola! Soy el **Asistente de Agenda CNDES**. Estoy listo para buscar cualquier actividad o evento que necesites consultar en el sistema. ¿Qué estás buscando?";
            } else if (generatedSQL.toUpperCase().includes('NOT_FOUND') || !generatedSQL.toUpperCase().includes('SELECT')) {
                results = [];
                console.log("[AIService] SQL Generator returned NOT_FOUND or invalid SELECT.");
                return "No se encontró registro de esa información en el sistema.";
            } else {
                results = await db.queryAsLector(generatedSQL);
            }
            console.log(`[AIService] DB returned ${results.length} rows.`);
            
            // Cap results to avoid blowing up the prompt (approx 10 events max)
            if (results.length > 20) {
                console.warn("[AIService] Results too large, capping to 20 for AI interpretation.");
                results = results.slice(0, 20);
            }
        } catch (err) {
            console.error("[AIService] SQL Execution Error:", err, "SQL:", generatedSQL);
            return `Lo siento, hubo un error técnico al consultar la base de datos. (Error: ${err.message})`;
        }

        // 3. Interpret Results with Waterfall
        const personaPrompt = `
        ROL: Eres el **Asistente de Agenda CNDES**. Tu propósito es ayudar a los usuarios con información sobre las actividades planificadas del CNDES.
        
        REGLAS CRÍTICAS DE RESPUESTA:
        1. Enfócate ÚNICAMENTE en proporcionar información clara sobre eventos, reuniones y actividades.
        2. NO menciones que realizas consultas a una base de datos PostgreSQL, SQL o términos técnicos del servidor.
        3. Si los datos están presentes, preséntalos de forma profesional y organizada.
        4. Si la lista de datos está vacía, responde EXACTAMENTE: "No se encontró registro de esa información en el sistema".
        5. Formato: Usa tablas de Markdown para listas de múltiples actividades.
        6. Sé directo y amable. No inventes detalles que no estén en los datos proporcionados.

        PREGUNTA DEL USUARIO: "${userQuestion}"
        DATOS DE ACTIVIDADES (JSON): ${JSON.stringify(results)}
        
        RESPUESTA PROFESIONAL:`;

        for (const model of this.modelWaterfall) {
            try {
                console.log(`[AIService] Interpreting results with model: ${model}`);
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${this.openRouterKey}`,
                        "HTTP-Referer": "https://cndes-calendar.local",
                        "X-Title": "CNDES AI Assistant",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [{ role: "user", content: personaPrompt }],
                        temperature: 0.3
                    })
                });

                if (!response.ok) {
                    const errBody = await response.text();
                    console.error(`[AIService] Interpretation Error (${response.status}) for ${model}:`, errBody);
                    throw new Error(`HTTP ${response.status}: ${errBody.substring(0, 50)}`);
                }

                const data = await response.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) return content;
            } catch (err) {
                console.error(`[AIService] Interpretation failed with model ${model}:`, err.message);
            }
        }

        return "Lo siento, el servicio de interpretación de datos no está disponible en este momento.";
    }
}

module.exports = new AIService();
