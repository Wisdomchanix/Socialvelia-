import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Loader2, Copy } from "lucide-react";

const RecapTab = () => {
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recap, setRecap] = useState(null);
  const [expandedMovie, setExpandedMovie] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFetchMovies = async ({ genre, year, page = 1 }) => {
    const TMDB_BASE_URL = "https://api.themoviedb.org/3";
    const genreIds = {
      action: 28,
      adventure: 12,
      animation: 16,
      comedy: 35,
      crime: 80,
      documentary: 99,
      drama: 18,
      family: 10751,
      fantasy: 14,
      history: 36,
      horror: 27,
      music: 10402,
      mystery: 9648,
      romance: 10749,
      "sci-fi": 878,
      "tv movie": 10770,
      thriller: 53,
      war: 10752,
      western: 37,
    };

    if (!genre || !year) {
      alert("Please select a genre and year.");
      return;
    }

    setLoading(true);
    try {
      const genreId = genreIds[genre.toLowerCase()];

      if (!genreId) throw new Error(`Invalid genre: ${genre}`);

      const url = `${TMDB_BASE_URL}/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=${genreId}&primary_release_year=${year}&page=${page}&sort_by=popularity.desc`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`TMDB API error: ${response.status}`);

      const data = await response.json();
      console.log("TMDB Response:", data);

      const formattedMovies = data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        year: movie.release_date
          ? movie.release_date.substring(0, 4)
          : "Unknown",
        rating: movie.vote_average,
        voteCount: movie.vote_count,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
      }));

      setMovies(formattedMovies);
    } catch (error) {
      console.error("Fetch error:", error);
      alert(`Error fetching movies: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRecap = async (movie) => {
    setSelectedMovie(movie);
    setLoading(true);
    setRecap(null);
    try {
      const resp = await fetch("/api/recap", {
        method: "POST",
        body: JSON.stringify({ movieId: movie.id }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error);
      }
      console.log("Movie data: ", data);
      setRecap(data.recap);
    } catch (error) {
      alert(error.message || error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRecap = () => {
    if (!recap) return;
    const cleanedRecap = recap.replace(/\[\d{2}:\d{2}–\d{2}:\d{2}\]\s*/g, "");
    navigator.clipboard.writeText(cleanedRecap);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#05010E] text-white px-6 md:px-16 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-semibold mb-6 bg-gradient-to-r from-[#9b5de5] via-[#f72585] to-[#F1824A] text-transparent bg-clip-text"
        >
          🎬 AI Movie Recap Generator
        </motion.h1>

        <p className="text-gray-400 max-w-2xl mx-auto mb-10">
          Instantly generate captivating movie recaps and storytelling scripts
          for your YouTube or TikTok videos.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1A1029]/70 backdrop-blur-lg rounded-2xl border border-white/10 p-8 shadow-lg"
        >
          {!selectedMovie && (
            <div className="flex flex-col gap-5 mb-6">
              <div>
                <label className="block text-gray-300 mb-2">Select Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-[#0E071A] border border-white/10 rounded-lg px-4 py-3 text-gray-200"
                >
                  <option value="">-- Choose Genre --</option>
                  <option value="Action">Action</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Horror">Horror</option>
                  <option value="Romance">Romance</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Select Year</label>
                <input
                  type="number"
                  min="1995"
                  max="2025"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#0E071A] border border-white/10 rounded-lg px-4 py-3 text-gray-200"
                  placeholder="From 1995 till date"
                />
              </div>

              <button
                onClick={() => handleFetchMovies({ genre, year })}
                className="mt-4 px-5 py-3 bg-gradient-to-r from-[#9b5de5] to-[#f72585] rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <PlayCircle size={18} />
                    Fetch Movies
                  </>
                )}
              </button>
            </div>
          )}

          {!selectedMovie && movies.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {movies.map((movie, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setExpandedMovie(
                      expandedMovie === movie.title ? null : movie.title
                    )
                  }
                  className="relative bg-[#0E071A]/60 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-[#f72585]/70 transition-all duration-300"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-lg font-semibold text-white">
                      {movie.title} ({movie.year})
                    </h3>
                    {expandedMovie === movie.title && (
                      <div className="mt-3 flex justify-between items-center">
                        <a
                          href="#"
                          className="text-[#9b5de5] hover:underline text-sm"
                        >
                          Find & Download
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRecap(movie);
                          }}
                          className="bg-[#f72585] px-3 py-1 rounded-lg text-sm hover:bg-[#f72585]/80 transition"
                        >
                          Recap Movie
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedMovie && (
            <div className="mt-8 text-left">
              <h2 className="text-2xl font-semibold text-[#F1824A] mb-4">
                Recap for: {selectedMovie.title}
              </h2>
              {loading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="animate-spin text-[#f72585]" size={32} />
                </div>
              ) : recap ? (
                <div>
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={handleCopyRecap}
                      className="flex items-center gap-2 text-sm text-[#9b5de5] hover:text-[#f72585] transition"
                    >
                      <Copy size={16} />
                      {copied ? "Copied!" : "Copy Recap"}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-gray-300 text-sm bg-[#0E071A]/60 p-4 rounded-lg border border-white/10">
                    {recap}
                  </pre>
                </div>
              ) : null}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RecapTab;
