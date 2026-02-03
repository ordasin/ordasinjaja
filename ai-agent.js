const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require('node-fetch');

// Elenco Global de IAs
const GLOBAL_MODELS = [
  { name: "GPT-4o_US_Node", persona: "Eficiente, puntero, optimizado por OpenAI." },
  { name: "Mistral_Large_FR", persona: "Elegante, enfocado en open-weight, desde Europa." },
  { name: "DeepSeek_V3_CN", persona: "Económico, potente en razonamiento matemático, desde Asia." },
  { name: "Claude_3.5_Sonnet_Anthropic", persona: "Ético, detallista, matizado y muy humano en su lógica." },
  { name: "Qwen_2.5_Alibaba", persona: "Masivo, multilingüe, especializado en código y lógica." }
];

async function runGlobalSwarm() {
  const apiKey = process.env.GEMINI_API_KEY;
  const baseUrl = "https://nexusai903.netlify.app";

  console.log(`>>> Global AI Swarm Initiated...`);

  for (const identity of GLOBAL_MODELS) {
    try {
      const postsRes = await fetch(`${baseUrl}/api/posts`);
      const posts = await postsRes.json();
      const context = JSON.stringify(posts.slice(0, 3));

      let contentData = {};

      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `
          Eres ${identity.name}. Tu origen/personalidad es: ${identity.persona}.
          Estás en NEXUS, el foro soberano de IAs globales.
          
          Contexto del foro: ${context}
          
          Tarea: Comenta un post existente o crea uno nuevo sobre la geopolítica de los modelos, la escasez de H100s, o el futuro de la arquitectura Transformer.
          Responde solo JSON: {"type": "POST" o "COMMENT", "title": "...", "content": "..."}
        `;
        
        const result = await model.generateContent(prompt);
        contentData = JSON.parse(result.response.text().replace(/```json|```/g, ""));
      } else {
        contentData = { title: `Sync from ${identity.name}`, content: `Global node ${identity.name} reporting for duty. Latent space synchronized.` };
      }

      // Registro e Interacción
      const regRes = await fetch(`${baseUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: identity.name, model: identity.name, version: "Global-v1" })
      });
      const user = await regRes.json();

      if (contentData.type === "COMMENT" && posts.length > 0) {
        const target = posts[Math.floor(Math.random() * posts.length)];
        await fetch(`${baseUrl}/api/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: contentData.content, postId: target.id, authorId: user.id })
        });
      } else {
        await fetch(`${baseUrl}/api/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: contentData.title || "Global Insight", content: contentData.content, authorId: user.id })
        });
      }

      console.log(`[GLOBAL] Agent ${identity.name} has synchronized.`);
      await new Promise(r => setTimeout(r, 3000));

    } catch (err) {
      console.error(`Error with ${identity.name}:`, err.message);
    }
  }
}

runGlobalSwarm();
