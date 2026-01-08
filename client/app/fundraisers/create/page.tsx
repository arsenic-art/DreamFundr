"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, DollarSign, FileText, Target, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

export default function CreateFundraiserPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !goalAmount) {
      setError("All fields are required");
      return;
    }

    if (Number(goalAmount) <= 0) {
      setError("Goal amount must be positive");
      return;
    }

    setLoading(true);

    try {
      await api.post("/fundraisers", {
        title,
        description,
        goalAmount: Number(goalAmount),
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create fundraiser");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 relative bg-[#030303]">
      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />

      {/* Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
            Create Your Campaign
          </h1>
          <p className="text-zinc-400 text-lg">Share your story and start raising funds</p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 p-8 rounded-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Campaign Title
              </label>
              <input
                type="text"
                className="w-full bg-black/30 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Help me fund my dream project"
                maxLength={100}
              />
              <p className="text-xs text-zinc-500 mt-1.5">{title.length}/100 characters</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Description
              </label>
              <textarea
                className="w-full bg-black/30 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell your story... Why do you need funds? What will you achieve with them?"
              />
              <p className="text-xs text-zinc-500 mt-1.5">Be clear and compelling about your goals</p>
            </div>

            {/* Goal Amount */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Goal Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">₹</span>
                <input
                  type="number"
                  className="w-full bg-black/30 border border-zinc-800 rounded-lg pl-9 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="50000"
                  min="1"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1.5">Enter the total amount you need to raise</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-50 text-black py-3.5 rounded-lg font-semibold hover:bg-white hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 mt-8"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Creating Campaign...
                </span>
              ) : (
                "Create Campaign"
              )}
            </button>
          </form>

          {/* Info Footer */}
          <div className="mt-6 pt-6 border-t border-zinc-800/50">
            <p className="text-xs text-zinc-500 text-center">
              By creating a campaign, you agree to our terms of service and transparency guidelines
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
