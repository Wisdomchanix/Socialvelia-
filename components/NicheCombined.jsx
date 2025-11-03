"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, RefreshCcw } from "lucide-react";

const questions = [
  {
    id: 1,
    icon: <Sparkles className="w-5 h-5 text-white" />,
    question: "What type of content excites you the most?",
    options: ["Tech & Gadgets", "Lifestyle", "Entertainment", "Fitness"],
  },
  {
    id: 2,
    icon: <Sparkles className="w-5 h-5 text-white" />,
    question: "Who do you most enjoy helping or inspiring?",
    options: ["Entrepreneurs", "Students", "Gamers", "General Audience"],
  },
  {
    id: 3,
    icon: <Sparkles className="w-5 h-5 text-white" />,
    question: "Which format do you love creating?",
    options: ["Videos", "Articles", "Podcasts", "Tutorials"],
  },
  {
    id: 4,
    icon: <Sparkles className="w-5 h-5 text-white" />,
    question: "What’s your main goal with content creation?",
    options: ["Build a personal brand", "Make money", "Entertain people"],
  },
];

const NicheCombined = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [customAnswer, setCustomAnswer] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingText, setGeneratingText] = useState("");
  const generatingRef = useRef(null);

  useEffect(() => {
    return () => {
      if (generatingRef.current) window.clearInterval(generatingRef.current);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAnswer = (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    setCustomAnswer("");
    if (currentIndex + 1 === questions.length) {
      generateSuggestions(newAnswers);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleAddCustom = () => {
    const text = customAnswer.trim();
    if (!text) return;
    handleAnswer(text);
  };

  const startGeneratingAnimation = () => {
    setGeneratingText("");
    const full = "Generating your perfect niche";
    let i = 0;
    generatingRef.current = window.setInterval(() => {
      if (i <= full.length) {
        setGeneratingText(full.slice(0, i));
        i++;
      } else {
        setGeneratingText((prev) => {
          if (prev.endsWith("...")) return full;
          return prev + ".";
        });
      }
    }, 80);
  };

  const stopGeneratingAnimation = () => {
    if (generatingRef.current) {
      window.clearInterval(generatingRef.current);
      generatingRef.current = null;
    }
    setGeneratingText("");
  };

  const generateSuggestions = async (answers) => {
    setLoading(true);
    startGeneratingAnimation();

    try {
      const resp = await fetch("/api/niche", {
        body: JSON.stringify({ answers }),
        method: "POST",
      });
      const data = await resp.json();
      console.log(data.payload.jsonResponse.niches);
      setSuggestions(data.payload.jsonResponse.niches);
    } catch (error) {
    } finally {
      stopGeneratingAnimation();
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setSuggestions(null);
    setCustomAnswer("");
    stopGeneratingAnimation();
    setLoading(false);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#05010E] text-white flex flex-col items-center px-4 py-8 md:py-12 xl:px-16 xl:py-16">
      <div className="w-full max-w-5xl xl:max-w-6xl relative">
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/8 w-56 h-56 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/6 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-[#0A0219]/80 p-6 md:p-10 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg md:text-2xl font-bold">
                Find your perfect niche
              </h1>
              <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-xl">
                Answer a few quick questions and we’ll suggest tailored content
                niches and ideas.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-white/8 text-sm"
              >
                <RefreshCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!suggestions ? (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                {/* Quiz Section */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#9b5de5] to-[#f72585] flex items-center justify-center text-white">
                        {questions[currentIndex].icon}
                      </div>
                      <div>
                        <h2 className="font-semibold">
                          {questions[currentIndex].question}
                        </h2>
                        <p className="text-xs text-gray-400">
                          Question {currentIndex + 1} of {questions.length}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {questions[currentIndex].options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(opt)}
                          className="text-left py-3 px-4 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-[#9b5de5] hover:to-[#f72585] transition"
                        >
                          {opt}
                        </button>
                      ))}

                      <div className="col-span-1 sm:col-span-2 flex gap-2">
                        <input
                          value={customAnswer}
                          onChange={(e) => setCustomAnswer(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleAddCustom()
                          }
                          placeholder="Can't find your answer? Type it & press Enter"
                          className="flex-1 bg-[#08101a] border border-white/6 rounded-xl px-4 py-3 text-sm placeholder-gray-300"
                        />
                        <button
                          onClick={handleAddCustom}
                          className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#9b5de5] to-[#f72585] text-white disabled:opacity-60"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-72 md:flex-shrink-0">
                    <div className="bg-[#08101a] rounded-xl p-4 border border-white/6">
                      <p className="text-xs text-gray-400 mb-3">Progress</p>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-gradient-to-r from-[#9b5de5] to-[#f72585]"
                          style={{
                            width: `${
                              answers.length > 0
                                ? (answers.length / questions.length) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-300 mt-3">
                        Selected answers
                      </p>
                      <ul className="mt-2 text-xs text-gray-300 space-y-1 max-h-28 overflow-auto pr-2">
                        {answers.length ? (
                          answers.map((a, i) => <li key={i}>• {a}</li>)
                        ) : (
                          <li className="text-gray-500">No answers yet</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="text-sm text-gray-400">
                    Tip: You can add your own answer if it isn't listed.
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (currentIndex > 0) {
                          setCurrentIndex((c) => c - 1);
                          setAnswers((prev) => prev.slice(0, -1));
                        } else resetQuiz();
                      }}
                      className="px-3 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/8"
                    >
                      Back
                    </button>

                    <button
                      onClick={() => {
                        if (currentIndex + 1 === questions.length)
                          generateSuggestions(answers);
                        else setCurrentIndex((c) => c + 1);
                      }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9b5de5] to-[#f72585] text-sm font-medium"
                    >
                      Skip
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <AnimatePresence>
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="py-3 px-4 bg-gradient-to-r from-[#9b5de5]/5 to-[#f72585]/5 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9b5de5] to-[#f72585] font-semibold">
                            {generatingText || "Generating your perfect niche"}
                          </span>
                          <div className="text-xs text-gray-400 mt-1">
                            This only runs locally — replace with your Gemini
                            API later.
                          </div>
                        </div>
                        <div className="text-sm text-gray-300">...</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              // Suggestions Dashboard
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:flex xl:grid-cols-3 gap-6 md:flex-row">
                    {suggestions &&
                      suggestions.map((sug, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-[#081021] p-4 rounded-2xl border border-white/6"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {sug.name}
                              </h3>
                              <p className="text-xs text-gray-300 mt-1">
                                {sug.reason}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    `${sug.name}\n\n${sug.reason}`
                                  )
                                }
                                className="text-xs px-3 py-1 rounded-lg bg-white/5 hover:bg-white/8"
                              >
                                <Copy className="inline w-3 h-3 mr-2" /> Copy
                              </button>
                              <span className="text-xs text-gray-400">
                                Top pick
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="bg-[#070812] p-3 rounded-lg">
                              <p className="text-xs text-gray-400">Trends</p>
                              <ul className="mt-2 text-sm text-gray-200 space-y-1">
                                {sug.trends.map((t, j) => (
                                  <li key={j}>• {t}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-[#070812] p-3 rounded-lg">
                              <p className="text-xs text-gray-400">Audience</p>
                              <ul className="mt-2 text-sm text-gray-200 space-y-1">
                                {sug.audience.map((a, j) => (
                                  <li key={j}>• {a}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-[#070812] p-3 rounded-lg">
                              <p className="text-xs text-gray-400">
                                Content Ideas
                              </p>
                              <ul className="mt-2 text-sm text-gray-200 space-y-1">
                                {sug.ideas.map((i2, j) => (
                                  <li key={j}>• {i2}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NicheCombined;
