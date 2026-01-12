"use client";

import { useEffect, useState } from "react";
import { Trophy, User } from "lucide-react";
import api from "@/lib/api";

interface TopDonor {
  user: {
    id: string;
    name: string;
  };
  totalAmount: number;
  donationCount: number;
}

interface TopDonorsProps {
  fundraiserId: string;
}

export default function TopDonors({ fundraiserId }: TopDonorsProps) {
  const [topDonors, setTopDonors] = useState<TopDonor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        const res = await api.get(
          `/donations/fundraiser/${fundraiserId}/top-donors?limit=5`
        );
        setTopDonors(res.data.topDonors);
      } catch (err) {
        console.error("Failed to fetch top donors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDonors();
  }, [fundraiserId]);

  if (loading) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-zinc-800 rounded w-1/2" />
          <div className="h-10 bg-zinc-800 rounded" />
          <div className="h-10 bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  if (topDonors.length === 0) return null;

  const getMedalColor = (index: number) => {
    if (index === 0) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    if (index === 1) return "text-gray-300 bg-gray-300/10 border-gray-300/20";
    if (index === 2) return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white flex items-center space-x-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <span>Top Donors</span>
      </h3>

      <div className="space-y-3">
        {topDonors.map((donor, index) => (
          <div
            key={donor.user.id}
            className="flex items-center space-x-3 bg-black/20 border border-zinc-800/50 p-3 rounded-lg"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${getMedalColor(
                index
              )}`}
            >
              <span className="font-bold text-sm">#{index + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">
                {donor.user.name}
              </p>
              <p className="text-xs text-zinc-500">
                {donor.donationCount} donation{donor.donationCount > 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-indigo-400 text-sm">
                ₹{donor.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
