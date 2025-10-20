import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const provider = new GoogleAuthProvider();

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-[#05010E] text-gray-900 dark:text-white transition-colors duration-500 relative overflow-hidden px-6 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-200/30 via-pink-200/20 to-transparent dark:from-[#3a0ca3]/20 dark:via-[#7209b7]/10 dark:to-transparent blur-3xl transition-colors duration-500" />

      <div className="relative w-full max-w-md bg-white/70 dark:bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 transition-all duration-500">
        {/* Decorative SVG */}
        <div className="absolute inset-0 -z-10 opacity-20 bg-[url('https://www.svgrepo.com/show/508699/mesh-gradient.svg')] bg-cover bg-center rounded-2xl blur-lg" />

        <h2 className="text-3xl font-semibold mb-6 text-center bg-gradient-to-r from-[#9b5de5] to-[#f72585] bg-clip-text text-transparent">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[#7209b7] text-gray-900 dark:text-white transition-all duration-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[#7209b7] text-gray-900 dark:text-white transition-all duration-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#9b5de5] to-[#f72585] text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Log In
          </button>
        </form>

        {/* Google Sign-In */}
        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-3 w-full py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg font-semibold text-gray-900 dark:text-white transition-all duration-500"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>
        </div>

        <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#f72585] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
