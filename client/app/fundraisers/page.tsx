"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, User, Target, AlertCircle, Search } from "lucide-react";
import api from "@/lib/api";

interface Fundraiser {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

export default function FundraisersPage() {
  const router = useRouter();
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const res = await api.get("/fundraisers");
        setFundraisers(res.data);
      } catch (err: any) {
        setError("Failed to load fundraisers");
      } finally {
        setLoading(false);
      }
    };

    fetchFundraisers();
  }, []);

  const filteredFundraisers = fundraisers.filter((f) =>
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border border-white/5 rounded-full" />
            <div className="absolute inset-0 rounded-full animate-spin border-2 border-transparent border-t-indigo-400 border-r-indigo-400" />
          </div>
          <p className="text-zinc-400 text-sm">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#030303]">
        <div className="bg-zinc-900/50 border border-red-500/20 p-8 rounded-xl text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

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

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-white">
            Explore Campaigns
          </h1>
          <p className="text-zinc-400 text-lg">Discover and support dreams that matter</p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>

        {/* Fundraisers Grid */}
        {filteredFundraisers.length === 0 ? (
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-12 rounded-xl text-center">
            <Target className="w-16 h-16 text-zinc-600 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-zinc-400 text-base">
              {searchTerm ? "No campaigns match your search" : "No active campaigns right now"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFundraisers.map((f) => {
              const progress = (f.raisedAmount / f.goalAmount) * 100;

              return (
                <div
                  key={f.id}
                  onClick={() => router.push(`/fundraisers/${f.id}`)}
                  className="cursor-pointer group relative overflow-hidden bg-zinc-900/50 rounded-xl border border-zinc-800/50 hover:border-zinc-700/70 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <div className="p-6 relative">
                    {/* Title */}
                    <h2 className="text-xl font-semibold mb-3 text-white group-hover:text-zinc-100 transition-colors line-clamp-2">
                      {f.title}
                    </h2>

                    {/* Description */}
                    <p className="text-zinc-400 text-sm mb-5 line-clamp-3 leading-relaxed">
                      {f.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-5">
                      <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-zinc-500">Progress</span>
                        <span className="text-indigo-400 font-semibold">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-zinc-800/50 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-500"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">Raised</span>
                        <span className="text-white font-semibold">₹{f.raisedAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">Goal</span>
                        <span className="text-zinc-300 font-medium">₹{f.goalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center space-x-2 pt-4 border-t border-zinc-800/50">
                      <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-zinc-400" strokeWidth={2} />
                      </div>
                      <span className="text-sm text-zinc-500">
                        by <span className="text-zinc-300 font-medium">{f.user.name}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
