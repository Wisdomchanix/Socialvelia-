"use client";
import React from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Video, Rocket, Laptop, Brain } from "lucide-react";

const ideas = [
  {
    icon: <Video className="text-orange-400" size={22} />,
    title: "Behind-the-Scenes Tech Reviews",
    desc: "Show your setup process, unbox gadgets, or reveal what tools make your workflow smoother.",
  },
  {
    icon: <Rocket className="text-green-400" size={22} />,
    title: "Startup Gadget Challenges",
    desc: "Try building something innovative with a specific gadget or tool and share the journey.",
  },
  {
    icon: <Laptop className="text-blue-400" size={22} />,
    title: "Tech for Entrepreneurs Series",
    desc: "Create a mini-series exploring how business owners use modern tech to boost productivity.",
  },
  {
    icon: <Brain className="text-pink-400" size={22} />,
    title: "AI Tools You Should Know",
    desc: "Review the latest AI apps and tools that help creators and founders stay ahead.",
  },
  {
    icon: <Lightbulb className="text-yellow-400" size={22} />,
    title: "‘What If Tech Ruled’ Scenarios",
    desc: "Make entertaining short videos imagining how everyday life would change with new tech trends.",
  },
];

const IdeasTab = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-[#05010E] text-white px-6 md:px-16 py-16">
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="p-6 bg-[#1A1029]/60 backdrop-blur-lg rounded-2xl border border-white/10 hover:shadow-[0_0_15px_rgba(241,130,74,0.3)] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                {idea.icon}
                <h3 className="text-lg font-medium">{idea.title}</h3>
              </div>
              <p className="text-gray-400 text-sm">{idea.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IdeasTab;
