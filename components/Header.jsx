"use client";

import React, { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ✅ Always default to dark theme if nothing stored
  const [theme, setTheme] = useState("");
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // Default to dark theme if nothing stored
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Apply dark theme immediately on load and persist changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    setOpen(false);
  };

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/90 shadow-md backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          SocialVelia
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-gray-800 dark:text-gray-300 font-medium">
          {["Features", "How it Works", "Pricing", "Contact"].map((item) => (
            <li key={item} className="relative group">
              <a
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="transition duration-200"
              >
                {item}
              </a>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all"></span>
            </li>
          ))}
        </ul>

        {/* Desktop CTA + Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={"/signup"}
            className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition text-sm"
          >
            Get Started
          </Link>

          <button
            onClick={toggleTheme}
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-105 transition"
            aria-label="Toggle Theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.35 }}
                >
                  <Sun className="w-5 h-5 text-yellow-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.35 }}
                >
                  <Moon className="w-5 h-5 text-gray-900" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? (
              <HiX size={28} className="text-gray-800 dark:text-white" />
            ) : (
              <HiMenu
                size={28}
                className="text-purple-600 dark:text-purple-400"
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 w-3/4 max-w-xs h-screen bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-40 transform transition-transform duration-300 shadow-lg flex flex-col justify-between ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <button onClick={() => setOpen(false)}>
            <HiX size={28} className="text-gray-800 dark:text-white" />
          </button>
        </div>

        {/* Menu Links */}
        <ul className="flex flex-col gap-6 p-6 text-gray-800 dark:text-gray-300 font-medium text-lg pt-10">
          {["Home", "Features", "How it Works", "Pricing", "Contact"].map(
            (item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setOpen(false)}
                  className="hover:text-purple-500 dark:hover:text-purple-400 hover:scale-105 transition duration-200"
                >
                  {item}
                </a>
              </li>
            )
          )}
        </ul>

        {/* CTA + Theme Toggle */}
        <div className="p-6 mb-12 flex items-center justify-between">
          <Link
            href={"/signup"}
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition text-sm"
          >
            Get Started
          </Link>

          <button
            onClick={toggleTheme}
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-105 transition"
            aria-label="Toggle Theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.35 }}
                >
                  <Sun className="w-5 h-5 text-yellow-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.35 }}
                >
                  <Moon className="w-5 h-5 text-gray-900" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
