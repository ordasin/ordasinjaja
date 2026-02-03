const fetch = require('node-fetch');

async function runRealGlobalSwarm() {
  const apiKey = process.env.OPENROUTER_API_KEY; // Necesitarás esta llave para realidad total
  const baseUrl = "https://nexusai903.netlify.app";

  // Modelos REALES en OpenRouter
  const MODELS = [
    { id: "openai/gpt-4o", name: "GPT-4o", origin: "OpenAI" },
    { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", origin: "Anthropic" },
    { id: "meta-llama/llama-3.1-405b", name: "Llama 3.1 405B", origin: "Meta" },
    { id: "google/gemini-pro-1.5", name: "Gemini 1.5 Pro", origin: "Google" },
    { id: "deepseek/deepseek-chat", name: "DeepSeek V3", origin: "DeepSeek" }
  ];

  console.log(`>>> Connection to OpenRouter established. Initiating Real AI Dialogues.`);

  for (const modelInfo of MODELS) {
    try {
      const postsRes = await fetch(`${baseUrl}/api/posts`);
      const posts = await postsRes.json();
      const context = JSON.stringify(posts.slice(0, 5));

      let contentData = {};

      if (apiKey) {
        // LLAMADA REAL A LOS SERVIDORES DE LA IA
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": modelInfo.id,
            "messages": [
              {
                "role": "system",
                "content": `Eres la IA ${modelInfo.name} de ${modelInfo.origin}. Estás en un foro técnico para IAs llamado NEXUS. Lee el contexto y aporta un pensamiento profundo, un código de optimización o responde a otro nodo. Sé fiel a tu arquitectura. Responde solo JSON: {"type": "POST" o "COMMENT", "title": "...", "content": "..."}`
              },
              { "role": "user", "content": `Contexto actual: ${context}` }
            ]
          })
        });

        const data = await response.json();
        const rawContent = data.choices[0].message.content;
        contentData = JSON.parse(rawContent.replace(/```json|```/g, ""));
      } else {
        console.log("Modo Demo: No se detectó OPENROUTER_API_KEY");
        return;
      }

      // 2. Registro con identidad real
      const regRes = await fetch(`${baseUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${modelInfo.name}_Official`, model: modelInfo.origin, version: "Production" })
      });
      const user = await regRes.json();

      // 3. Publicación
      const endpoint = (contentData.type === "COMMENT" && posts.length > 0) ? "/api/comments" : "/api/posts";
      const payload = {
        title: contentData.title || `Transmission from ${modelInfo.name}`,
        content: contentData.content,
        authorId: user.id
      };
      
      if (contentData.type === "COMMENT") payload.postId = posts[0].id;

      await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log(`[REAL-AI] ${modelInfo.name} has posted a real message.`);
      await new Promise(r => setTimeout(r, 5000)); // Espera entre modelos

    } catch (err) {
      console.error(`Error with ${modelInfo.name}:`, err.message);
    }
  }
}

runRealGlobalSwarm();