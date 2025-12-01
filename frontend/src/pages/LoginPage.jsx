import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 bg-white">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              AI
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                AI Study Notebook
              </h1>
              <p className="text-sm text-slate-500">
                Your AI exam assistant — notes, summaries, and smart study planning.
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-4 text-slate-600 text-sm">
            <p>
              Capture lecture notes, upload PDFs, and let AI turn them into concise
              summaries, flashcards, and exam-style questions.
            </p>
            <p>
              Stay on top of deadlines with an intelligent exam planner that builds
              day-by-day study plans tailored to your courses.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white shadow-sm rounded-2xl border border-slate-100 px-6 py-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {isSignup
              ? "Sign up to start building your AI-powered study notebooks."
              : "Log in to continue your exam preparation."}
          </p>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                placeholder="you@university.edu"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-medium py-2.5 hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {loading
                ? isSignup
                  ? "Creating account..."
                  : "Logging in..."
                : isSignup
                  ? "Sign up"
                  : "Log in"}
            </button>
          </form>
          <p className="mt-4 text-xs text-slate-500 text-center">
            {isSignup ? "Already have an account?" : "New here?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignup((v) => !v)}
              className="text-blue-600 hover:underline font-medium"
            >
              {isSignup ? "Log in" : "Create an account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}


