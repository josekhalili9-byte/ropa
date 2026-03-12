import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface OutfitAnalysis {
  clothingDetected: string[];
  style: string;
  rating: number;
  suggestions: {
    combinations: string[];
    colors: string[];
    styleTips: string[];
  };
}

export async function analyzeOutfit(base64Image: string): Promise<OutfitAnalysis> {
  try {
    const mimeType = base64Image.substring(base64Image.indexOf(":") + 1, base64Image.indexOf(";"));
    const base64Data = base64Image.split(",")[1];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "Actúa como un estilista profesional y asesor de imagen de alta costura. Analiza detalladamente el outfit de la persona en la imagen. Identifica las prendas exactas, define el estilo general, dale una calificación honesta y estricta del 1 al 10 basada en la armonía, ajuste y tendencia. Finalmente, proporciona sugerencias reales y útiles para mejorar el look, incluyendo combinaciones de prendas, paletas de colores que le favorecerían y consejos de estilo prácticos."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clothingDetected: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Tipos de ropa detectada (ej. camiseta de algodón, pantalón vaquero recto, tenis blancos)",
            },
            style: {
              type: Type.STRING,
              description: "Estilo del outfit (ej. casual urbano, deportivo chic, elegante minimalista)",
            },
            rating: {
              type: Type.NUMBER,
              description: "Calificación del outfit del 1 al 10",
            },
            suggestions: {
              type: Type.OBJECT,
              properties: {
                combinations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Sugerencias de combinaciones de ropa para mejorar el look",
                },
                colors: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Colores que complementarían el outfit",
                },
                styleTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Recomendaciones de estilo profesionales y prácticas",
                },
              },
              required: ["combinations", "colors", "styleTips"],
            },
          },
          required: ["clothingDetected", "style", "rating", "suggestions"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("La IA no devolvió ninguna respuesta.");
    return JSON.parse(text) as OutfitAnalysis;
  } catch (error) {
    console.error("Error en analyzeOutfit:", error);
    throw new Error("No pudimos analizar tu outfit. Asegúrate de que la imagen sea clara y vuelve a intentarlo.");
  }
}
