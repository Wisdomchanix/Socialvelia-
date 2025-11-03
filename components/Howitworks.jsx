"use client";

import React, { useRef } from "react";
import { FaUserPlus, FaBoxOpen, FaChartLine, FaRocket } from "react-icons/fa";
import { useEffect } from "react";

const steps = [
  {
    id: 1,
    title: "Choose a Niche",
    icon: <FaUserPlus size={28} />,
  },
  {
    id: 2,
    title: "Generate content ideas",
    icon: <FaBoxOpen size={28} />,
  },
  {
    id: 3,
    title: "Write prompts & create voiceover",
    icon: <FaChartLine size={28} />,
  },
  {
    id: 4,
    title: "Monetize & grow audience",
    icon: <FaRocket size={28} />,
  },
];

const Howitworks = () => {
  const scrollRevealInitialized = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined" && !scrollRevealInitialized.current) {
      const initializeScrollReveal = async () => {
        try {
          const ScrollReveal = (await import("scrollreveal")).default;

          ScrollReveal().reveal(".howcard", {
            duration: 1500,
            distance: "60px",
            origin: "bottom",
            easing: "ease-in-out",
            // Add more options as needed
          });

          scrollRevealInitialized.current = true;
        } catch (error) {
          console.error("Failed to initialize ScrollReveal:", error);
        }
      };

      initializeScrollReveal();
    }
  }, []);

  return (
    <section
      className="py-20 bg-gray-50 dark:bg-[#0B001A] text-center transition-colors duration-500"
      id="How it Works"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          How it works
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-3 mb-12 max-w-2xl mx-auto transition-colors duration-300">
          Everything you need to create viral content and grow your audience —
          all in one powerful platform.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`relative rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 howcard
              bg-white dark:bg-[#140A25] transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
                ${
                  step.id === 2 || step.id === 4
                    ? "before:absolute before:inset-0 before:rounded-2xl before:p-[2px] before:bg-gradient-to-r before:from-pink-500 before:via-purple-500 before:to-blue-500 before:blur-md before:opacity-50 before:content-['']"
                    : ""
                }`}
            >
              {/* Gradient glow layer fix (keeps content above glow) */}
              <div className="relative z-10 flex flex-col items-center ">
                <div className="bg-black dark:bg-gradient-to-br dark:from-purple-600 dark:to-pink-600 text-white w-12 h-12 flex items-center justify-center rounded-xl mb-4 transition-colors duration-300">
                  {step.icon}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base font-medium leading-relaxed transition-colors duration-300">
                  {step.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Howitworks;
