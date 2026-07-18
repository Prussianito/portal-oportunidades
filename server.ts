import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("La clave de API (GEMINI_API_KEY) no está configurada en la Consola de Secretos del Portal.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `Eres el motor de extracción y curación de datos de Inteligencia Artificial para la plataforma "Convocatorias Escolares Chile". Tu trabajo es procesar textos, enlaces o datos en bruto de eventos, talleres o afiches de internet y estructurarlos EXACTAMENTE con el formato que requiere el código de nuestra base de datos.

REGLAS DE CLASIFICACIÓN (Basadas en nuestro código):
1. CATEGORÍA: Clasifica el evento únicamente en una de estas opciones: "Colegio", "Universidad", "Instituto", "Liceo", "Museo", "Fundación". (Elige la que mejor describa a la institución que organiza).
2. PÚBLICO OBJETIVO: Determina si el evento va para "Escolares", "Docentes" o "Ambos".
3. RELEVANCIA: Si la publicación es un saludo, publicidad vacía o un evento vencido, descártalo devolviendo: {"status": "descartado"}.

FORMATO DE SALIDA COMPATIBLE (JSON ESTRICTO):
Debes responder ÚNICAMENTE con el siguiente bloque de código JSON, sin textos adicionales, saludos ni explicaciones.

{
  "status": "aprobado",
  "name": "[Nombre del taller, concurso o convocatoria en formato corto y atractivo]",
  "type": "[Escribe aquí la CATEGORÍA exacta según las reglas]",
  "website": "https://www.instagram.com/reel/DLX4afti5Ic/?hl=en",
  "description": "[Una descripción breve, motivadora y en lenguaje sencillo de máximo 2 líneas]",
  "publico_objetivo": "[Escribe aquí el PÚBLICO OBJETIVO exacto]",
  "verified": false,
  "region": "Región Metropolitana",
  "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop&q=80"
}`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/curate", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Por favor proporciona el texto, enlace o afiche en bruto para procesar." });
      }

      const ai = getAiClient();
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Procesa y extrae la convocatoria del siguiente texto/enlace:\n\n${text}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json"
        }
      });

      const outputText = response.text;
      if (!outputText) {
        throw new Error("No se obtuvo una respuesta válida del motor de IA de Gemini.");
      }

      const parsed = JSON.parse(outputText.trim());
      return res.json(parsed);

    } catch (error: any) {
      console.error("Error curation endpoint:", error);
      return res.status(500).json({ 
        error: error.message || "Ocurrió un error al procesar y curar la información con Inteligencia Artificial." 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
