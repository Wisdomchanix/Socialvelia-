"use client";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Search, Mic, ChevronDown } from "lucide-react";
import { useEffect } from "react";

const VoiceOverTab = () => {
  const scrollRevealInitialized = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined" && !scrollRevealInitialized.current) {
      const initializeScrollReveal = async () => {
        try {
          const ScrollReveal = (await import("scrollreveal")).default;

          ScrollReveal().reveal(".voice", {
            duration: 1000,
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

  const [text, setText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const voices = [
    {
      name: "Alice",
      desc: "Clear and engaging, friendly tone",
      color: "#00FFFF",
    },
    { name: "Bill", desc: "Friendly and comforting voice", color: "#00BFFF" },
    {
      name: "Brian",
      desc: "Middle-aged man with a warm tone",
      color: "#FFD700",
    },
    {
      name: "Callum",
      desc: "Deceptively gravelly, yet calm",
      color: "#FF69B4",
    },
    { name: "Charlie", desc: "Young Australian male voice", color: "#32CD32" },
  ];

  const filteredVoices = voices.filter((voice) =>
    voice.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const onGenerate = async () => {
    setIsGenerating(true);
    try {
      const resp = await fetch("/api/voice", {
        body: JSON.stringify({ text }),
        method: "POST",
      });
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error);
      }

      const blob = await resp.blob();
      const audioUrl = URL.createObjectURL(blob);
      const download = confirm("Conversion complete, proceed to download?");
      if (download) {
        const link = document.createElement("a");
        link.href = audioUrl;
        const name = "voiceover.mp3";
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#05010E] text-white px-4 md:px-10 py-6 flex flex-col relative voice">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">
        Text to Speech
      </h2>

      {/* Text Area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing here or paste any text you want to turn into life like speech..."
        className="w-full bg-[#1a1029] border border-gray-700 rounded-2xl px-4 py-3 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f72585] resize-none h-40"
      />

      {/* Voice Selection + Generate */}
      <div className="mt-4 flex flex-col md:flex-row-reverse justify-between items-center gap-4">
        {/* <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#1a1029] border border-gray-700 px-4 py-2 rounded-full hover:bg-[#7209b7] hover:border-[#7209b7] transition"
        >
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-500" />
          <span>Rachel</span>
          <ChevronDown className="w-4 h-4" />
        </button>
*/}
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`w-full md:w-auto flex items-center justify-center gap-2 bg-[#7209b7] hover:bg-[#f72585] px-6 py-3 rounded-xl text-sm md:text-base font-semibold transition ${
            isGenerating && "brightness-75 cursor-not-allowed"
          }`}
        >
          <Mic className="w-4 h-4" />
          {isGenerating ? "Generating..." : "Generate Speech"}
        </button>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-40"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="fixed bottom-0 left-0 right-0 bg-[#0B0218] rounded-t-3xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-semibold">
                  Select a Voice
                </h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Search Input */}
              <div className="flex items-center gap-2 bg-[#1a1029] border border-gray-700 rounded-xl px-3 py-2 mb-4">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search voices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none placeholder-gray-400"
                />
              </div>

              {/* Dropdown */}
              <div className="flex items-center justify-between text-gray-400 text-sm mb-3">
                <span>All saved voices</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {/* Voices List */}
              <div className="space-y-3">
                {filteredVoices.map((voice, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#1a1029] px-4 py-3 rounded-xl border border-gray-700 hover:border-[#7209b7] transition"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-8 h-8 rounded-full"
                        style={{
                          background: voice.color,
                          //   boxShadow: 0 0 10px ${voice.color},
                        }}
                      />
                      <div>
                        <p className="font-semibold text-white">{voice.name}</p>
                        <p className="text-xs text-gray-400">{voice.desc}</p>
                      </div>
                    </div>
                    <button className="p-2 rounded-full hover:bg-[#2a1f3d] transition">
                      <Play className="w-4 h-4 text-[#9DC88D]" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceOverTab;
