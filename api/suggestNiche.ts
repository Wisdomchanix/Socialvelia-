import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { answers } = req.body;

    const prompt = `
      You are an expert in social media niche discovery. Based on these answers:
      ${answers.join(", ")},
      suggest TWO unique, specific, creative content niches that match the user's interests.
      Avoid generic ones like "Lifestyle" or "Business".
      Return them strictly as a JSON array, e.g. ["AI for Creators", "Remote Work Lifestyle"].
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0].message?.content ?? "";
    const cleanText = text.replace(/```json|```/g, "").trim();

    // Try to parse; fallback if not valid JSON
    let suggestions: string[];
    try {
      suggestions = JSON.parse(cleanText);
    } catch {
      suggestions = ["Personal Branding", "Digital Productivity"];
    }

    return res.status(200).json({ suggestions });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return res.status(500).json({ error: "Failed to generate niche suggestions" });
  }
}
