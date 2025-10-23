import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLightbulb, FaBullhorn } from "react-icons/fa";

const NicheQuestionnaire: React.FC = () => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedNiche, setGeneratedNiche] = useState<string[]>([]);

  const questions = [
    {
      id: 1,
      icon: <FaUser className="text-[#8b5cf6] text-xl" />,
      question: "Who do you want to create content for?",
      options: ["Entrepreneurs", "Students", "Tech Lovers", "Fitness Enthusiasts"],
    },
    {
      id: 2,
      icon: <FaLightbulb className="text-[#22d3ee] text-xl" />,
      question: "What type of content excites you most?",
      options: ["Tutorials", "Podcasts", "Lifestyle Tips", "Tech Reviews"],
    },
    {
      id: 3,
      icon: <FaBullhorn className="text-[#f59e0b] text-xl" />,
      question: "What’s your main goal as a creator?",
      options: ["Inspire People", "Build a Brand", "Earn Income", "Educate Others"],
    },
  ];

  const handleSelect = (questionIndex: number, option: string) => {
    const updated = [...answers];
    updated[questionIndex] = option;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (answers.length < questions.length) {
      alert("Please answer all questions first.");
      return;
    }

    setLoading(true);
    setGeneratedNiche([]);

    try {
      const response = await fetch("/api/suggest-niche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();
      setGeneratedNiche(data.suggestions || ["No niche found"]);
    } catch (error) {
      console.error(error);
      setGeneratedNiche(["Error generating niche. Try again later."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#05010E] text-white flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-xl w-full bg-[#1a1029] rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Discover Your Perfect Content Niche 🚀
        </h2>

        {questions.map((q, index) => (
          <div key={q.id} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {q.icon}
              <p className="font-medium">{q.question}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((option) => (
                <motion.button
                  key={option}
                  onClick={() => handleSelect(index, option)}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    answers[index] === option
                      ? "bg-[#8b5cf6] border-[#8b5cf6] text-white"
                      : "border-gray-600 text-gray-300 hover:bg-[#2a1f3a]"
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        ))}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 py-3 bg-[#8b5cf6] rounded-lg font-medium hover:bg-[#7c3aed] transition"
        >
          {loading ? "Generating your niche..." : "Generate Niche"}
        </motion.button>

        {generatedNiche.length > 0 && (
          <div className="mt-6 bg-[#2a1f3a] p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Your AI-Powered Suggestions:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {generatedNiche.map((niche, i) => (
                <li key={i}>{niche}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default NicheQuestionnaire;
