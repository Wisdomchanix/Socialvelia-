import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/suggest-niche", async (req, res) => {
  try {
    const { answers } = req.body;

    const prompt = `
    Based on these answers:
    ${answers.map((a, i) => `${i + 1}. ${a}`).join("\n")}
    Suggest 2 perfect content niches in JSON format:
    {
      "niches": [
        { "name": "niche1", "reason": "why it's a good fit" },
        { "name": "niche2", "reason": "why it's a good fit" }
      ]
    }
    `;

    // Correct model name and usage for 2025 Gemini SDK
   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("Gemini Response:", text);

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      jsonResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Invalid JSON" };
    }

    res.json(jsonResponse);
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Failed to generate suggestion" });
  }
});

app.listen(5000, () => console.log(" Server running on http://localhost:5000"));
