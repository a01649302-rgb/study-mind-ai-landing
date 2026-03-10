// pages/api/pdf.js
import pdf from "pdf-parse";

export const config = {
  api: { bodyParser: false }, // recibimos el buffer crudo
};

async function bufferFromStream(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const buf = await bufferFromStream(req); // recibe todo el body como buffer
    const data = await pdf(buf);

    // Limitar la cantidad de texto que mandamos a la API para controlar tokens/costo
    const text = (data.text || "").slice(0, 12000); // ~12k chars — ajusta si hace falta

    // Construimos prompt que pide JSON con summary y flashcards
    const prompt = `Eres un asistente que extrae un resumen y genera flashcards.
Devuelve SOLO un JSON con dos campos: "summary" (texto corto) y "flashcards" (array de objetos con "question" y "answer").
El texto a procesar es:
"""${text}"""
`;

    // Llamada a OpenAI (Chat Completions)
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Eres un asistente que genera resúmenes y flashcards de estudio." },
          { role: "user", content: prompt },
        ],
        max_tokens: 800,
        temperature: 0.2,
      }),
    });

    const jr = await r.json();
    const aiText = jr?.choices?.[0]?.message?.content ?? "";

    // Intentamos parsear JSON devuelto por la IA. 
    let result;
    try {
      // Limpiar posibles bloques de código markdown ```json ... ```
      const cleanedAiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
      result = JSON.parse(cleanedAiText);
    } catch (err) {
      console.error("Error parseando JSON de IA:", err);
      // Si no es JSON, generamos un objeto con el texto como summary y sin flashcards
      result = { summary: aiText.trim(), flashcards: [] };
    }

    // Responder con el JSON
    return res.status(200).json(result);
  } catch (err) {
    console.error("PDF processing error:", err);
    return res.status(500).json({ error: "Failed to process PDF" });
  }
}