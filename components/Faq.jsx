"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import {
  FaRobot,
  FaMicrophoneAlt,
  FaChartLine,
  FaPenFancy,
} from "react-icons/fa";

const faqs = [
  {
    question: "What is Social Velia?",
    answer:
      "Social Velia helps creators and entrepreneurs find viral ideas, write smarter prompts, generate AI voiceovers, and track niche trends — all in one platform.",
  },
  {
    question: "Do I need any prior experience?",
    answer:
      "Nope! The tools are designed for everyone — from beginners to professional creators who want to scale their content faster.",
  },
  {
    question: "Can I use it on mobile?",
    answer:
      "Yes, Social Velia works seamlessly across all devices — mobile, tablet, and desktop.",
  },
  {
    question: "How does the Prompt Writing Assistant work?",
    answer:
      "It uses AI to generate context-aware prompts that help you craft high-performing content ideas in seconds.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Absolutely. You can explore all major features during our free trial before upgrading to a paid plan.",
  },
];

const Faq = () => {
  const scrollRevealInitialized = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined" && !scrollRevealInitialized.current) {
      const initializeScrollReveal = async () => {
        try {
          const ScrollReveal = (await import("scrollreveal")).default;

          ScrollReveal().reveal(".faqcard", {
            duration: 1500,
            distance: "60px",
            origin: "bottom",
            easing: "ease-in-out",
            reset: true,
            interval: 200,
          });

          scrollRevealInitialized.current = true;
        } catch (error) {
          console.error("Failed to initialize ScrollReveal:", error);
        }
      };

      initializeScrollReveal();
    }
  }, []);

  const [activeIndex, setActiveIndex] = useState(null);
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-white text-gray-900 dark:bg-[#05010E] dark:text-white py-24 px-6 md:px-16 lg:px-28 transition-colors duration-500"
    >
      {/* Background visuals (only in dark mode) */}
      <div className="absolute inset-0 hidden dark:block">
        <svg
          className="absolute top-0 left-1/2 -translate-x-1/2 opacity-20"
          width="800"
          height="800"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="400"
            cy="400"
            r="300"
            stroke="url(#grad1)"
            strokeWidth="1.5"
          />
          <circle
            cx="400"
            cy="400"
            r="200"
            stroke="url(#grad1)"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="800" y2="800">
              <stop offset="0%" stopColor="#9D72FF" />
              <stop offset="100%" stopColor="#F36AFF" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-[#9D72FF]/20 via-transparent to-transparent blur-[100px]" />
      </div>

      {/* Section Header */}
      <div className="relative text-center mb-14 z-10">
        <HelpCircle className="mx-auto text-[#9D72FF] mb-4" size={42} />
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9D72FF] to-[#F36AFF] dark:text-white dark:bg-none">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          Get quick answers to everything you need to know about Social Velia.
        </p>
      </div>

      {/* FAQ Cards */}
      <div className="relative max-w-3xl mx-auto space-y-4 z-10">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faqcard border rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-md backdrop-blur-md ${
              activeIndex === index
                ? "border-[#9D72FF] bg-[#F7F4FF] dark:bg-[#0E021B]/60"
                : "border-gray-200 bg-gray-50 hover:border-[#9D72FF]/50 dark:border-[#1F0C35] dark:bg-[#0E021B]/60 dark:hover:border-[#9D72FF]/50"
            }`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
                {faq.question}
              </h3>
              {activeIndex === index ? (
                <ChevronUp className="text-[#9D72FF]" />
              ) : (
                <ChevronDown className="text-gray-400" />
              )}
            </div>

            {activeIndex === index && (
              <div className="mt-3 transition-all duration-300 ease-in-out">
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating Icons for Light Mode */}
      <div className="block dark:hidden absolute top-12 right-16 text-[#9D72FF]/40 animate-bounce-slow drop-shadow-lg">
        <FaRobot size={26} />
      </div>
      <div className="block dark:hidden absolute bottom-12 left-16 text-[#F36AFF]/40 animate-bounce-slow delay-150 drop-shadow-lg">
        <FaMicrophoneAlt size={26} />
      </div>
      <div className="block dark:hidden absolute top-1/3 left-10 text-[#9D72FF]/40 animate-bounce-slow delay-300 drop-shadow-lg">
        <FaChartLine size={24} />
      </div>
      <div className="block dark:hidden absolute bottom-1/3 right-12 text-[#F36AFF]/40 animate-bounce-slow delay-500 drop-shadow-lg">
        <FaPenFancy size={24} />
      </div>

      {/* Floating Icons for Dark Mode */}
      <div className="hidden dark:block absolute top-12 right-16 text-[#F36AFF] animate-bounce-slow">
        <FaRobot size={26} />
      </div>
      <div className="hidden dark:block absolute bottom-12 left-16 text-[#9D72FF] animate-bounce-slow delay-150">
        <FaMicrophoneAlt size={26} />
      </div>
      <div className="hidden dark:block absolute top-1/3 left-10 text-[#F36AFF] animate-bounce-slow delay-300">
        <FaChartLine size={24} />
      </div>
      <div className="hidden dark:block absolute bottom-1/3 right-12 text-[#9D72FF] animate-bounce-slow delay-500">
        <FaPenFancy size={24} />
      </div>

      {/* Custom slow bounce animation */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Faq;
