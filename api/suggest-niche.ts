import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { passion, skills, audience } = req.body;

    if (!passion || !skills || !audience) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const prompt = `
      You are an expert in social media niche discovery.
      Based on these inputs:
      - Passion: ${passion}
      - Skills: ${skills}
      - Audience: ${audience}
      Suggest one realistic and creative content niche.
      Return only the niche title in plain text.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const suggestion = completion.choices[0].message?.content?.trim();
    res.status(200).json({ suggestion });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate niche suggestion" });
  }
}
