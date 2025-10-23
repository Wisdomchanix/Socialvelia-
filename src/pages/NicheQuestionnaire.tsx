import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Flame, Brain, Users } from "lucide-react";

const NicheQuestionnaire: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    passion: "",
    skills: "",
    audience: "",
  });
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = [
    {
      key: "passion",
      label: "What topics are you passionate about?",
      icon: <Flame className="text-orange-400 w-6 h-6" />,
      options: [
        "Technology & AI",
        "Fashion & Beauty",
        "Fitness & Wellness",
        "Food & Cooking",
        "Travel & Adventure",
      ],
    },
    {
      key: "skills",
      label: "What skills or knowledge do you already have?",
      icon: <Brain className="text-purple-400 w-6 h-6" />,
      options: [
        "Writing / Storytelling",
        "Design / Creativity",
        "Marketing / Strategy",
        "Video Editing / Content Creation",
        "Software Development / Tech",
      ],
    },
    {
      key: "audience",
      label: "Who do you want to help or reach with your content?",
      icon: <Users className="text-green-400 w-6 h-6" />,
      options: [
        "Business Owners / Startups",
        "Students / Learners",
        "Professionals / Freelancers",
        "Lifestyle Enthusiasts",
        "Tech Lovers / Innovators",
      ],
    },
  ];

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      await generateSuggestion();
    }
  };

  const handleOptionClick = (option: string) => {
    setAnswers({ ...answers, [questions[step].key]: option });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({ ...answers, [questions[step].key]: e.target.value });
  };

  const generateSuggestion = async () => {
    setLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const res = await fetch("api/suggest-niche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!res.ok) throw new Error("Failed to generate niche suggestion");

      const data = await res.json();
      setSuggestion(data.suggestion || "Could not generate a niche suggestion.");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({ passion: "", skills: "", audience: "" });
    setSuggestion(null);
    setError(null);
  };

  const currentQuestion = questions[step];

  return (
    <section className="min-h-screen bg-[#05010E] text-white flex flex-col items-center justify-center px-6">
      <motion.div
        className="bg-[#1a1029] p-6 rounded-2xl shadow-lg w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 🔄 Loading */}
        {loading && (
          <motion.div
            key="loading"
            className="flex flex-col items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="animate-spin h-8 w-8 mb-4 text-purple-400" />
            <p className="text-lg text-gray-300">Generating your niche...</p>
          </motion.div>
        )}

        {/* ✅ Suggestion result */}
        {!loading && suggestion && (
          <motion.div
            key="result"
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-semibold mb-3 text-purple-400">
              Your Suggested Niche
            </h3>
            <p className="bg-[#10071f] p-4 rounded-lg border border-purple-500/40 text-gray-200">
              {suggestion}
            </p>
            <button
              onClick={handleRestart}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 transition rounded-lg p-3 font-medium"
            >
              Start Over
            </button>
          </motion.div>
        )}

        {/* ❓ Question Section */}
        {!suggestion && !loading && (
          <>
            <div className="flex items-center justify-center gap-2 mb-4">
              {currentQuestion.icon}
              <h2 className="text-xl font-semibold">
                {currentQuestion.label}
              </h2>
            </div>

            {/* Option buttons */}
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  className={`p-3 rounded-lg border transition ${
                    answers[currentQuestion.key as keyof typeof answers] ===
                    option
                      ? "bg-purple-600 border-purple-500"
                      : "bg-transparent border-gray-600 hover:border-purple-500"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {/* Custom input */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">
                Or type your own answer:
              </p>
              <input
                type="text"
                value={
                  answers[currentQuestion.key as keyof typeof answers] || ""
                }
                onChange={handleChange}
                placeholder="Type your answer..."
                className="w-full p-3 bg-transparent border border-gray-500 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={handleNext}
              disabled={
                !answers[currentQuestion.key as keyof typeof answers].trim()
              }
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 transition rounded-lg p-3 font-medium disabled:opacity-40"
            >
              {step === questions.length - 1 ? "Generate Niche" : "Next"}
            </button>
          </>
        )}

        {/* ⚠️ Error message */}
        {error && (
          <div className="mt-4 text-red-400">
            <p>{error}</p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default NicheQuestionnaire;
