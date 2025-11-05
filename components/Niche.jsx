"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X } from "lucide-react";

const staticIdeas = [
  {
    title: "Behind-the-Scenes Tech Reviews",
    desc: "Show your setup process, unbox gadgets, or reveal what tools make your workflow smoother.",
  },
  {
    title: "Startup Gadget Challenges",
    desc: "Try building something innovative with a specific gadget or tool and share the journey.",
  },
  {
    title: "Tech for Entrepreneurs Series",
    desc: "Create a mini-series exploring how business owners use modern tech to boost productivity.",
  },
  {
    title: "AI Tools You Should Know",
    desc: "Review the latest AI apps and tools that help creators and founders stay ahead.",
  },
  {
    title: "‘What If Tech Ruled’ Scenarios",
    desc: "Make entertaining short videos imagining how everyday life would change with new tech trends.",
  },
];

const questions = [
  {
    question: "Who is your content mainly for?",
    options: [
      "Beginner",
      "Entrepreneurs",
      "Students",
      "Creators",
      "General audience",
    ],
    key: "targetAudience",
  },
  {
    question: "What type of content are you creating?",
    options: [
      "YouTube Shorts",
      "TikTok, Reels",
      "YouTube long-form",
      "Instagram Reels",
    ],
    key: "contentType",
  },
  {
    question: "What’s your main goal with this content?",
    options: [
      "Grow followers fast",
      "Drive traffic to a product",
      "Educate and build authority",
      "Entertain and engage",
    ],
    key: "mainGoal",
  },
  {
    question: "What’s your preferred style?",
    options: [
      "Serious & educational",
      "Fun & relatable",
      "Motivational / emotional",
      "Trendy / storytelling",
    ],
    key: "style",
  },
  {
    question: "What is your current niche?",
    placeholder: "e.g. tech, beauty, real estate, etc.",
    key: "niche",
  },
];

const IdeasTab = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [ideas, setIdeas] = useState(staticIdeas);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setShowModal(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setError("");

    // Automatically go to the next question after selecting an option
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        generateIdeasFromAI();
        setShowModal(false);
      }
    }, 400);
  };

  const handleNext = () => {
    const currentKey = questions[currentStep].key;
    const answer = answers[currentKey];
    if (!answer || answer.trim() === "") {
      setError("Please answer this question before continuing.");
      return;
    }
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateIdeasFromAI();
      setShowModal(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const generateIdeasFromAI = async () => {
    setLoadingAI(true);
    try {
      const resp = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await resp.json();
      if (data.ideas && Array.isArray(data.ideas)) {
        setIdeas(
          data.ideas.map((i) => ({
            title: i.title,
            desc: i.desc,
          }))
        );
      } else {
        console.warn("AI responded without ideas:", data);
        setIdeas(staticIdeas);
      }
    } catch (err) {
      console.error("Error generating via AI:", err);
      setIdeas(staticIdeas);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05010E] text-white px-6 md:px-16 py-16 relative">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-semibold mb-6 bg-gradient-to-r from-orange-400 via-pink-400 to-green-400 text-transparent bg-clip-text"
        >
          💡 Content Ideas for{" "}
          <span className="text-white">Tech Entrepreneurs</span>
        </motion.h1>

        <p className="text-gray-400 max-w-2xl mx-auto mb-12">
          Fresh, scroll-stopping content ideas to help your niche stand out.
          Each idea is designed to drive engagement and grow your audience
          organically.
        </p>

        {loadingAI ? (
          <div className="py-8">Generating AI ideas…</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="p-6 bg-[#1A1029]/60 backdrop-blur-lg rounded-2xl border border-white/10 hover:shadow-[0_0_15px_rgba(241,130,74,0.3)] transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Lightbulb className="text-yellow-400" size={22} />
                  <h3 className="text-lg font-medium">{idea.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{idea.desc}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Questionnaire Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0e041d] border border-white/10 p-8 rounded-2xl w-[90%] sm:w-[500px] shadow-lg relative"
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                onClick={() => setShowModal(false)}
              >
                <X size={18} />
              </button>

              <h2 className="text-xl font-semibold text-center mb-4 text-white">
                Question {currentStep + 1} of {questions.length}
              </h2>
              <p className="text-gray-300 text-center mb-4">
                {questions[currentStep].question}
              </p>

              {questions[currentStep].options ? (
                <div className="flex flex-col gap-3">
                  {questions[currentStep].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        handleAnswer(questions[currentStep].key, option)
                      }
                      className={`px-4 py-3 rounded-xl border border-white/10 bg-[#1A1029] hover:bg-[#25163a] transition text-sm ${
                        answers[questions[currentStep].key] === option
                          ? "border-[#F1824A] text-[#F1824A]"
                          : "text-gray-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder={questions[currentStep].placeholder}
                  value={answers[questions[currentStep].key] || ""}
                  onChange={(e) =>
                    handleAnswer(questions[currentStep].key, e.target.value)
                  }
                  className="w-full bg-[#1A1029] text-gray-200 px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#F1824A]"
                />
              )}

              {error && (
                <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
              )}

              <div className="flex gap-3 mt-6">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="w-1/2 py-3 border border-[#F1824A]/50 rounded-xl text-[#F1824A] font-semibold hover:bg-[#F1824A]/10 transition"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`${
                    currentStep > 0 ? "w-1/2" : "w-full"
                  } py-3 bg-gradient-to-r from-[#F1824A] to-[#9DC88D] rounded-xl text-black font-semibold hover:opacity-90 transition`}
                >
                  {currentStep === questions.length - 1 ? "Submit" : "Next"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IdeasTab;
