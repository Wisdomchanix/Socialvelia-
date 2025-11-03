"use client";
import React, { useRef } from "react";
import { useEffect } from "react";
import Link from "next/link";

const testimonials = [
  {
    id: 1,
    text: "I stopped guessing what to post. Now every idea connects with my audience.",
    author: "Daniel A., Video Editor",
  },
  {
    id: 2,
    text: "This best so far! I love it an all in one tool",
    author: "Lydia K.",
  },
  { id: 3, text: "My videos finally go viral.", author: "James I." },
  {
    id: 4,
    text: "The voiceover and prompt tools save me hours every week.",
    author: "Tunde M.",
  },
  {
    id: 5,
    text: "Our videos finally bring real sales thanks to Social Velia’s insights.",
    author: "Chioma O., Business Owner",
  },
  {
    id: 6,
    text: "Every creator I coach now uses Social Velia, it simply works.",
    author: "Martins A.",
  },
  {
    id: 7,
    text: "The voiceover and prompt tools save me hours every week.",
    author: "Michael C.",
  },
  {
    id: 8,
    text: "Super friendly team that actually listens and executes.",
    author: "Grace E.",
  },
];

const desktopHeights = [350, 250, 200, 250, 350, 250, 200, 250];
const mobileHeights = [200, 150, 120, 150, 200, 150];

const Testimonials = () => {
  const scrollRevealInitialized = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined" && !scrollRevealInitialized.current) {
      const initializeScrollReveal = async () => {
        try {
          const ScrollReveal = (await import("scrollreveal")).default;

          ScrollReveal().reveal(".testimonialcard", {
            duration: 900,
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
  return (
    <section className="relative bg-white dark:bg-[#05010E] transition-colors duration-500 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Masonry container */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {testimonials.map((t, index) => {
            // const isMobile = index < 6;
            const height =
              index < 6
                ? mobileHeights[index % mobileHeights.length]
                : desktopHeights[index % desktopHeights.length];

            return (
              <div
                key={t.id}
                className={`break-inside-avoid rounded-2xl p-4 sm:p-5 hover:scale-105 transition-transform duration-300 testimonialcard ${
                  index >= 6 ? "hidden sm:block" : ""
                }`}
                style={{
                  height: `${height}px`,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.15))",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)", // stronger shadow
                }}
              >
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-3 transition-colors duration-300">
                  {t.text}
                </p>
                <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  — {t.author}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Header, Subtext & Button */}
      <div className="text-center mt-16 px-6">
        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white transition-colors duration-300">
          What Our Clients Say
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6 transition-colors duration-300">
          From discovering their niche to creating viral content, our users
          share how Social Velia helped them grow faster and turn creativity
          into real results.
        </p>
        <Link
          href={"/signup"}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded font-medium hover:scale-105 transition-transform"
        >
          Try Social Velia
        </Link>
      </div>
    </section>
  );
};

export default Testimonials;
