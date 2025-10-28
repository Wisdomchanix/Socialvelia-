import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {  Send, Copy, Loader2, ChevronDown, X, Search } from "lucide-react";

interface Message {
  id: number;
  text: string;
  type: "user" | "ai";
}

interface AiTool {
  name: string;
  desc: string;
  color: string;
}

const aiTools: AiTool[] = [
  { name: "ChatGPT", desc: "General purpose AI for text generation", color: "#00BFFF" },
  { name: "Jasper", desc: "Marketing content AI", color: "#FFD700" },
  { name: "Writesonic", desc: "AI for creative writing", color: "#FF69B4" },
  { name: "CopyAI", desc: "AI copywriting assistant", color: "#32CD32" },
  { name: "Rytr", desc: "Fast AI writing assistant", color: "#FF4500" },
];

const PromptTab: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTool, setSelectedTool] = useState<AiTool | null>(aiTools[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const filteredTools = aiTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    const userMessage: Message = { id: Date.now(), text: prompt, type: "user" };
    setMessages(prev => [...prev, userMessage]);
    setPrompt("");
    setIsGenerating(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: `Refined for ${selectedTool?.name}: "${userMessage.text}" → Generate a detailed and engaging post about ${userMessage.text.toLowerCase()}.`,
        type: "ai",
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsGenerating(false);
    }, 2000);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleCopy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="min-h-screen bg-[#05010E] text-white px-4 md:px-10 py-6 flex flex-col relative">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">AI Prompt Generator</h2>

      {/* Textarea */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your text to generate smarter, more effective prompts..."
        className="w-full bg-[#1a1029] border border-gray-700 rounded-2xl px-4 py-3 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f72585] resize-none h-40"
      />

      {/* AI Tool Selection + Generate Button */}
      <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#1a1029] border border-gray-700 px-4 py-2 rounded-full hover:bg-[#7209b7] hover:border-[#7209b7] transition"
        >
          <span
            className="w-6 h-6 rounded-full"
            style={{ background: selectedTool?.color }}
          />
          <span>{selectedTool?.name}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#7209b7] hover:bg-[#f72585] px-6 py-3 rounded-xl text-sm md:text-base font-semibold transition"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Generate Prompt
        </button>
      </div>

      {/* Chat Section */}
      <div className="flex-1 overflow-y-auto space-y-4 mt-6 scrollbar-hide">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: msg.type === "user" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            className={`self-${msg.type === "user" ? "end" : "start"} bg-[#1a1029] rounded-2xl px-4 py-3 max-w-[85%] shadow-md`}
          >
            <div className="flex items-center gap-2 mb-1">
              {msg.type === "user" ? (
                <span className="font-semibold text-[#9DC88D]">You</span>
              ) : (
                <span className="font-semibold text-[#F1824A]">{selectedTool?.name}</span>
              )}
            </div>
            <p className="text-gray-200 text-sm whitespace-pre-line break-words">{msg.text}</p>
            {msg.type === "ai" && !isGenerating && (
              <button
                onClick={() => handleCopy(msg.text)}
                className="mt-2 flex items-center gap-1 text-[#9DC88D] hover:text-white text-sm"
              >
                <Copy className="w-4 h-4" /> Copy Prompt
              </button>
            )}
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* AI Tools Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-40"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="fixed bottom-0 left-0 right-0 bg-[#0B0218] rounded-t-3xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-semibold">Select an AI Tool</h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Search Input */}
              <div className="flex items-center gap-2 bg-[#1a1029] border border-gray-700 rounded-xl px-3 py-2 mb-4">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search AI tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none placeholder-gray-400"
                />
              </div>

              {/* Tools List */}
              <div className="space-y-3">
                {filteredTools.map((tool, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#1a1029] px-4 py-3 rounded-xl border border-gray-700 hover:border-[#7209b7] transition cursor-pointer"
                    onClick={() => {
                      setSelectedTool(tool);
                      setIsModalOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full" style={{ background: tool.color }} />
                      <div>
                        <p className="font-semibold text-white">{tool.name}</p>
                        <p className="text-xs text-gray-400">{tool.desc}</p>
                      </div>
                    </div>
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

export default PromptTab;
