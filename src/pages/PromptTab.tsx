import React, { useState, useRef, useEffect } from "react";
import ScrollReveal from "scrollreveal";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Copy, Loader2, ChevronDown, X, Search } from "lucide-react";


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

const toolCategories: Record<string, AiTool[]> = {
  "Image Generation": [
    { name: "Midjourney", desc: "Advanced AI image creator", color: "#FF8C00" },
    { name: "DALL·E", desc: "AI art generator by OpenAI", color: "#1E90FF" },
    { name: "Stable Diffusion", desc: "Open-source AI image model", color: "#32CD32" },
  ],
  "Video Generation": [
    { name: "Runway", desc: "AI video editing and generation", color: "#9370DB" },
    { name: "Pika Labs", desc: "AI video creation tool", color: "#FF69B4" },
  ],
  "Audio Generation": [
    { name: "SocialVelia", desc: "AI voice generation tool", color: "#7209b7" },
    { name: "ElevenLabs", desc: "AI voice generation tool", color: "#00BFFF" },
    { name: "Synthesia", desc: "AI voice and avatar tool", color: "#FFD700" },
  ],
  "Text Generation": [
    { name: "ChatGPT", desc: "General purpose text AI", color: "#00BFFF" },
    { name: "Gemini", desc: "Google AI text assistant", color: "#FF4500" },
    { name: "Claude", desc: "AI assistant for writing", color: "#32CD32" },
  ],
};

const PromptTab: React.FC = () => {
  useEffect(() => {
    ScrollReveal().reveal(".prompt", {
      duration: 1000,
      distance: "60px",
      origin: "bottom",
      easing: "ease-in-out",
      reset: true,
      interval: 200,
    });
  }, []);

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [customTool, setCustomTool] = useState("");
  const [selectedTool, setSelectedTool] = useState<AiTool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const availableTools = purpose ? toolCategories[purpose] : [];
  const filteredTools = availableTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerate = () => {
    if (!purpose) {
      alert("Please select the purpose of your prompt before proceeding.");
      return;
    }
    if (!selectedTool && !customTool.trim()) {
      alert("Please select or enter an AI tool before generating a prompt.");
      return;
    }
    if (!prompt.trim()) return;

    const toolName = selectedTool?.name || customTool;

    const userMessage: Message = { id: Date.now(), text: prompt, type: "user" };
    setMessages(prev => [...prev, userMessage]);
    setPrompt("");
    setIsGenerating(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: `Refined for ${toolName} (${purpose}): "${userMessage.text}" → Generate a detailed and creative prompt suited for ${purpose.toLowerCase()} using ${toolName}.`,
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="min-h-screen bg-[#05010E] text-white px-4 md:px-10 py-6 flex flex-col relative prompt">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">AI Prompt Generator</h2>

      {/* Purpose Selection */}
      <div className="mb-4">
        <label className="block text-sm mb-2 text-gray-300">Select Purpose</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.keys(toolCategories).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setPurpose(cat);
                setSelectedTool(null);
                setCustomTool("");
              }}
              className={`py-2 px-3 rounded-xl border transition ${
                purpose === cat
                  ? "bg-[#7209b7] border-[#7209b7]"
                  : "bg-[#1a1029] border-gray-700 hover:border-[#7209b7]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tool Selection */}
      {purpose && (
        <div className="mb-4">
          <label className="block text-sm mb-2 text-gray-300">Select or Enter Tool</label>
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-between bg-[#1a1029] border border-gray-700 px-4 py-2 rounded-full hover:bg-[#7209b7] hover:border-[#7209b7] transition w-full md:w-auto"
            >
              <span>{selectedTool ? selectedTool.name : "Select a Tool"}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={customTool}
              onChange={(e) => setCustomTool(e.target.value)}
              placeholder="Or enter tool name..."
              className="w-full bg-[#1a1029] border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f72585]"
            />
          </div>
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your text to generate smarter, more effective prompts..."
        disabled={!purpose || (!selectedTool && !customTool)}
        className={`w-full bg-[#1a1029] border ${
          !purpose || (!selectedTool && !customTool)
            ? "border-gray-800 opacity-60 cursor-not-allowed"
            : "border-gray-700"
        } rounded-2xl px-4 py-3 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f72585] resize-none h-40`}
      />

      {/* Generate Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 bg-[#7209b7] hover:bg-[#f72585] px-6 py-3 rounded-xl text-sm md:text-base font-semibold transition"
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
                <span className="font-semibold text-[#F1824A]">
                  {selectedTool?.name || customTool}
                </span>
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

      {/* Tool Selection Modal */}
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
              className="fixed bottom-0 left-0 right-0 bg-[#0B0218] rounded-t-3xl p-6 z-50 min-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-semibold">Select an AI Tool</h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Search */}
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

              {/* Tool List */}
              <div className="space-y-3">
                {filteredTools.map((tool, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#1a1029] px-4 py-3 rounded-xl border border-gray-700 hover:border-[#7209b7] transition cursor-pointer"
                    onClick={() => {
                      setSelectedTool(tool);
                      setCustomTool("");
                      setIsModalOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-8 h-8 rounded-full"
                        style={{ background: tool.color }}
                      />
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
