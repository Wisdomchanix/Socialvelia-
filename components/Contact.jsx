"use client";

import React, { useRef } from "react";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { useEffect } from "react";

const Contact = () => {
  const scrollRevealInitialized = useRef(false);
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined" && !scrollRevealInitialized.current) {
      const initializeScrollReveal = async () => {
        try {
          const ScrollReveal = (await import("scrollreveal")).default;

          ScrollReveal().reveal(".contactcard", {
            duration: 1500,
            distance: "60px",
            origin: "bottom",
            easing: "ease-in-out",
            reset: true,
            interval: 200,
          });
          ScrollReveal().reveal(".contactform", {
            duration: 1700,
            distance: "60px",
            origin: "right",
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

  return (
    <section
      className="relative bg-white text-gray-900 dark:bg-[#06030D] dark:text-white py-20 px-6 md:px-16 lg:px-28 overflow-hidden transition-colors duration-500"
      id="contact"
    >
      {/* Soft glow / background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C084FC]/10 via-transparent to-transparent dark:from-[#1A0B3E]/40 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative max-w-5xl mx-auto text-center mb-14 contactcard">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white bg-gradient-to-r from-[#8B5CF6] to-[#C084FC] bg-clip-text text-transparent dark:bg-none">
          Get in Touch
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Whether you have a question, idea, or feedback we’d love to hear from
          you.
        </p>
      </div>

      <div className="relative grid md:grid-cols-2 gap-10 items-start contactcard">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Mail className="text-[#8B5CF6]" />
            <p className="text-gray-700 dark:text-gray-300">
              support@socialvelia.com
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="text-[#8B5CF6]" />
            <p className="text-gray-700 dark:text-gray-300">
              +234 800 000 VELIA
            </p>
          </div>
          <div className="flex items-center gap-4">
            <MessageSquare className="text-[#8B5CF6]" />
            <p className="text-gray-700 dark:text-gray-300">
              DM us on X (@socialvelia)
            </p>
          </div>

          <p className="text-gray-600 dark:text-gray-400 pt-6 leading-relaxed">
            We respond within 24 hours — our team is always ready to help
            creators and brands get the most out of Social Velia.
          </p>
        </div>

        {/* Contact Form */}
        <form className="bg-gray-50 dark:bg-[#0C071A]/60 backdrop-blur-md p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg space-y-6 transition-colors duration-300 contactform">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 rounded-lg bg-white dark:bg-[#110B20] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] border border-gray-200 dark:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg bg-white dark:bg-[#110B20] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] border border-gray-200 dark:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Type your message..."
              className="w-full p-3 rounded-lg bg-white dark:bg-[#110B20] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] border border-gray-200 dark:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] to-[#C084FC] hover:opacity-90 transition rounded-lg font-semibold text-white"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
