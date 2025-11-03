"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import authClient from "../../lib/auth-client";
const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("Weak");
  const [showPassword, setShowPassword] = useState(false); //  state for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // for confirm password
  const navigate = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const password = formData.password;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    setStrength(score);

    switch (score) {
      case 0:
      case 1:
        setStrengthLabel("Weak");
        break;
      case 2:
        setStrengthLabel("Fair");
        break;
      case 3:
        setStrengthLabel("Good");
        break;
      case 4:
        setStrengthLabel("Strong");
        break;
      default:
        setStrengthLabel("Weak");
    }
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
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
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user && result.user.displayName) {
        await updateProfile(result.user, {
          displayName: result.user.displayName,
        });
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Sign-in Error:", err);
      setError("Google Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#05010E] text-white relative overflow-hidden px-6 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3a0ca3]/20 via-[#7209b7]/10 to-transparent blur-3xl" />

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

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10"
      >
        <h2 className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-[#9b5de5] to-[#f72585] bg-clip-text text-transparent">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FiUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-gray-700 text-white focus:ring-2 focus:ring-[#7209b7] outline-none transition-all"
            />
          </div>

          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-gray-700 text-white focus:ring-2 focus:ring-[#7209b7] outline-none transition-all"
            />
          </div>

          {/* Password field + view toggle */}
          <div className="relative space-y-2">
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"} //  toggle visibility
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-white/5 border border-gray-700 text-white focus:ring-2 focus:ring-[#7209b7] outline-none transition-all"
              />
              <div
                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>

            {formData.password && (
              <>
                <div className="w-80 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(strength / 4) * 100}%`,
                      background:
                        strength <= 1
                          ? "linear-gradient(to right, #ff4d4d, #ff9966)"
                          : strength === 2
                          ? "linear-gradient(to right, #ffcc00, #ffeb3b)"
                          : "linear-gradient(to right, #00e676, #00c853)",
                    }}
                    transition={{ duration: 0.4 }}
                    className="h-2 rounded-full"
                  />
                </div>
                <p
                  className={`text-xs ${
                    strength <= 1
                      ? "text-red-400"
                      : strength === 2
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  Password strength: {strengthLabel}
                </p>
              </>
            )}
          </div>

          {/* Confirm Password + view toggle */}
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"} //  toggle visibility
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-700 focus:ring-[#7209b7]"
              } bg-white/5 text-white outline-none transition-all`}
            />
            <div
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </div>
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">
                  Passwords do not match
                </p>
              )}
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#9b5de5] to-[#f72585] py-2 rounded-lg font-medium text-white 
            hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white/10  
            border border-gray-700 hover:bg-[#2a2a2a] transition disabled:opacity-50"
          >
            <FcGoogle size={22} />
            <span className="font-medium text-white">Sign up with Google</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#f72585] hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </section>
  );
};

export default Signup;
