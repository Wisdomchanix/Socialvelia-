"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Flame, Bookmark } from "lucide-react";
// import { useAuth } from "../components/AuthContext";

// Mock viral topics data
const trendingTopics = [
  {
    id: 1,
    title: "5 TikTok Trends Dominating Real Estate Marketing",
    niche: "Real Estate",
  },
  {
    id: 2,
    title: "The Future of AI-Generated Voiceovers in Content Creation",
    niche: "AI Tools",
  },
  {
    id: 3,
    title: "How to Monetize Your Travel Niche on Instagram",
    niche: "Travel",
  },
  {
    id: 4,
    title: "Why Fitness Creators Are Blowing Up in 2025",
    niche: "Fitness",
  },
  {
    id: 5,
    title: "Top 10 Tech Topics Going Viral This Month",
    niche: "Technology",
  },
];

const page = () => {
  // const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTopics, setFilteredTopics] = useState(trendingTopics);
  const [savedNiche, setSavedNiche] = useState(null);

  // Simulate loading user's saved niche from localStorage
  useEffect(() => {
    const niche = localStorage.getItem("userNiche");
    if (niche) setSavedNiche(niche);
  }, []);

  // Filter topics based on search input
  useEffect(() => {
    const results = trendingTopics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.niche.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTopics(results);
  }, [searchQuery]);

  return (
    <section className="min-h-screen bg-[#05010E] text-white px-6 py-10 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Your Niche</h1>
          {savedNiche && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-[#1a1029] px-4 py-2 rounded-lg border border-[#9DC88D]/30"
            >
              <Bookmark size={18} className="text-[#9DC88D]" />
              <span className="text-sm text-gray-300">{savedNiche}</span>
            </motion.div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <input
            type="text"
            placeholder="Search your niche or topic..."
            className="w-full bg-[#1a1029] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#9DC88D] outline-none transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </div>

        {/* Trending Topics Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Flame size={18} className="text-[#F1824A]" /> Trending Viral Topics
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: topic.id * 0.1 }}
                  className="bg-[#1a1029] border border-gray-800 hover:border-[#9DC88D]/50 rounded-xl p-5 shadow-md hover:shadow-[#9DC88D]/10 transition"
                >
                  <h3 className="font-medium text-white mb-2">{topic.title}</h3>
                  <p className="text-sm text-gray-400">{topic.niche}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center">
                No topics found for “{searchQuery}”.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
