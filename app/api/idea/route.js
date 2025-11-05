import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    const { data, error } = await auth.api.updateUser({
      body: {
        usageCount: user.usageCount + 1,
      },
      headers: await headers(),
    });
    if (error) {
      throw new Error(error);
    }
    const { answers } = await req.json();

    if (
      !answers ||
      typeof answers !== "object" ||
      Object.keys(answers).length === 0
    ) {
      return NextResponse.json(
        { error: "Answers object is required with question-answer pairs" },
        { status: 400 }
      );
    }

    const prompt = `
You are a YouTube content strategist specializing in faceless channels. Analyze the user's answers and generate content ideas.

USER'S BACKGROUND:
${Object.entries(answers)
  .map(([question, answer]) => `Q: ${question}\nA: ${answer}`)
  .join("\n\n")}

Generate 5-8 specific content ideas for faceless channels. Each idea should include title, description, niche, format, and target audience.

IMPORTANT: You MUST respond with VALID JSON only, no other text. Use this exact format:

{
  "ideas": [
    {
      "title": "Video title here",
      "description": "Brief description",
      "niche": "Niche category",
      "format": "Tutorial/Explainer/List",
      "targetAudience": ["Audience 1", "Audience 2"],
      "productionDifficulty": "Easy/Medium/Hard",
      "monetizationStrategies": ["Adsense", "Affiliate marketing"]
    }
  ]
}

Keep the response clean and ensure the JSON is valid.
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

    console.log("Raw AI Response:", text);

    let jsonResponse;
    try {
      // More robust cleaning
      let cleanedText = text
        .replace(/```json\n?|\n?```|`/g, "")
        .replace(/^[^{]*/, "") // Remove anything before first {
        .replace(/[^}]*$/, "") // Remove anything after last }
        .trim();

      // If still not valid, try to extract JSON object
      if (!cleanedText.startsWith("{")) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanedText = jsonMatch[0];
        }
      }

      console.log("Cleaned text for parsing:", cleanedText);

      jsonResponse = JSON.parse(cleanedText);

      // Validate required fields
      if (!jsonResponse.ideas || !Array.isArray(jsonResponse.ideas)) {
        throw new Error("Invalid ideas array in response");
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Problematic text was:", text);

      // Use fallback with the actual response text for debugging
      jsonResponse = createFallbackIdeas(answers, text);
    }

    return NextResponse.json(
      {
        message: "Success generating content ideas",
        payload: {
          ideas: jsonResponse.ideas || [],
          recommendedNiches: jsonResponse.recommendedNiches || [],
          contentStrategy: jsonResponse.contentStrategy || {},
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate content ideas",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
};

// Enhanced fallback with better error information
function createFallbackIdeas(answers, errorText = "") {
  console.log("Using fallback ideas. Error text:", errorText);

  const answerText = Object.values(answers).join(" ").toLowerCase();
  let detectedInterests = [];

  // Interest detection (same as before)
  if (answerText.includes("tech") || answerText.includes("programming")) {
    detectedInterests.push("Technology");
  }
  if (answerText.includes("cook") || answerText.includes("food")) {
    detectedInterests.push("Cooking");
  }
  if (answerText.includes("finance") || answerText.includes("money")) {
    detectedInterests.push("Personal Finance");
  }
  if (answerText.includes("travel") || answerText.includes("adventure")) {
    detectedInterests.push("Travel");
  }
  if (answerText.includes("game") || answerText.includes("gaming")) {
    detectedInterests.push("Gaming");
  }
  if (answerText.includes("educat") || answerText.includes("learn")) {
    detectedInterests.push("Education");
  }

  if (detectedInterests.length === 0) {
    detectedInterests = ["Personal Development", "How-To Guides"];
  }

  // Simple fallback ideas that always work
  const fallbackIdeas = [
    {
      title: "Beginner's Guide to Your Niche",
      description:
        "Comprehensive introduction to get started in your area of interest",
      niche: detectedInterests[0] || "General",
      format: "Tutorial",
      targetAudience: ["Beginners", "Enthusiasts"],
      productionDifficulty: "Easy",
      monetizationStrategies: ["Adsense", "Affiliate marketing"],
      whyItFits: "Perfect starting point based on your interests",
      tags: ["beginner", "guide", "tutorial"],
      scriptOutline: [
        "Introduction",
        "Basic concepts",
        "Getting started",
        "Next steps",
      ],
      thumbnailIdeas: ["Step-by-step graphic", "Beginner-friendly imagery"],
    },
    {
      title: "Top Tools and Resources List",
      description: "Curated list of essential tools for your niche",
      niche: detectedInterests[0] || "General",
      format: "List",
      targetAudience: ["Professionals", "Students"],
      productionDifficulty: "Easy",
      monetizationStrategies: ["Adsense", "Affiliate marketing"],
      whyItFits: "Leverages your knowledge to help others",
      tags: ["tools", "resources", "productivity"],
      scriptOutline: [
        "Introduction",
        "Tool 1",
        "Tool 2",
        "Tool 3",
        "Conclusion",
      ],
      thumbnailIdeas: ["Tools collage", "Numbered list graphic"],
    },
    {
      title: "Common Mistakes to Avoid",
      description: "Learn from others' experiences and avoid pitfalls",
      niche: detectedInterests[0] || "General",
      format: "Educational",
      targetAudience: ["Beginners", "Intermediate"],
      productionDifficulty: "Medium",
      monetizationStrategies: ["Adsense", "Sponsorships"],
      whyItFits: "Shares valuable lessons from your experience",
      tags: ["mistakes", "learning", "tips"],
      scriptOutline: [
        "Introduction",
        "Mistake 1",
        "Mistake 2",
        "Solutions",
        "Summary",
      ],
      thumbnailIdeas: ["Warning sign", "Before/after comparison"],
    },
    {
      title: "Latest Trends and Updates",
      description: "Stay current with the newest developments in your field",
      niche: detectedInterests[0] || "General",
      format: "News",
      targetAudience: ["Professionals", "Enthusiasts"],
      productionDifficulty: "Easy",
      monetizationStrategies: ["Adsense", "Sponsorships"],
      whyItFits: "Keeps you and your audience up-to-date",
      tags: ["trends", "news", "updates"],
      scriptOutline: [
        "Introduction",
        "Trend 1",
        "Trend 2",
        "Impact",
        "Conclusion",
      ],
      thumbnailIdeas: ["Trending arrow", "Calendar with news icons"],
    },
    {
      title: "Success Story Case Study",
      description: "Analyze what makes successful projects work in your niche",
      niche: detectedInterests[0] || "General",
      format: "Case Study",
      targetAudience: ["Advanced", "Professionals"],
      productionDifficulty: "Hard",
      monetizationStrategies: ["Adsense", "Digital products"],
      whyItFits: "Demonstrates deep understanding of your field",
      tags: ["case study", "success", "analysis"],
      scriptOutline: [
        "Introduction",
        "Background",
        "Strategy",
        "Results",
        "Lessons",
      ],
      thumbnailIdeas: ["Success graph", "Trophy icon", "Before/after results"],
    },
  ];

  return {
    ideas: fallbackIdeas,
    recommendedNiches: detectedInterests.map((niche) => ({
      name: niche,
      reason: `Based on your interests in ${niche.toLowerCase()}`,
      growthPotential: "Medium",
      competitionLevel: "Medium",
    })),
    contentStrategy: {
      topNiches: detectedInterests.slice(0, 2),
      contentPillars: ["Educational", "How-To", "Trends"],
      postingFrequency: "1-2 times per week",
      channelGrowthTips: [
        "Focus on one niche initially",
        "Engage with comments regularly",
        "Use relevant hashtags and SEO",
      ],
      equipmentNeeded: [
        "Good microphone",
        "Video editing software",
        "Screen recording tool",
      ],
    },
    _fallback: true,
    _error: errorText.substring(0, 200), // Include first 200 chars of error for debugging
  };
}
