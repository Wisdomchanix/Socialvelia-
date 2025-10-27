import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Copy, Loader2, User } from "lucide-react";

const PromptTab: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setShowChat(true);

    const originalPrompt = prompt;
    setPrompt("");

    // Simulate AI generation delay
    setTimeout(() => {
      setRefinedPrompt(
        `Here’s a refined version of your prompt:\n"${originalPrompt}" → "Generate a detailed and engaging post about ${originalPrompt.toLowerCase()} that captures audience attention."`
      );
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(refinedPrompt);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  return (
    <div className="text-white min-h-screen flex flex-col bg-[#05010E] overflow-hidden relative">
      {/* Title */}
      <div className="pb-3 sm:pb-4 mb-2 sm:mb-4">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-center text-white px-2">
          AI Prompt Generator
        </h2>
      </div>

      {/* Gradient Circle Background */}
      <svg
        className="absolute top-0 right-0 w-[120%] sm:w-3/4 md:w-2/3 opacity-10 pointer-events-none"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#7209b7" />
            <stop stopColor="#f72585" offset="1" />
          </linearGradient>
        </defs>
        <circle
          cx="300"
          cy="300"
          r="280"
          stroke="url(#grad)"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      {/* Chat Section */}
      <div className="flex-1 overflow-y-auto space-y-4 px-3 sm:px-6 md:px-12 scrollbar-hide">
        {showChat && (
          <div className="flex flex-col space-y-6 pb-24 sm:pb-28">
            {/* User Message */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="self-end bg-[#1a1029] rounded-2xl px-3 sm:px-4 py-3 max-w-[90%] sm:max-w-md md:max-w-lg shadow-md"
            >
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-[#9DC88D]" />
                <span className="text-xs sm:text-sm font-semibold">You</span>
              </div>
              <p className="text-gray-200 text-xs sm:text-sm md:text-base break-words">
                {prompt}
              </p>
            </motion.div>

            {/* AI Message */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="self-start bg-[#1a1029] rounded-2xl px-3 sm:px-4 py-3 max-w-[90%] sm:max-w-md md:max-w-lg shadow-md"
            >
              <div className="flex items-center gap-2 mb-1">
                <Bot className="w-4 h-4 text-[#F1824A]" />
                <span className="text-xs sm:text-sm font-semibold">AI</span>
              </div>

              {isGenerating ? (
                <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm md:text-base">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating refined prompt...</span>
                </div>
              ) : (
                <>
                  <p className="text-gray-200 text-xs sm:text-sm md:text-base whitespace-pre-line break-words">
                    {refinedPrompt}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="mt-2 sm:mt-3 flex items-center gap-1 text-[#9DC88D] hover:text-white transition text-xs sm:text-sm md:text-base"
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" /> Copy Prompt
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="fixed bottom-15 left-0 right-0 bg-[#05010E]/90 backdrop-blur-md px-3 sm:px-6 md:px-12 py-2 sm:py-3 border-t border-[#1a1029]">
        <div className="relative w-full max-w-4xl mx-auto">
          <textarea
            ref={textareaRef}
            placeholder="Write a prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            className="w-full resize-none outline-none bg-[#1a1029] rounded-2xl px-3 sm:px-4 py-3 sm:py-4 pr-12 text-xs sm:text-sm md:text-base text-white focus:outline-none placeholder-gray-400 max-h-40 overflow-y-auto scrollbar-none"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="absolute right-4 bottom-5 sm:bottom-7 text-[#9DC88D] hover:text-white transition disabled:opacity-60"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptTab;
