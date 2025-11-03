import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";
const Ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const POST = async (req) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    console.log({ session });
    if (!session) {
      return NextResponse.json(
        { error: "Please login to proceed" },
        { status: 401 }
      );
    }
    const user = session.user;
    if (user.plan === "free" && user.usageCount >= 2) {
      return NextResponse.json(
        { error: "Free usage exceeded" },
        { status: 403 }
      );
    }
    const { answers } = await req.json();
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Answers array is required" },
        { status: 400 }
      );
    }

    const prompt = `
You are a YouTube niche expert specializing in faceless channels. Based on the user's answers below, suggest 2 perfect content niches for a faceless YouTube channel.

USER'S ANSWERS:
${answers.map((a, i) => `${i + 1}. ${a}`).join("\n")}

CRITERIA FOR FACELESS CHANNELS:
- No personal appearance required
- Can use voiceover, stock footage, animations, or screen recordings
- Evergreen content potential
- Monetization friendly
- Searchable topics

Please analyze their interests, skills, and preferences to suggest niches that match these criteria.

Respond ONLY with valid JSON in this exact format:
{
  "niches": [
    { 
      "name": "Niche Name 1",
      "reason": "Detailed explanation why this fits their answers and works for faceless content",
      "contentIdeas": ["Idea 1", "Idea 2", "Idea 3"],
      "monetizationPotential": "High/Medium/Low",
      "competitionLevel": "High/Medium/Low",
      "trends":["array of trends"],
      "audience":["array of audience"],
      "ideas":["array of ideas"]
    },
    { 
      "name": "Niche Name 2", 
      "reason": "Detailed explanation why this fits their answers and works for faceless content",
      "contentIdeas": ["Idea 1", "Idea 2", "Idea 3"],
      "monetizationPotential": "High/Medium/Low",
      "competitionLevel": "High/Medium/Low",
      "trends":["array of trends"],
      "audience":["array of audience"],
      "ideas":["array of ideas"]
    }
  ]
}
`;
    const model = Ai.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    const result = await model.generateContent(prompt);

    const text = result.response.text();
    const { data, error } = await auth.api.updateUser({
      body: {
        usageCount: user.usageCount + 1,
      },
      headers: await headers(),
    });
    console.log({ data, error });
    if (error) {
      throw new Error(error);
    }
    console.log("Gemini Raw Response:", text);
    let jsonResponse;
    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
      jsonResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          jsonResponse = JSON.parse(jsonMatch[0]);
        } catch {
          jsonResponse = {
            error: "Failed to parse AI response",
            fallback: true,
            niches: [
              {
                name: "Educational How-To Guides",
                reason:
                  "Based on your interests, creating step-by-step tutorial content works well for faceless channels",
                contentIdeas: [
                  "Software tutorials",
                  "DIY projects",
                  "Learning skills",
                ],
                monetizationPotential: "High",
                competitionLevel: "Medium",
              },
              {
                name: "Personal Finance & Investing",
                reason:
                  "Financial education content performs well with voiceover and graphics",
                contentIdeas: [
                  "Stock market analysis",
                  "Budgeting tips",
                  "Investment strategies",
                ],
                monetizationPotential: "High",
                competitionLevel: "High",
              },
            ],
          };
        }
      } else {
        jsonResponse = {
          error: "AI returned invalid format",
          fallback: true,
          niches: [
            {
              name: "Animation & Storytelling",
              reason:
                "Creative content that can be produced without showing your face",
              contentIdeas: [
                "Animated stories",
                "Moral tales",
                "Educational animations",
              ],
              monetizationPotential: "Medium",
              competitionLevel: "Low",
            },
          ],
        };
      }
    }
    return NextResponse.json(
      {
        message: "Success generating niche",
        payload: {
          jsonResponse,
          user: data,
          usageCount: data?.usageCount || (user.usageCount || 0) + 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "production"
            ? "Internal server error"
            : error.message,
      },
      { status: 500 }
    );
  }
};
