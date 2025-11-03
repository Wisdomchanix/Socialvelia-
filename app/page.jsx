"use client";
import React, { useRef } from "react";
import { useEffect } from "react";
import Header from "../components/Header";
import Brands from "../components/Brands";
import Howitworks from "../components/Howitworks";
import Features from "../components/Features";
import Testimonials from "../components/Testimonial";
import Faq from "../components/Faq";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import Link from "next/link";
import Image from "next/image";

const page = () => {
  const scrollRevealInitialized = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined" && !scrollRevealInitialized.current) {
      const initializeScrollReveal = async () => {
        try {
          const ScrollReveal = (await import("scrollreveal")).default;

          ScrollReveal().reveal(".hero", {
            duration: 1500,
            distance: "60px",
            origin: "bottom",
            easing: "ease-in-out",
            reset: true,
            interval: 200,
          });
          ScrollReveal().reveal(".hero_image", {
            duration: 2000,
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
    <>
      <Header />
      <section
        className="relative overflow-hidden bg-[#05010E] text-white dark:text-white transition-colors duration-500 bg-white dark:bg-[#05010E]"
        id="home"
      >
        {/* Soft background glow (large) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* top-left soft glow */}
          <div
            className="absolute -left-40 -top-40 w-[520px] h-[520px] rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(156,39,176,0.12), rgba(224,64,251,0.06), rgba(157,200,141,0.03))",
            }}
          />
          {/* bottom-right subtle glow */}
          <div
            className="absolute -right-40 -bottom-40 w-[420px] h-[420px] rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(156,39,176,0.06), rgba(224,64,251,0.04))",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 lg:py-28 transition-colors duration-500">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            {/* LEFT — text section */}
            <div className="w-full lg:w-6/12 text-center lg:text-left hero">
              <div className="mb-6">
                {/* <div className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-black/10 dark:bg-white/10 text-gray-800 dark:text-gray-200">
                SocialVelia
              </div> */}
              </div>

              {/* HEADLINE */}
              <h1 className="font-extrabold leading-tight text-3xl sm:text-4xl lg:text-5xl max-w-3xl mx-auto lg:mx-0 text-gray-900 dark:text-white">
                <span className="block">Turn Your Creativity</span>
                <span className="block relative">
                  Into Cash{" "}
                  <span className="relative inline-block ml-2">
                    {/* blurred colorful glow behind "Today!" */}
                    <span
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-md transform translate-x-2 translate-y-2 opacity-90 blur-2xl backdrop-blur-md"
                      style={{
                        background:
                          "linear-gradient(90deg, #e040fb59, #9c27b04d, #00ffff4d)",
                      }}
                    />
                    {/* Gradient text */}
                    <span
                      className="relative px-2 py-1 rounded-sm "
                      style={{
                        background:
                          "linear-gradient(90deg, #E040FB, #9C27B0, #00FFFF, #F1824A)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Today!
                    </span>

                    {/* neon gradient rectangle around "Today!" */}
                    <svg
                      className="absolute left-0 top-0 w-full h-15"
                      viewBox="0 0 100 30"
                      preserveAspectRatio="none"
                      style={{ pointerEvents: "none" }}
                    >
                      <defs>
                        <linearGradient
                          id="neonGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#E040FB" />
                          <stop offset="25%" stopColor="#9C27B0" />
                          <stop offset="50%" stopColor="#00FFFF" />
                          <stop offset="75%" stopColor="#F1824A" />
                          <stop offset="100%" stopColor="#E040FB" />
                        </linearGradient>
                      </defs>
                      <rect
                        x="0"
                        y="2"
                        width="100"
                        height="22"
                        rx="4"
                        ry="4"
                        fill="none"
                        stroke="url(#neonGradient)"
                        strokeWidth="1.6"
                        transform="translate(-2, -2) rotate(-2 50 15)"
                      />
                    </svg>
                  </span>
                </span>
              </h1>

              {/* Subheading */}
              <p className="mt-6 text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                From niche discovery to viral content creation, SocialVelia
                gives you everything you need to grow fast — even AI tools for
                movie recaps.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-3 justify-center px-6 py-3 rounded text-white font-semibold bg-gradient-to-r from-[#9C27B0] to-[#E040FB] shadow-lg transform hover:scale-[1.03] transition"
                >
                  Get Started Free
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M13 5l7 7-7 7"
                    />
                  </svg>
                </Link>

                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100 bg-white hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M5 3v18l15-9L5 3z" fill="currentColor" />
                  </svg>
                  Watch Demo
                </a>
              </div>
            </div>

            {/* RIGHT — mockup preview */}
            <div className="w-full lg:w-6/12 relative flex justify-center lg:justify-end items-center">
              <div
                className="relative hero-frame rounded-xl bg-gray-100 dark:bg-[#0b0710] px-6 py-8 md:px-10 md:py-10 transition-colors duration-500"
                style={{ width: "min(720px, 86%)" }}
              >
                <div
                  className="absolute -inset-1 rounded-xl -z-10"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(156,39,176,0.25), rgba(224,64,251,0.22), rgba(157,200,141,0.12))",
                  }}
                />

                <div className="rounded-lg overflow-hidde bg-gray-50 dark:bg-[#0f0b14] relative hero_image">
                  <Image
                    height={100}
                    width={100}
                    src="/images/MacDashboard.jpg"
                    alt="product screenshot"
                    className="w-screen h-full rounded"
                    // style={{ height: 320 }}
                  />
                  <button className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 bg-white/60 dark:bg-black/20 rounded-full p-4 shadow-lg hover:scale-105 transition">
                    <svg
                      className="w-6 h-6 text-black dark:text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path d="M5 3v18l15-9L5 3z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Brands />
      <Howitworks />
      <Features />
      <Testimonials />
      <Faq />
      <Contact />
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default page;
