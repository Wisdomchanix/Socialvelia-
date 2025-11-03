import React from "react";
import { Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-white text-gray-900 dark:bg-[#06030D] dark:text-white pt-20 pb-10 px-6 md:px-16 lg:px-28 overflow-hidden transition-colors duration-500">
      {/* Background gradient glow (visible only in dark mode) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A0B3E]/40 via-transparent to-transparent blur-3xl pointer-events-none hidden dark:block" />

      <div className="relative grid md:grid-cols-4 gap-10 max-w-6xl mx-auto">
        {/* Brand */}
        <div>
          <h3
            className="
              text-2xl font-bold mb-3
              bg-gradient-to-r from-[#8B5CF6] to-[#C084FC] bg-clip-text text-transparent
              dark:text-white dark:bg-none
            "
            suppressHydrationWarning
          >
            Social Velia
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Your all-in-one AI content assistant — helping creators discover,
            plan, and grow faster.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white/90">
            Quick Links
          </h4>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
            <li>
              <a href="#" className="hover:text-[#C084FC] transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C084FC] transition">
                How It Works
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C084FC] transition">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C084FC] transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white/90">
            Product
          </h4>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
            <li>
              <a href="#" className="hover:text-[#C084FC] transition">
                AI Content Assistant
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C084FC] transition">
                Voiceover Generator
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C084FC] transition">
                Prompt Writer
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C084FC] transition">
                Trend Research
              </a>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white/90">
            Follow Us
          </h4>
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2 rounded-full bg-gray-100 dark:bg-[#110B20] hover:bg-[#C084FC]/20 dark:hover:bg-[#8B5CF6] transition"
            >
              <Twitter size={18} className="text-gray-900 dark:text-white" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-gray-100 dark:bg-[#110B20] hover:bg-[#C084FC]/20 dark:hover:bg-[#8B5CF6] transition"
            >
              <Instagram size={18} className="text-gray-900 dark:text-white" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-gray-100 dark:bg-[#110B20] hover:bg-[#C084FC]/20 dark:hover:bg-[#8B5CF6] transition"
            >
              <Linkedin size={18} className="text-gray-900 dark:text-white" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-gray-100 dark:bg-[#110B20] hover:bg-[#C084FC]/20 dark:hover:bg-[#8B5CF6] transition"
            >
              <Youtube size={18} className="text-gray-900 dark:text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="relative mt-16 border-t border-gray-300 dark:border-white/10 pt-6 text-center text-gray-500 dark:text-gray-500 text-sm">
        © {new Date().getFullYear()} Social Velia. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
