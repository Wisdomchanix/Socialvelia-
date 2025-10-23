// /src/pages/api/suggest-niche.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { answers } = req.body;

    const prompt = `
      You are a business strategist helping creators find profitable niches.
      Based on the following responses, suggest a specific niche they should focus on.

      Answers: ${JSON.stringify(answers)}

      Respond in this format:
      - Recommended Niche: <niche>
      - Why it’s a good fit: <1-2 sentence explanation>
      - Example Content Ideas: <3 bullet points>
    `;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    const suggestion =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t generate a niche suggestion at the moment.";

    res.status(200).json({ suggestion });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
