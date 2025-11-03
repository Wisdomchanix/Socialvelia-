"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Mic, Target, Sparkles } from "lucide-react";


const questions = [
  {
    id: 1,
    icon: <BookOpen className="w-6 h-6 text-[#9b5de5]" />,
    question: "What type of content excites you the most?",
    options: ["Tech & Gadgets", "Lifestyle", "Finance", "Entertainment", "Education", "Fitness"],
  },
  {
    id: 2,
    icon: <Users className="w-6 h-6 text-[#f72585]" />,
    question: "Who do you most enjoy helping or inspiring?",
    options: ["Entrepreneurs", "Students", "Gamers", "Homeowners", "Artists", "General Audience"],
  },
  {
    id: 3,
    icon: <Mic className="w-6 h-6 text-[#9b5de5]" />,
    question: "Which format do you love creating?",
    options: ["Videos", "Articles", "Podcasts", "Graphics & Memes", "Tutorials"],
  },
  {
    id: 4,
    icon: <Target className="w-6 h-6 text-[#f72585]" />,
    question: "What’s your main goal with content creation?",
    options: [
      "Build a personal brand",
      "Make money",
      "Educate others",
      "Entertain people",
      "Inspire others",
    ],
  },
];


const NicheQuestionnaire = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (option) => {
    const newAnswers = [...answers, option];
    if (currentIndex + 1 === questions.length) {
      callSuggestionApi(newAnswers);
    } else {
      setAnswers(newAnswers);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const callSuggestionApi = async (answers) => {
    setLoading(true);
    try {
      const res = await fetch("/api/suggest-niche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      if (data.niches && Array.isArray(data.niches)) {
        setSuggestions(data.niches);
        // Save the top suggestion in Firestore
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, "users", user.uid);
          await setDoc(userDoc, { chosenNiche: data.niches[0].name }, { merge: true });
        }
      } else {
        // fallback
        setSuggestions([
          { name: "Personal Growth", reason: "Fallback suggestion" },
          { name: "Lifestyle Branding", reason: "Fallback suggestion" },
        ]);
      }
    } catch (error) {
      console.error("Suggestion API error:", error);
      setSuggestions([
        { name: "Personal Growth", reason: "Fallback suggestion" },
        { name: "Lifestyle Branding", reason: "Fallback suggestion" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setSuggestions(null);
  };

  return (
    <div className="min-h-screen bg-[#05010E] text-white flex flex-col items-center justify-center px-6 py-10 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-[#0A0219]/80 p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md relative z-10">
        <AnimatePresence mode="wait">
          {!suggestions ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3 justify-center mb-4">
                {questions[currentIndex].icon}
                <h2 className="text-1xl font-semibold text-center">
                  {questions[currentIndex].question}
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {questions[currentIndex].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option)}
                    className="py-3 px-4 rounded-lg bg-white/5 hover:bg-gradient-to-r hover:from-[#9b5de5] hover:to-[#f72585] transition-all duration-300 text-gray-300 hover:text-white text-left"
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-[#9b5de5] to-[#f72585]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2 text-center">
                  Question {currentIndex + 1} of {questions.length}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f72585]" /> Your Suggested Niches
              </h2>
              {loading ? (
                <p className="text-gray-400">Thinking…</p>
              ) : (
                <div className="flex flex-col gap-3 mb-6">
                  {suggestions.map((sug, i) => (
                    <div
                      key={i}
                      className="py-3 bg-gradient-to-r from-[#9b5de5]/20 to-[#f72585]/20 border border-white/10 rounded-lg text-white font-medium"
                    >
                      <strong>{sug.name}</strong>
                      <div className="text-xs text-gray-300 mt-1">
                        {sug.reason}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => navigate("/niche")}
                className="w-full py-3 bg-gradient-to-r from-[#9b5de5] to-[#f72585] rounded-lg font-semibold hover:opacity-90 transition"
              >
                Continue to Niche Page
              </button>

              <button
                onClick={resetQuiz}
                className="w-full mt-3 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-white/10 transition"
              >
                Retake Questionnaire
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NicheQuestionnaire;
