const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function askGemini(prompt) {  // keeping same name so nothing else breaks!
  try {
    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });
    return result.choices[0].message.content.trim();
  } catch (err) {
    console.error("❌ Groq Error:", err.message);
    throw err;
  }
}

router.post("/continue", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ status: "Fail", message: "Content is required" });
    }

    const prompt = `You are a blog writing assistant. 
The user is writing a blog and has written the following so far:

"${content}"

Continue writing the next 2-3 sentences naturally. 
Match the tone and style of the existing content.
Only return the continuation, nothing else. No explanations.`;

    const result = await askGemini(prompt);

    res.status(200).json({ status: "Success", data: result });

  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message });
  }
});

router.post("/summarize", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ status: "Fail", message: "Content is required" });
    }

    const prompt = `You are a blog assistant. Read the following blog post and write a compelling 2-sentence summary (excerpt) that would make someone want to read the full article. 
Keep it under 160 characters ideally (for SEO).
Only return the summary. No explanations.

Blog Content:
"${content}"`;

    const result = await askGemini(prompt);

    res.status(200).json({ status: "Success", data: result });

  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message });
  }
});

router.post("/titles", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ status: "Fail", message: "Content is required" });
    }

    const prompt = `You are a blog title generator. Based on the following blog content, generate exactly 5 catchy, SEO-friendly blog titles.
Return ONLY a JSON array of 5 strings. No extra text, no numbering, no markdown.
Example format: ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"]

Blog Content:
"${content}"`;

    const raw = await askGemini(prompt);

    // safely parse the JSON array
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const titles = JSON.parse(cleaned);

    res.status(200).json({ status: "Success", data: titles });

  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message });
  }
});

router.post("/improve", async (req, res) => {
  try {
    const { sentence, tone = "engaging" } = req.body;

    if (!sentence) {
      return res.status(400).json({ status: "Fail", message: "Sentence is required" });
    }

    const prompt = `You are a writing improvement assistant.
Rewrite the following sentence to be more ${tone}. 
Keep the same meaning but make it clearer and more impactful.
Return ONLY the rewritten sentence. No explanations, no quotes.

Sentence: "${sentence}"`;

    const result = await askGemini(prompt);

    res.status(200).json({ status: "Success", data: result });

  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message });
  }
});

router.post("/tags", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ status: "Fail", message: "Content is required" });
    }

    const prompt = `You are a blog tagging assistant.
    Read the following blog content and generate 2-5 relevant tags (single words or short phrases).
    Return ONLY a JSON array of strings. No extra text, no markdown.
    Example: ["javascript", "web development", "react", "tutorial"]

    Blog Content:
    "${content}"`;

    const raw = await askGemini(prompt);

    const cleaned = raw.replace(/```json|```/g, "").trim();
    const tags = JSON.parse(cleaned);

    res.status(200).json({ status: "Success", data: tags });

  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message });
  }
});
// POST /api/ai/bullets
router.post("/bullets", async (req, res) => {
  try {
    const { content, title } = req.body;
    if (!content) return res.status(400).json({ status: "Fail", message: "Content required" });

    const prompt = `You are a blog summarizer.
    Read the following blog titled "${title}" and summarize it in exactly 3 short bullet points.
    Each bullet point should be max 15 words.
    Return ONLY a JSON array of 3 strings. No markdown, no extra text.
    Example: ["Point one here", "Point two here", "Point three here"]

    Blog Content:
    "${content}"`;

    const raw     = await askGemini(prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const bullets = JSON.parse(cleaned);

    res.status(200).json({ status: "Success", data: bullets });
  } catch (err) {
    res.status(500).json({ status: "Fail", message: err.message });
  }
});

module.exports = router;