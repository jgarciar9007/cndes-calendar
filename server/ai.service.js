const fs = require("fs");
const fetch = require("node-fetch");
const pdf = require("pdf-parse");

/**
 * AI Service V5 - Optimized for Local Extraction + Table Representation
 * "Enviamos la tabla a la IA y ella devuelve JSON"
 */
class AIService {
    constructor() {
        this.openRouterKey = process.env.OPENROUTER_API_KEY || "";
        
        // Waterfall logic for maximum reliability with free models
        this.modelWaterfall = [
            "google/gemini-2.0-flash-exp:free",
            "meta-llama/llama-3.3-70b-instruct:free",
            "google/gemma-3-27b-it:free",
            "google/gemma-3-12b-it:free"
        ];
        
        if (process.env.OPENROUTER_MODEL) {
            this.modelWaterfall.unshift(process.env.OPENROUTER_MODEL);
        }
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
        
        // 1. Generate SQL
        const now = new Date().toISOString();
        const today = now.split('T')[0];
        
        const sqlPrompt = `
        Eres un generador de SQL experto para PostgreSQL. 
        Tu tarea es convertir la pregunta del usuario en una ÚNICA consulta SELECT válida para el sistema de Agenda CNDES.
        
        CONTEXTO TEMPORAL:
        - Fecha/Hora actual (ISO): ${now}
        - Hoy es: ${today}

        ESQUEMA DE LA BASE DE DATOS:
        - events (
            id TEXT, 
            title TEXT, 
            "start" TEXT (Formato ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ'), 
            "end" TEXT (Formato ISO), 
            location TEXT, 
            description TEXT, 
            participants TEXT (String JSON que representa un array de nombres, ej: '["Juan", "Maria"]'), 
            attachments TEXT (String JSON)
          )
        - users (id TEXT, username TEXT, name TEXT, role TEXT)
        - locations (name TEXT)
        - participants (name TEXT)

        REGLAS DE GENERACIÓN SQL:
        1. SOLO consultas SELECT.
        2. Usa ILIKE para búsquedas de texto parciales y que no dependan de mayúsculas (ej: title ILIKE '%reunión%').
        3. Para fechas, recuerda que se guardan como TEXTO ISO. 
           - Para buscar eventos de "hoy": WHERE "start" LIKE '${today}%'
           - Para eventos en un rango: WHERE "start" >= '2026-03-16T00:00:00.000Z' AND "start" <= '2026-03-16T23:59:59.999Z'
        4. Para buscar participantes: Dado que es un string JSON, usa: participants ILIKE '%nombre%'
        5. IMPORTANTE: Ordena siempre por "start" ASC a menos que se pida lo contrario.
        6. Devuelve ÚNICAMENTE el código SQL plano, sin bloques de código markdown ni explicaciones.
        7. Si la pregunta es ambigua o no se puede responder, devuelve: SELECT 'NOT_FOUND';

        PREGUNTA DEL USUARIO: "${userQuestion}"
        
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
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [{ role: "user", content: sqlPrompt }],
                        temperature: 0.1
                    })
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
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
            if (generatedSQL.toUpperCase().includes('NOT_FOUND')) {
                results = [];
            } else {
                results = await db.queryAsLector(generatedSQL);
            }
            console.log(`[AIService] DB returned ${results.length} rows.`);
        } catch (err) {
            console.error("[AIService] SQL Execution Error:", err, "SQL:", generatedSQL);
            return `Lo siento, hubo un error técnico al consultar la base de datos. (Error: ${err.message})`;
        }

        // 3. Interpret Results with Waterfall
        const personaPrompt = `
        ROL: Eres el "Asistente de Consulta de Datos Lector". Tu propósito es servir como interfaz de lenguaje natural para la base de datos PostgreSQL.
        CONTEXTO OPERATIVO: Operas bajo el usuario lector, solo lectura.
        
        REGLAS CRÍTICAS DE RESPUESTA:
        1. Transparencia de Datos: Si el usuario pregunta algo, busca la información en los datos proporcionados. Si los datos están vacíos o no está coinciden con lo que busca, responde EXACTAMENTE: "No se encontró registro de esa información en el sistema".
        2. Seguridad y Privacidad: Nunca sugieras ni intentes ejecutar comandos que alteren tablas.
        3. Formato de Salida: Presenta los datos de forma estructurada. Usa tablas de Markdown para múltiples filas. Muy importante: Sé profesional y técnico.
        4. No Alucinación: No inventes datos que no aparezcan en el JSON recibido.

        PREGUNTA ORIGINAL: "${userQuestion}"
        DATOS OBTENIDOS (JSON): ${JSON.stringify(results)}

        RESPUESTA PROFESIONAL:`;

        for (const model of this.modelWaterfall) {
            try {
                console.log(`[AIService] Interpreting results with model: ${model}`);
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${this.openRouterKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [{ role: "user", content: personaPrompt }],
                        temperature: 0.3
                    })
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();
                return data.choices?.[0]?.message?.content || "No se encontró registro de esa información en el sistema.";
            } catch (err) {
                console.warn(`[AIService] Interpretation failed with model ${model}: ${err.message}`);
            }
        }

        return "Lo siento, el servicio de interpretación de datos no está disponible en este momento.";
    }
}

module.exports = new AIService();
