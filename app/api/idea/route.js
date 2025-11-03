import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";

const Ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const POST = async (req) => {
  try {
    //  const session = await auth.api.getSession({ headers: await headers() });
    //  console.log({ session });
    //
    //  if (!session) {
    //    return NextResponse.json(
    //      { error: "Please login to proceed" },
    //      { status: 401 }
    //    );
    //  }

    //const user = session.user;

    // if (user.plan === "free" && user.usageCount >= 2) {
    //   return NextResponse.json(
    //     { error: "Free usage exceeded" },
    //     { status: 403 }
    //   );
    // }

    const { answers } = await req.json();

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Answers array is required" },
        { status: 400 }
      );
    }

    const prompt = `
You are a YouTube content strategist specializing in faceless channels. Analyze the user's answers about their interests, skills, and preferences to generate specific content ideas across multiple niches that would work well for them.

USER'S BACKGROUND AND PREFERENCES:
${answers.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Generate 8-12 specific, actionable content ideas across 2-3 different niches that match their profile. The ideas should be tailored to their specific interests and skills mentioned in their answers.

CRITERIA FOR FACELESS CONTENT IDEAS:
- No personal appearance required
- Can use voiceover, stock footage, animations, or screen recordings
- Evergreen content potential
- Monetization friendly
- Searchable and discoverable
- Must directly relate to their expressed interests and skills

For each idea, provide:
1. A catchy, SEO-friendly title
2. The niche/category it belongs to
3. Specific content format
4. Why it matches their profile
5. Target audience
6. Production difficulty
7. Monetization strategies

Respond ONLY with valid JSON in this exact format:
{
  "ideas": [
    {
      "title": "Catchy, SEO-friendly title",
      "niche": "Specific niche category",
      "description": "Brief description of the video content",
      "whyItFits": "Explanation of how this matches their specific answers",
      "format": "Tutorial/Explainer/List/Review/Comparison/Storytelling/Documentary",
      "targetAudience": ["Specific audience segments"],
      "productionDifficulty": "Easy/Medium/Hard",
      "viralityPotential": "Low/Medium/High",
      "monetizationStrategies": ["Adsense", "Affiliate marketing", "Sponsorships", "Digital products"],
      "estimatedViews": "Low (1-10k)/Medium (10-100k)/High (100k+)",
      "searchVolume": "Low/Medium/High",
      "tags": ["relevant", "tags", "for", "seo"],
      "scriptOutline": ["Key points to cover in the video"],
      "thumbnailIdeas": ["Visual concepts for thumbnails"]
    }
  ],
  "recommendedNiches": [
    {
      "name": "Niche Name",
      "reason": "Why this niche fits their profile",
      "growthPotential": "High/Medium/Low",
      "competitionLevel": "High/Medium/Low"
    }
  ],
  "contentStrategy": {
    "topNiches": ["Primary niche recommendations based on their answers"],
    "contentPillars": ["Main themes to focus on based on their interests"],
    "postingFrequency": "Recommended posting schedule",
    "channelGrowthTips": ["Specific tips tailored to their profile"],
    "equipmentNeeded": ["Basic equipment requirements based on content types"]
  }
}
`;

    const model = Ai.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    //  const { data, error } = await auth.api.updateUser({
    //    body: {
    //      usageCount: user.usageCount + 1,
    //    },
    //    headers: await headers(),
    //  });

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

      jsonResponse = createFallbackIdeas(answers);
    }

    return NextResponse.json(
      {
        message: "Success generating content ideas",
        payload: {
          ideas: jsonResponse.ideas || [],
          recommendedNiches: jsonResponse.recommendedNiches || [],
          contentStrategy: jsonResponse.contentStrategy || {},
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

function createFallbackIdeas(answers) {
  const answerText = answers.join(" ").toLowerCase();

  let detectedInterests = [];

  if (
    answerText.includes("tech") ||
    answerText.includes("programming") ||
    answerText.includes("computer")
  ) {
    detectedInterests.push("Technology");
  }
  if (
    answerText.includes("cook") ||
    answerText.includes("food") ||
    answerText.includes("recipe")
  ) {
    detectedInterests.push("Cooking");
  }
  if (
    answerText.includes("finance") ||
    answerText.includes("money") ||
    answerText.includes("invest")
  ) {
    detectedInterests.push("Personal Finance");
  }
  if (
    answerText.includes("travel") ||
    answerText.includes("adventure") ||
    answerText.includes("culture")
  ) {
    detectedInterests.push("Travel");
  }
  if (
    answerText.includes("game") ||
    answerText.includes("gaming") ||
    answerText.includes("esports")
  ) {
    detectedInterests.push("Gaming");
  }
  if (
    answerText.includes("educat") ||
    answerText.includes("learn") ||
    answerText.includes("teach")
  ) {
    detectedInterests.push("Education");
  }

  // Default niches if no specific interests detected
  if (detectedInterests.length === 0) {
    detectedInterests = [
      "Personal Development",
      "How-To Guides",
      "Educational Content",
    ];
  }

  const fallbackIdeas = [];

  detectedInterests.forEach((niche) => {
    const nicheIdeas = generateNicheIdeas(niche, answers);
    fallbackIdeas.push(...nicheIdeas);
  });

  return {
    ideas: fallbackIdeas.slice(0, 8),
    recommendedNiches: detectedInterests.map((niche) => ({
      name: niche,
      reason: `Matches your interests in ${niche.toLowerCase()}`,
      growthPotential: "Medium",
      competitionLevel: "Medium",
    })),
    contentStrategy: {
      topNiches: detectedInterests.slice(0, 3),
      contentPillars: detectedInterests,
      postingFrequency: "2-3 times per week",
      channelGrowthTips: [
        "Focus on your strongest interests from the answers",
        "Create content that combines multiple interests",
        "Engage with communities related to your topics",
      ],
      equipmentNeeded: [
        "Good microphone",
        "Video editing software",
        "Screen recording tool",
      ],
    },
  };
}

function generateNicheIdeas(niche, answers) {
  const ideaTemplates = {
    Technology: [
      {
        title: `5 ${niche} Tools That Will Save You Hours Every Week`,
        description: `Essential tools and software for productivity in ${niche}`,
        niche: niche,
        whyItFits:
          "Leverages your technical interests and problem-solving skills",
        format: "Tutorial",
        targetAudience: ["Professionals", "Students", "Tech enthusiasts"],
        productionDifficulty: "Easy",
        viralityPotential: "High",
        monetizationStrategies: [
          "Adsense",
          "Affiliate marketing",
          "Sponsorships",
        ],
        estimatedViews: "Medium",
        searchVolume: "High",
        tags: [niche.toLowerCase(), "tools", "productivity", "software"],
        scriptOutline: [
          "Introduction",
          "Tool 1 overview",
          "Tool 2 features",
          "Comparison",
          "Conclusion",
        ],
        thumbnailIdeas: [
          "Tools collage",
          "Before/after productivity",
          "Software interfaces",
        ],
      },
    ],
    "Personal Finance": [
      {
        title: `How I Saved $10,000 in One Year Using These ${niche} Strategies`,
        description: `Practical money-saving strategies for beginners`,
        niche: niche,
        whyItFits:
          "Matches your interest in financial growth and practical skills",
        format: "Explainer",
        targetAudience: ["Young adults", "Beginners", "Budget-conscious"],
        productionDifficulty: "Easy",
        viralityPotential: "Medium",
        monetizationStrategies: [
          "Adsense",
          "Affiliate marketing",
          "Digital products",
        ],
        estimatedViews: "High",
        searchVolume: "High",
        tags: [niche.toLowerCase(), "saving", "budgeting", "money tips"],
        scriptOutline: [
          "Personal story",
          "Strategy 1",
          "Strategy 2",
          "Results",
          "Action steps",
        ],
        thumbnailIdeas: [
          "Money stack growing",
          "Piggy bank",
          "Chart showing savings growth",
        ],
      },
    ],
    Cooking: [
      {
        title: `3 Easy ${niche} Recipes for Complete Beginners`,
        description: `Simple recipes that anyone can make with basic ingredients`,
        niche: niche,
        whyItFits:
          "Combines your interest in cooking with practical, shareable content",
        format: "Tutorial",
        targetAudience: ["Beginners", "Busy people", "Food enthusiasts"],
        productionDifficulty: "Medium",
        viralityPotential: "Medium",
        monetizationStrategies: ["Adsense", "Affiliate marketing", "Cookbook"],
        estimatedViews: "Medium",
        searchVolume: "High",
        tags: [niche.toLowerCase(), "recipes", "cooking", "beginners"],
        scriptOutline: [
          "Introduction",
          "Recipe 1 step-by-step",
          "Recipe 2 demonstration",
          "Tips and tricks",
        ],
        thumbnailIdeas: [
          "Finished dishes",
          "Cooking process",
          "Ingredients spread",
        ],
      },
    ],
    Education: [
      {
        title: `The Ultimate Beginner's Guide to ${niche}`,
        description: `Comprehensive introduction to essential concepts in ${niche}`,
        niche: niche,
        whyItFits: "Uses your teaching/learning interests to help others",
        format: "Educational",
        targetAudience: ["Students", "Curious learners", "Beginners"],
        productionDifficulty: "Medium",
        viralityPotential: "Medium",
        monetizationStrategies: [
          "Adsense",
          "Affiliate marketing",
          "Online courses",
        ],
        estimatedViews: "Medium",
        searchVolume: "Medium",
        tags: [niche.toLowerCase(), "education", "learning", "beginners"],
        scriptOutline: [
          "What is it",
          "Key concepts",
          "Practical applications",
          "Next steps",
        ],
        thumbnailIdeas: [
          "Concept illustration",
          "Learning path graphic",
          "Before/after knowledge",
        ],
      },
    ],
  };

  return (
    ideaTemplates[niche] || [
      {
        title: `Getting Started with ${niche}: A Complete Beginner's Guide`,
        description: `Learn the fundamentals of ${niche} from scratch`,
        niche: niche,
        whyItFits:
          "Matches your expressed interests and provides valuable learning content",
        format: "Explainer",
        targetAudience: ["Beginners", "Enthusiasts", "Curious learners"],
        productionDifficulty: "Medium",
        viralityPotential: "Medium",
        monetizationStrategies: ["Adsense", "Affiliate marketing"],
        estimatedViews: "Medium",
        searchVolume: "Medium",
        tags: [niche.toLowerCase(), "beginners", "guide", "how-to"],
        scriptOutline: [
          "Introduction to topic",
          "Basic concepts",
          "Getting started steps",
          "Common mistakes",
          "Next level",
        ],
        thumbnailIdeas: [
          "Concept visualization",
          "Step-by-step graphic",
          "Beginner-friendly imagery",
        ],
      },
    ]
  );
}
