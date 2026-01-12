"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, 
  Wallet,
  Activity, 
  BarChart3, 
  AlertCircle,
  Plus,
  Eye,
  Archive
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

interface Fundraiser {
  id: string;
  title: string;
  goalAmount: number;
  raisedAmount: number;
  isActive: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();

  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // Prevent multiple calls
    if (!hasAttemptedFetch) {
      fetchMyFundraisers();
    }
  }, [isLoggedIn, router, hasAttemptedFetch]);

  const fetchMyFundraisers = async () => {
    if (hasAttemptedFetch) return; // Prevent duplicate calls
    
    try {
      setHasAttemptedFetch(true);
      setLoading(true);
      setError("");
      
      const res = await api.get("/fundraisers/me");
      setFundraisers(res.data);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      
      if (err.response?.status === 429) {
        setError("Too many requests. Please wait a moment and refresh the page.");
      } else if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        router.push("/login");
      } else {
        setError("Failed to load your fundraisers. Please try refreshing the page.");
      }
    } finally {
      setLoading(false);
    }
  };

  const closeFundraiser = async (id: string) => {
    const confirmClose = confirm(
      "Are you sure you want to close this fundraiser?"
    );
    if (!confirmClose) return;

    try {
      await api.patch(`/fundraisers/${id}/close`);
      fetchMyFundraisers();
    } catch {
      alert("Failed to close fundraiser");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border border-white/5 rounded-full" />
            <div className="absolute inset-0 rounded-full animate-spin border-2 border-transparent border-t-indigo-400 border-r-indigo-400" />
          </div>
          <p className="text-zinc-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#030303]">
        <div className="bg-zinc-900/50 border border-red-500/20 p-8 rounded-xl text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-red-400 text-sm mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setError("");
                setHasAttemptedFetch(false);
                setLoading(true);
              }}
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors text-sm font-medium"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const active = fundraisers.filter((f) => f.isActive);
  const inactive = fundraisers.filter((f) => !f.isActive);

  const totalRaised = fundraisers.reduce((sum, f) => sum + f.raisedAmount, 0);
  const totalGoal = fundraisers.reduce((sum, f) => sum + f.goalAmount, 0);
  const totalFundraisers = fundraisers.length;
  const activeFundraisers = active.length;

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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-zinc-400 text-lg">Here's an overview of your fundraising campaigns</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Total Raised */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-xl hover:border-zinc-700/70 hover:-translate-y-0.5 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6 text-emerald-400" strokeWidth={2} />
              </div>
            </div>
            <h3 className="text-zinc-500 text-xs uppercase tracking-wide mb-1.5 font-medium">Total Raised</h3>
            <p className="text-2xl font-bold text-white">₹{totalRaised.toLocaleString()}</p>
          </div>

          {/* Total Goal */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-xl hover:border-zinc-700/70 hover:-translate-y-0.5 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-indigo-400" strokeWidth={2} />
              </div>
            </div>
            <h3 className="text-zinc-500 text-xs uppercase tracking-wide mb-1.5 font-medium">Total Goal</h3>
            <p className="text-2xl font-bold text-white">₹{totalGoal.toLocaleString()}</p>
          </div>

          {/* Active Campaigns */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-xl hover:border-zinc-700/70 hover:-translate-y-0.5 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-blue-400" strokeWidth={2} />
              </div>
            </div>
            <h3 className="text-zinc-500 text-xs uppercase tracking-wide mb-1.5 font-medium">Active Campaigns</h3>
            <p className="text-2xl font-bold text-white">{activeFundraisers}</p>
          </div>

          {/* Total Campaigns */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-xl hover:border-zinc-700/70 hover:-translate-y-0.5 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-purple-400" strokeWidth={2} />
              </div>
            </div>
            <h3 className="text-zinc-500 text-xs uppercase tracking-wide mb-1.5 font-medium">Total Campaigns</h3>
            <p className="text-2xl font-bold text-white">{totalFundraisers}</p>
          </div>
        </div>

        {/* Create New Button */}
        <div className="mb-10">
          <Link href="/fundraisers/create">
            <button className="bg-zinc-50 text-black px-6 py-3 rounded-lg font-semibold hover:bg-white hover:scale-[1.01] transition-all duration-200 inline-flex items-center space-x-2">
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              <span>Create New Campaign</span>
            </button>
          </Link>
        </div>

        {/* Active Fundraisers */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center space-x-3 text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-400" strokeWidth={2} />
            </div>
            <span>Active Campaigns</span>
          </h2>

          {active.length === 0 ? (
            <div className="bg-zinc-900/30 border border-zinc-800/50 p-12 rounded-xl text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-zinc-600" strokeWidth={1.5} />
              </div>
              <p className="text-zinc-400 mb-4 text-sm">No active campaigns yet.</p>
              <Link href="/fundraisers/create">
                <button className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded-lg transition-colors text-sm font-medium">
                  Create Your First Campaign
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {active.map((f) => {
                const progress = (f.raisedAmount / f.goalAmount) * 100;
                
                return (
                  <div
                    key={f.id}
                    className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-xl hover:border-zinc-700/70 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-zinc-100 transition-colors">
                          {f.title}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-zinc-500">
                          <span className="text-zinc-300 font-medium">₹{f.raisedAmount.toLocaleString()}</span>
                          <span>•</span>
                          <span>Goal: ₹{f.goalAmount.toLocaleString()}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-medium">{progress.toFixed(1)}%</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/fundraisers/${f.id}`)}
                          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded-lg transition-all flex items-center space-x-2 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" strokeWidth={2} />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => closeFundraiser(f.id)}
                          className="px-4 py-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg transition-all flex items-center space-x-2 text-sm font-medium"
                        >
                          <Archive className="w-4 h-4" strokeWidth={2} />
                          <span>Close</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-800/50 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Closed Fundraisers */}
        {inactive.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center space-x-3 text-white">
              <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                <Archive className="w-5 h-5 text-zinc-500" strokeWidth={2} />
              </div>
              <span>Closed Campaigns</span>
            </h2>

            <div className="space-y-4">
              {inactive.map((f) => {
                const progress = (f.raisedAmount / f.goalAmount) * 100;

                return (
                  <div
                    key={f.id}
                    className="bg-zinc-900/30 border border-zinc-800/30 p-6 rounded-xl opacity-60"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{f.title}</h3>
                        <div className="flex items-center space-x-3 text-sm text-zinc-500">
                          <span className="text-zinc-400 font-medium">₹{f.raisedAmount.toLocaleString()}</span>
                          <span>•</span>
                          <span>Goal: ₹{f.goalAmount.toLocaleString()}</span>
                          <span>•</span>
                          <span className="font-medium">{progress.toFixed(1)}%</span>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0">
                        <span className="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 rounded-lg text-sm font-medium inline-flex items-center gap-2">
                          <Archive className="w-3.5 h-3.5" strokeWidth={2} />
                          Closed
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-800/30 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-zinc-600"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
