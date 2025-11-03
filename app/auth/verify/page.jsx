"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = (useState < string) | (null > null);
  const navigate = useRouter();

  const resendVerification = async () => {
    if (auth.currentUser) {
      try {
        // await sendEmailVerification(auth.currentUser);
        setMessage("Verification email resent! Please check your inbox.");
      } catch (error) {
        console.error(error);
        setMessage(
          "Failed to resend verification email. Please try again later."
        );
      }
    }
  };

  const checkVerification = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        navigate.push("/dashboard");
      } else {
        setMessage(
          "Your email is not verified yet. Please verify and try again."
        );
      }
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#05010E] text-gray-900 dark:text-white relative overflow-hidden px-6 py-12 transition-colors duration-500">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-200/30 via-pink-200/20 to-transparent dark:from-[#3a0ca3]/20 dark:via-[#7209b7]/10 dark:to-transparent blur-3xl transition-colors duration-500" />

      {/* Decorative SVG */}
      <svg
        className="absolute top-0 right-0 w-1/2 opacity-10"
        viewBox="0 0 400 400"
      >
        <circle
          cx="200"
          cy="200"
          r="180"
          stroke="url(#grad)"
          strokeWidth="2"
          fill="none"
        />
        <defs>
          <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#7209b7" />
            <stop stopColor="#f72585" offset="1" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 bg-white/70 dark:bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-white/10 text-center">
        <h2 className="text-3xl font-semibold mb-4 bg-gradient-to-r from-[#9b5de5] to-[#f72585] bg-clip-text text-transparent">
          Verify Your Email
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {userEmail ? (
            <>
              We sent a verification link to{" "}
              <span className="font-semibold text-[#f72585]">{userEmail}</span>
              <br /> Please check your inbox and click the link to verify your
              account.
            </>
          ) : (
            "We’ve sent a verification link to your email. Please check your inbox."
          )}
        </p>

        <button
          onClick={checkVerification}
          className="w-full py-3 mb-3 bg-gradient-to-r from-[#9b5de5] to-[#f72585] rounded-lg font-semibold text-white hover:opacity-90 transition"
        >
          I’ve verified my email
        </button>

        <button
          onClick={resendVerification}
          className="w-full py-3 border border-[#f72585] rounded-lg font-semibold text-[#f72585] hover:bg-[#f72585]/10 transition"
        >
          Resend Email
        </button>

        {message && <p className="mt-4 text-sm text-[#f72585]">{message}</p>}
      </div>
    </section>
  );
};

export default VerifyEmail;
