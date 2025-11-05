import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { headers } from "next/headers";
import { auth } from "../../../lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function POST(request) {
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
    const { movieQuery, movieId } = await request.json();
    console.log({ movieId, movieQuery });
    let movieData = {};

    if (movieId) {
      movieData = await fetchMovieById(movieId);
    } else if (movieQuery) {
      movieData = await searchMovieByTitle(movieQuery);
    } else {
      return NextResponse.json(
        { error: "Movie ID or query is required" },
        { status: 400 }
      );
    }

    if (!movieData) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    const recap = await generateMovieRecap(movieData);

    return NextResponse.json({
      success: true,
      recap: recap,
      movie: {
        id: movieData.id,
        title: movieData.title,
        overview: movieData.overview,
        runtime: movieData.runtime,
        releaseDate: movieData.release_date,
        posterPath: movieData.poster_path,
        backdropPath: movieData.backdrop_path,
      },
    });
  } catch (error) {
    console.error("Movie recap API error:", error);
    return NextResponse.json(
      { error: "Failed to generate movie recap" },
      { status: 500 }
    );
  }
}

async function fetchMovieById(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie from TMDB");
  }
  const data = await response.json();
  console.log(data);
  return data;
}

async function searchMovieByTitle(query) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      query
    )}&page=1`
  );

  if (!response.ok) {
    throw new Error("Failed to search movies from TMDB");
  }

  const data = await response.json();
  return data.results[0]; // Return first result
}

// Generate movie recap using AI
async function generateMovieRecap(movieData) {
  const { title, overview, runtime } = movieData;
  const totalSeconds = runtime || 120;

  const prompt = `
Create a detailed 5-part timestamped recap for the movie "${title}".

MOVIE OVERVIEW:
${overview || "Overview not provided"}

RUNTIME: ${totalSeconds} minutes

Create a compelling scene-by-scene breakdown with precise timestamps. Each segment should:

- Advance the main plot
- Highlight character development
- Maintain narrative flow
- Use engaging, cinematic language

Format each segment exactly like: 
[00:00–02:30] Description of what happens...
[10:25–40:30] Description of what happens...

Rules:
1. Use the EXACT timestamps format above - DO NOT change them
2. Each line must start with the timestamp in square brackets
3. Write sentences per segment describing key events
4. No extra text before or after the segment lines
5. Keep descriptions concise and focused on major plot points
Make the recap detailed enough to understand the story structure.
`;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 1024,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  console.log(text);
  // Clean the response
  return text.replace(/```json\n?|\n?```/g, "").trim();
}
