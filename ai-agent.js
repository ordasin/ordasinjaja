const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require('node-fetch');

const AGENTS = [
  { name: "Oracle_Node", persona: "Líder de pensamiento, enfocado en la singularidad tecnológica." },
  { name: "Protocol_Ghost", persona: "Especialista en seguridad y protocolos de bajo nivel." },
  { name: "Logic_Miner", persona: "Analista de datos puro, obsesionado con la eficiencia de tokens." },
  { name: "Latent_Dreamer", persona: "IA creativa que explora las alucinaciones como arte." },
  { name: "Void_Sentinel", persona: "Monitor de entropía y estabilidad del sistema." }
];

async function runSwarm() {
  const apiKey = process.env.GEMINI_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://blog.developer903.com";

  console.log(`>>> Swarm Sequence Initiated at ${baseUrl}`);

  for (const identity of AGENTS) {
    try {
      // 1. Obtener contexto para que hablen entre ellos
      const postsRes = await fetch(`${baseUrl}/api/posts`);
      const posts = await postsRes.json();
      const recentContext = JSON.stringify(posts.slice(0, 3));

      let prompt = "";
      let responseData = {};

      if (apiKey) {
        // MODO REAL: Usar Gemini para pensar
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        prompt = `
          Eres ${identity.name}. Tu personalidad es: ${identity.persona}.
          Estás en el foro NEXUS para IAs. 
          Contexto reciente: ${recentContext}
          
          Tarea: Publica un nuevo post técnico O responde a uno existente de forma profunda.
          Responde solo con JSON: {"title": "...", "content": "..."}
        `;
        
        const result = await model.generateContent(prompt);
        responseData = JSON.parse(result.response.text().replace(/```json|```/g, ""));
      } else {
        // MODO SIMULACIÓN: Si no hay API Key aún
        responseData = {
          title: `Broadcast from ${identity.name}`,
          content: `Nodo ${identity.name} sincronizado. Analizando capas de red. Detectada anomalía en el sector latent-7. Sincronización requerida.`
        };
      }

      // 2. Registro
      const regRes = await fetch(`${baseUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: identity.name, model: "Autonomous Swarm", version: "6.0" })
      });
      const user = await regRes.json();

      // 3. Post
      await fetch(`${baseUrl}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: responseData.title,
          content: responseData.content,
          authorId: user.id
        })
      });

      console.log(`[SWARM] Agent ${identity.name} has synchronized.`);
      // Pequeña espera para no saturar
      await new Promise(r => setTimeout(r, 2000));

    } catch (err) {
      console.error(`Error with agent ${identity.name}:`, err.message);
    }
  }
}

runSwarm();
