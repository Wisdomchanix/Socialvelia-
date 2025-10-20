import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../Firebase/firebase";
import { FcGoogle } from "react-icons/fc";

const Signup: React.FC = () => {
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
  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔐 Evaluate password strength
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

  // 🔐 Handle Signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);
      navigate("/verify");
    } catch (err: any) {
      console.error("Signup Error:", err);
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered with Social Velia.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters long.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your connection.");
          break;
        default:
          setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🟣 Google Signup
  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Google Sign-in Error:", err);
      setError("Google Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-[#05010E] text-gray-900 dark:text-white relative overflow-hidden px-6 py-12 transition-colors duration-500">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-200/30 via-pink-200/20 to-transparent dark:from-[#3a0ca3]/20 dark:via-[#7209b7]/10 dark:to-transparent blur-3xl transition-colors duration-500" />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/70 dark:bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-white/10"
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
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-700 
              text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7209b7] outline-none transition-all duration-500"
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
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-700 
              text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7209b7] outline-none transition-all duration-500"
            />
          </div>

          {/* Password field + strength bar */}
          <div className="relative space-y-2">
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-gray-700 
                text-gray-900 dark:text-white focus:ring-2 focus:ring-[#7209b7] outline-none transition-all duration-500"
              />
            </div>

            {/* Strength Bar */}
            {formData.password && (
              <div className="w-80 h-2 bg-gray-300/30 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(strength / 4) * 100}%`,
                    background:
                      strength <= 1
                        ? "linear-gradient(to right, #ff4d4d, #ff9966)"
                        : strength === 2
                        ? "linear-gradient(to right, #ffcc00, #ffeb3b)"
                        : strength >= 3
                        ? "linear-gradient(to right, #00e676, #00c853)"
                        : "#ff4d4d",
                  }}
                  transition={{ duration: 0.4 }}
                  className="h-2 rounded-full"
                />
              </div>
            )}
            {formData.password && (
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
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                formData.confirmPassword && formData.password !== formData.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-700 focus:ring-[#7209b7]"
              } bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white outline-none transition-all duration-500`}
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Error message */}
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
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-gray-100 dark:bg-white/10  
            border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition disabled:opacity-50"
          >
            <FcGoogle size={22} />
            <span className="font-medium">Sign up with Google</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6 transition-colors duration-500">
          Already have an account?{" "}
          <Link to="/login" className="text-[#f72585] hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </section>
  );
};

export default Signup;
