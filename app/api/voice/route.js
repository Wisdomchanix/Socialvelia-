import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";
import convertAudio from "../../../lib/model/tts";
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
    const { text } = await req.json();
    if (!text)
      return NextResponse.json({ error: "Missing required parameters" });
    const audioBlob = await convertAudio({ text });
    return new NextResponse(audioBlob, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="voiceover.mp3"',
      },
    });
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
