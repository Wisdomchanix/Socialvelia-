"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  User,
  Sparkles,
  Type,
  Mic,
  LogOut,
  Trash2,
  HelpCircle,
  Compass,
} from "lucide-react";

import PromptTab from "../../components/PromptTab";
import NicheCombined from "../../components/NicheCombined";
import VoiceOverTab from "../../components/VoiceOverTab";
import IdeasTab from "../../components/IdeasTab";
import { useRouter } from "next/navigation";
import authClient from "../../lib/auth-client";
import { Film } from "lucide-react";
import RecapTab from "../../components/RecapTab";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("niche");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNichePopup, setShowNichePopup] = useState(false);
  const navigate = useRouter();
  // const { user, logout, deleteAccount } = useAuth();
  const { data: session } = authClient.useSession();
  const signOut = authClient.signOut;
  const handleLogout = async () => {
    try {
      await signOut({ callbackURL: "/login" });
    } catch (error) {
      alert("An error occoured");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const deleteConfirm = confirm(
        "Are you sure you want to delete your account?"
      );
      if (deleteConfirm) {
        const { data, error } = await authClient.deleteUser({
          callbackURL: "/login",
        });
        console.log(data, error);
        if (error) {
          throw new Error("An error occoured");
        }
      }
    } catch (error) {
      alert("An error occoured");
    }
  };

  // useEffect(() => {
  //   // show popup after 2 seconds
  //   const timer = setTimeout(() => setShowNichePopup(true), 2000);
  //   return () => clearTimeout(timer);
  // }, []);

  const tabs = [
    {
      id: "niche",
      label: "Niche",
      icon: <Compass className="w-5 h-5 text-white" />,
    },
    {
      id: "viral",
      label: "Ideas",
      icon: <Sparkles className="w-5 h-5 text-white" />,
    },
    {
      id: "prompt",
      label: "Prompt",
      icon: <Type className="w-5 h-5 text-white" />,
    },
    {
      id: "voice",
      label: "Voice",
      icon: <Mic className="w-5 h-5 text-white" />,
    },
    {
      id: "recap",
      label: "Recap",
      icon: <Film className="w-5 h-5 text-white" />,
    },
  ];
  const renderContent = () => {
    switch (activeTab) {
      case "niche":
        return <NicheCombined />;
      case "viral":
        return <IdeasTab />;
      case "prompt":
        return <PromptTab />;
      case "voice":
        return <VoiceOverTab />;
      case "recap":
        return <RecapTab />;

      default:
        return null;
    }
  };

  const firstName = session?.user?.name?.split(" ")[0] || "Creator";

  return (
    <div className="relative min-h-screen flex bg-[#05010E] text-white">
      <svg
        className="absolute top-0 right-0 w-3/4 md:w-2/3 opacity-6"
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

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-[#0A0219]/80 border-r border-white/10 backdrop-blur-md p-6">
        <div>
          <h1 className="text-xl font-bold text-white mb-10 tracking-wide">
            Social <span className="text-[#9b5de5]">Velia</span>
          </h1>

          <nav className="flex flex-col gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#9b5de5] to-[#f72585] text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 text-gray-400 mt-10">
          <button className="flex items-center gap-3 hover:text-[#9b5de5] transition">
            <HelpCircle className="w-5 h-5" /> Help & Support
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 hover:text-[#F1824A] transition"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-3 hover:text-red-500 transition"
          >
            <Trash2 className="w-5 h-5" /> Delete Account
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="flex justify-between items-center px-5 pt-6 pb-3 border-b border-white/5">
          <div className="md:hidden">
            <h2 className="text-lg font-semibold flex items-center gap-1">
              👋 Hey,{" "}
              <motion.span
                className="text-[#9b5de5]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {firstName}
              </motion.span>
            </h2>
            <p className="text-sm text-gray-400">
              Welcome back to Social Velia
            </p>
          </div>

          <div className="hidden md:block ml-auto text-right">
            <h2 className="text-lg font-semibold">
              👋 Welcome,{" "}
              <motion.span
                className="text-[#9b5de5]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {firstName}
              </motion.span>
            </h2>
            <p className="text-sm text-gray-400">Glad to have you back!</p>
          </div>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden relative z-50 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg"
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </header>

        {/* CONTENT */}
        <section className="flex-1 px-6 pt-4 pb-28 overflow-y-auto">
          {renderContent()}
        </section>
      </main>

      {/* ===== NICHE POPUP ===== */}
      <AnimatePresence>
        {showNichePopup && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setShowNichePopup(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-[#0D061A] border border-white/10 p-8 rounded-2xl shadow-2xl max-w-md w-[90%] text-center">
                <h2 className="text-2xl font-semibold text-white mb-3">
                  Let’s Find Your Niche 🎯
                </h2>
                <p className="text-gray-400 mb-6">
                  Answer a few quick questions so we can match you with a niche
                  that fits you best.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setShowNichePopup(false);
                      navigate.push("/niche-questionnaire");
                    }}
                    className="py-3 bg-gradient-to-r from-[#9b5de5] to-[#f72585] text-white rounded-lg font-medium hover:opacity-90 transition"
                  >
                    Start Questionnaire
                  </button>
                  <button
                    onClick={() => {
                      setShowNichePopup(false);
                      navigate.push("/niche");
                    }}
                    className="py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-white/10 transition"
                  >
                    Already Have a Niche
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== MOBILE PROFILE MENU ===== */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-72 bg-[#0D061A] border-l border-white/10 shadow-2xl z-50 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                    <User className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{firstName}</h3>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 text-gray-300">
                  <button className="flex items-center gap-3 hover:text-[#9b5de5] transition">
                    <HelpCircle className="w-5 h-5" /> Help & Support
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 hover:text-[#F1824A] transition"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-3 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-5 h-5" /> Delete Account
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center mt-6">
                © 2025 Social Velia. All rights reserved.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== MOBILE TAB BAR ===== */}
      <nav className="md:hidden fixed bottom-3 left-1/2 transform -translate-x-1/2 bg-[#0A0219]/90 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 flex justify-between w-[95%] max-w-sm shadow-lg">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center gap-1 text-xs transition-all duration-300 ${
              activeTab === tab.id ? "text-[#F1824A]" : "text-gray-400"
            }`}
          >
            <AnimatePresence mode="wait">
              {activeTab === tab.id ? (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-3 w-10 h-10 rounded-full bg-gradient-to-r from-[#9b5de5] to-[#f72585] flex items-center justify-center shadow-lg"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {tab.icon}
                </motion.div>
              ) : (
                <div className="w-5 h-5">{tab.icon}</div>
              )}
            </AnimatePresence>
            <span
              className={`mt-6 ${
                activeTab === tab.id ? "text-white font-medium" : ""
              }`}
            >
              {tab.label}
            </span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

export default Dashboard;
