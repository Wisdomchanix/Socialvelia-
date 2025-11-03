"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi"; //  added for view password
import { useRouter } from "next/navigation";
import authClient from "../../lib/auth-client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // password visibility
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        setError(error.message || "Signup failed. Please try again.");
        return;
      }

      if (data) {
        console.log("Signup successful:", data);

        setTimeout(() => {
          navigate.push("/dashboard");
        }, 2000);
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user && !user.displayName && user.email) {
        const nameFromEmail = user.email.split("@")[0];
        await updateProfile(user, { displayName: nameFromEmail });
      }

      navigate.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#05010E] text-white relative overflow-hidden px-6 py-12">
      {/* Background glow */}
      <svg
        className="absolute top-0 right-0 w-1/2 opacity-10"
        viewBox="0 0 400 400"
      >
        <defs>
          <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#7209b7" />
            <stop stopColor="#f72585" offset="1" />
          </linearGradient>
        </defs>
        <circle
          cx="200"
          cy="200"
          r="220"
          stroke="url(#grad)"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-b from-[#3a0ca3]/20 via-[#7209b7]/10 to-transparent blur-3xl" />

      <div className="relative w-full max-w-md bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10">
        <div className="absolute inset-0 -z-10 opacity-20 bg-[url('https://www.svgrepo.com/show/508699/mesh-gradient.svg')] bg-cover bg-center rounded-2xl blur-lg" />

        <h2 className="text-3xl font-semibold mb-6 text-center bg-gradient-to-r from-[#9b5de5] to-[#f72585] bg-clip-text text-transparent">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/10 border border-gray-700 outline-none focus:ring-2 focus:ring-[#7209b7] text-white transition-all duration-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Input with View/Hide */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-10 rounded-lg bg-white/10 border border-gray-700 outline-none focus:ring-2 focus:ring-[#7209b7] text-white transition-all duration-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-[#9b5de5] to-[#f72585] hover:opacity-90 text-white"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-white transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="text-2xl" />
            {loading ? "Signing in..." : "Continue with Google"}
          </button>
        </div>

        <p className="text-sm text-center mt-4 text-gray-400">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-[#f72585] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
