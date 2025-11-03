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
    const { data, error } = await auth.api.updateUser({
      body: {
        usageCount: user.usageCount + 1,
      },
      headers: await headers(),
    });
    if (error) {
      throw new Error(error);
    }
    const { prompt, purpose, targetModel } = await req.json();
    if (!prompt || !purpose || !targetModel)
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    console.log({ prompt, purpose });
    if (!["video", "image", "text", "audio"].includes(purpose.toLowerCase())) {
      return NextResponse.json(
        { error: "Valid purpose is required: video, image, text, or audio" },
        { status: 400 }
      );
    }

    const categoryTemplates = {
      video: {
        systemRole:
          "You are a professional AI video prompt engineer specializing in creating detailed, cinematic prompts for video generation models.",
        structure: `Create an enhanced video generation prompts based on the user's input.

PROMPT STRUCTURE:
1. CINEMATIC PROMPT: Focus on visual storytelling, camera movements, lighting, and atmosphere
2. CONCEPTUAL PROMPT: Emphasize abstract ideas, metaphors, and artistic interpretation  
3. PRACTICAL PROMPT: Clear, direct instructions for specific video types (tutorial, explainer, etc.)

Each prompt should include:
- Scene description with visual details
- Camera movements and angles
- Lighting and color palette
- Style references (film genres, artists)
- Mood and atmosphere
- Technical specifications if applicable`,
      },
      image: {
        systemRole:
          "You are an expert AI image prompt engineer with deep knowledge of visual arts, photography, and digital art styles.",
        structure: `Generate a sophisticated image generation prompts with different artistic approaches.

PROMPT STRUCTURE:
1. PHOTOGRAPHIC PROMPT: Realistic photography style with camera specs, lighting, composition
2. ARTISTIC PROMPT: Specific art styles, painterly effects, creative interpretations
3. CONCEPTUAL PROMPT: Abstract ideas, surrealism, imaginative scenes

Each prompt must specify:
- Subject and composition
- Art style or medium (digital painting, oil painting, photo, etc.)
- Lighting conditions and time of day
- Color scheme and mood
- Technical details (resolution, aspect ratio)
- Artist influences or references`,
      },
      text: {
        systemRole:
          "You are a master AI text prompt engineer specializing in crafting precise instructions for language models.",
        structure: `Create an optimized text generation prompts for different use cases.

PROMPT STRUCTURE:
1. CREATIVE PROMPT: Storytelling, creative writing, character development
2. ANALYTICAL PROMPT: Research, analysis, explanation, technical writing
3. PRACTICAL PROMPT: Instructions, emails, business writing, templates

Each prompt should define:
- Desired output format and length
- Tone and style (formal, casual, academic, etc.)
- Key points to cover
- Target audience
- Specific constraints or requirements`,
      },
      audio: {
        systemRole:
          "You are an audio engineering expert specializing in AI music and sound generation prompts.",
        structure: `Generate a detailed audio generation prompts covering different sound types.

PROMPT STRUCTURE:
1. MUSICAL PROMPT: Music composition with genre, instruments, structure
2. SOUNDSCAPE PROMPT: Ambient sounds, environmental audio, background noise
3. EFFECTS PROMPT: Sound effects, vocal processing, audio manipulation

Each prompt must include:
- Genre or sound type
- Instruments or sound sources
- Tempo, rhythm, or duration
- Mood and emotional tone
- Technical specifications (bitrate, format if needed)
- Reference artists or similar sounds`,
      },
    };
    const template = categoryTemplates[purpose];
    const complexityLevels = {
      basic: "Keep prompts simple and straightforward",
      intermediate: "Add moderate detail and creative elements",
      advanced: "Include highly detailed, professional-level specifications",
    };
    const promptTemplate = `
SYSTEM ROLE: ${template.systemRole}

USER'S ORIGINAL INPUT: "${prompt}"
CATEGORY: ${purpose.toUpperCase()} GENERATION
COMPLEXITY: ${"intermediate"}
TARGET MODEL: ${targetModel || "General AI"}

${template.structure}

COMPLEXITY GUIDELINES: ${complexityLevels.intermediate}

ADDITIONAL STYLE PREFERENCES: ${"No specific style provided"}

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "category": "${purpose}",
  "originalInput": "${prompt}",
  "generatedPrompt": 
    {
      "type": "Prompt Type 3",
      "prompt": "Full detailed prompt text here...",
      "useCase": "When to use this prompt", 
      "strengths": ["Strength 1", "Strength 2", "Strength 3"],
      "estimatedTokens": 150,
      "modelOptimized": true
    },
 
}

Ensure each prompt is self-contained and ready to use with AI models.
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
    const result = await model.generateContent(promptTemplate);
    const text = result.response.text();

    console.log("Prompt Generation Raw Response:", text);

    let jsonResponse;
    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
      jsonResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);

      jsonResponse = createFallbackPrompts(prompt, purpose);
    }
    return NextResponse.json(
      {
        message: "Prompt generation successful",
        payload: {
          jsonResponse,
          data,
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
