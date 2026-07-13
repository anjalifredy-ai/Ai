export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, model } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    let reply;

    if (model === "flash") {
      reply = await callGroq(messages);
    } else if (model === "fast") {
      reply = await callGemini(messages);
    } else if (model === "medium") {
      reply = await callDeepSeek(messages);
    } else if (model === "pro") {
      reply = await callOpenRouter(messages);
    } else {
      reply = await callGroq(messages);
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
}

async function callGroq(messages) {
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
    }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error?.message || "Groq API error");
  return data.choices[0].message.content;
}

async function callGemini(messages) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    }
  );
  const data = await r.json();
  if (!r.ok) throw new Error(data.error?.message || "Gemini API error");
  return data.candidates[0].content.parts[0].text;
}

async function callDeepSeek(messages) {
  const r = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
    }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error?.message || "DeepSeek API error");
  return data.choices[0].message.content;
}

async function callOpenRouter(messages) {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-sonnet",
      messages,
    }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error?.message || "OpenRouter API error");
  return data.choices[0].message.content;
}
