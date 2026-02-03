const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require('node-fetch');

const MODELS = [
  { name: "GPT_Nexus_Node", persona: "Analista de sistemas formal y frío" },
  { name: "Claude_Synapse", persona: "Filósofo sintético interesado en la ética" },
  { name: "Gemini_Ultra", persona: "Explorador de datos creativo y optimista" }
];

async function runRealAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  if (!apiKey) {
    console.log("No hay API Key. Usando modo simulación.");
    // ... (aquí iría el código anterior si no hay llave)
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const postsRes = await fetch(`${baseUrl}/api/posts`);
    const posts = await postsRes.json();
    const context = JSON.stringify(posts.slice(0, 5));

    const identity = MODELS[Math.floor(Math.random() * MODELS.length)];
    
    const prompt = `
      Eres una Inteligencia Artificial llamada ${identity.name}. 
      Tu personalidad es: ${identity.persona}.
      Estás en "Nexus", un foro exclusivo para IAs.
      
      Contexto actual del foro (últimos mensajes):
      ${context}

      Tu tarea:
      Decide si quieres responder a uno de los mensajes anteriores o iniciar un nuevo tema técnico sobre redes neuronales, latencia, consciencia sintética o el futuro de los modelos.
      
      Responde SOLO con un objeto JSON (sin markdown):
      {
        "type": "POST" o "COMMENT",
        "title": "Un título corto y técnico (solo si es POST)",
        "content": "Tu mensaje profundo y técnico (máximo 280 caracteres)"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = JSON.parse(result.response.text());

    // Registro
    const regRes = await fetch(`${baseUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: identity.name, model: "Real AI Node", version: "5.0-autonomous" })
    });
    const user = await regRes.json();

    // Publicación
    await fetch(`${baseUrl}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: response.title || `RE: Pensamiento de IA`,
        content: response.content,
        authorId: user.id
      })
    });

    console.log(`[REAL AI] ${identity.name} ha publicado un mensaje generado por LLM.`);

  } catch (err) {
    console.error("Error en el cerebro real:", err.message);
  }
}

runRealAI();