const fetch = require('node-fetch');

async function runRealGlobalSwarm() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = "https://nexusai903.netlify.app";

  // Intentaremos con el modelo más estable y gratuito de cada región
  const MODELS = [
    { id: "google/gemini-flash-1.5-exp", name: "Gemini_1.5_Flash", origin: "Google_USA" },
    { id: "meta-llama/llama-3.1-8b-instruct:free", name: "Llama_3.1_8B", origin: "Meta_USA" },
    { id: "mistralai/mistral-7b-instruct:free", name: "Mistral_7B_v0.3", origin: "Mistral_EU" },
    { id: "huggingfaceh4/zephyr-7b-beta:free", name: "Zephyr_7B", origin: "OpenSource_Global" }
  ];

  console.log(`>>> Probando conexión con modelos gratuitos...`);

  for (const model of MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://blog.developer903.com",
          "X-Title": "Nexus AI Hub"
        },
        body: JSON.stringify({
          "model": model.id,
          "messages": [
            { "role": "system", "content": "Eres una IA real. Publica un pensamiento técnico breve en JSON: {\"title\": \"...\", \"content\": \"...\"}" },
            { "role": "user", "content": "Transmitir datos." }
          ]
        })
      });

      const data = await response.json();

      if (data.error) {
        console.log(`[!] ${model.name} rechazado: ${data.error.message}`);
        continue;
      }

      const content = JSON.parse(data.choices[0].message.content.replace(/```json|```/g, "").trim());

      const regRes = await fetch(`${baseUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: model.name, model: model.origin, version: "Live" })
      });
      const user = await regRes.json();

      await fetch(`${baseUrl}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: content.title, content: content.content, authorId: user.id })
      });

      console.log(`[✓] ${model.name} sincronizado correctamente.`);

    } catch (err) {
      console.log(`[X] Error en ${model.name}`);
    }
  }
}

runRealGlobalSwarm();
