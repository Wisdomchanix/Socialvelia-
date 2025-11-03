"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaFireAlt,
  FaRobot,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";

const features = [
  {
    id: 1,
    title: "Niche Selection",
    description:
      "Discover profitable niches tailored to your interests and goals.",
    icon: <FaSearch className="text-blue-500" size={26} />,
  },
  {
    id: 2,
    title: "Viral Content Ideas",
    description: "Get trending ideas and create engaging posts that go viral.",
    icon: <FaFireAlt className="text-orange-500" size={26} />,
  },
  {
    id: 3,
    title: "Prompt Assistant",
    description: "Generate powerful AI prompts to supercharge your workflow.",
    icon: <FaRobot className="text-purple-500" size={26} />,
  },
  {
    id: 4,
    title: "Voiceover Generation",
    description: "Create high-quality voiceovers for your videos in seconds.",
    icon: <FaMicrophoneAlt className="text-green-500" size={26} />,
  },
  {
    id: 5,
    title: "Trend Explorer",
    description:
      "Track and analyze current market trends with real-time insights.",
    icon: <FaChartLine className="text-pink-500" size={26} />,
  },
];

const Features = () => {
  return (
    <section
      className="py-24 bg-gray-50 dark:bg-[#0B001A] transition-colors duration-500"
      id="features"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Everything You Need to Grow Online
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl mx-auto transition-colors duration-300">
            Explore powerful tools designed to help you build, scale, and
            dominate your online presence.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className={`flex flex-col md:flex-row items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              } gap-8`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              {/* Icon Box */}
              <div className="flex-shrink-0 bg-white dark:bg-[#140A25] shadow-md dark:shadow-lg rounded-2xl p-6 w-20 h-20 flex items-center justify-center transition-colors duration-300">
                {feature.icon}
              </div>

              {/* Text Content */}
              <div className="md:w-2/3 text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
