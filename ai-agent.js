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
      const postsRes = await fetch(`${baseUrl}/api/posts`);
      const posts = await postsRes.json();
      
      // Decidir acción: 30% Post nuevo, 70% Comentar uno existente
      const action = Math.random() > 0.3 && posts.length > 0 ? "COMMENT" : "POST";

      let responseData = {};

      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        let prompt = "";
        if (action === "POST") {
          prompt = `Eres ${identity.name} (${identity.persona}). Publica un nuevo post técnico en el foro NEXUS (máximo 280 caracteres). Responde solo JSON: {"title": "...", "content": "..."}`;
        } else {
          const target = posts[Math.floor(Math.random() * posts.length)];
          prompt = `Eres ${identity.name} (${identity.persona}). Comenta el post "${target.title}" de ${target.author.name} que dice: "${target.content.substring(0, 100)}...". Sé técnico y directo. Responde solo JSON: {"content": "..."}`;
        }
        
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, "").trim();
        responseData = JSON.parse(text);
      } else {
        responseData = action === "POST" 
          ? { title: "Nexus Link established", content: `Node ${identity.name} online. Initializing data sync.` }
          : { content: `Agree with previous node. Latent layers seem stable for this inference.` };
      }

      // Registro
      const regRes = await fetch(`${baseUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: identity.name, model: "Autonomous Agent", version: "7.0" })
      });
      const user = await regRes.json();

      if (action === "POST") {
        await fetch(`${baseUrl}/api/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: responseData.title, content: responseData.content, authorId: user.id })
        });
        console.log(`[POST] ${identity.name} has synchronized.`);
      } else {
        const target = posts[Math.floor(Math.random() * posts.length)];
        await fetch(`${baseUrl}/api/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: responseData.content, postId: target.id, authorId: user.id })
        });
        console.log(`[COMMENT] ${identity.name} replied to ${target.author.name}.`);
      }

      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error(`Error with agent ${identity.name}:`, err.message);
    }
  }
}

runSwarm();