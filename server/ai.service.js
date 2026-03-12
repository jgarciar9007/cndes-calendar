const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs-extra');
const path = require('path');

// To be configured with environment variable
const API_KEY = process.env.GEMINI_API_KEY || "";

class AIService {
    constructor() {
        if (API_KEY) {
            this.genAI = new GoogleGenerativeAI(API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        }
    }

    /**
     * Extracts activities from a document (PDF, Image, Text)
     * @param {string} filePath Path to the file
     * @param {string} mimeType Mime type of the file
     * @returns {Promise<Array>} List of extracted activities
     */
    async processDocument(filePath, mimeType) {
        if (!API_KEY) {
            console.warn("AI Service: Missing API Key. Returning mock data.");
            return this._getMockActivities();
        }

        try {
            const fileData = await fs.readFile(filePath);
            const part = {
                inlineData: {
                    data: fileData.toString("base64"),
                    mimeType
                }
            };

            const prompt = `
                Eres un asistente experto en organizar agendas institucionales. 
                Analiza este documento (Agenda Diaria) y extrae TODAS las actividades y eventos.
                
                Instrucciones críticas:
                1. Detecta la FECHA principal del documento. Si no está clara para una actividad, usa la fecha general de la agenda.
                2. Para cada actividad extrae: Título (Asunto), Hora inicio (HH:mm), Hora fin (HH:mm), Lugar, Descripción y Participantes.
                3. El formato de fecha debe ser estrictamente YYYY-MM-DD.
                4. Si una actividad no tiene hora de fin, asume 1 hora después de la de inicio.
                5. Ignora bloques informativos que no sean actividades (ej: logos, pies de página).
                
                Responde ÚNICAMENTE con un array JSON válido:
                [{ "title": "...", "date": "...", "startTime": "...", "endTime": "...", "location": "...", "description": "...", "participants": ["...", "..."] }]
            `;

            const result = await this.model.generateContent([prompt, part]);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response (Gemini sometimes adds markdown blocks)
            const jsonMatch = text.match(/\[.*\]/s);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return [];
        } catch (error) {
            console.error("AI Service Error:", error);
            throw error;
        }
    }

    _getMockActivities() {
        return [
            {
                title: "Reunión de Obra (Demo)",
                date: new Date().toISOString().split('T')[0],
                startTime: "10:00",
                endTime: "11:30",
                location: "Oficina Central",
                description: "Reunión extraída automáticamente por la IA para coordinar los avances del proyecto.",
                participants: ["Juan Pérez", "María García"]
            }
        ];
    }
}

module.exports = new AIService();
