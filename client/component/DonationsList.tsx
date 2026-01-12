"use client";

import { useEffect, useState } from "react";
import { User, Heart, Clock } from "lucide-react";
import api from "@/lib/api";

interface Donation {
  id: string;
  amount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface DonationsListProps {
  fundraiserId: string;
}

export default function DonationsList({ fundraiserId }: DonationsListProps) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalDonations, setTotalDonations] = useState(0);

  const fetchDonations = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/donations/fundraiser/${fundraiserId}?page=${pageNum}&limit=10`
      );

      if (pageNum === 1) {
        setDonations(res.data.donations);
      } else {
        setDonations((prev) => [...prev, ...res.data.donations]);
      }

      setHasMore(res.data.pagination.hasMore);
      setTotalDonations(res.data.pagination.total);
    } catch (err) {
      console.error("Failed to fetch donations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations(1);
  }, [fundraiserId]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDonations(nextPage);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading && page === 1) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border border-white/5 rounded-full" />
            <div className="absolute inset-0 rounded-full animate-spin border-2 border-transparent border-t-indigo-400 border-r-indigo-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
          <span>Recent Donations ({totalDonations})</span>
        </h2>
      </div>

      {donations.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No donations yet. Be the first to contribute!</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="bg-black/20 border border-zinc-800/50 p-4 rounded-lg hover:bg-black/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {donation.user.avatar ? (
                        <img
                          src={donation.user.avatar}
                          alt={donation.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-zinc-400" strokeWidth={2} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {donation.user.name}
                      </p>
                      <div className="flex items-center space-x-1.5 text-xs text-zinc-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(donation.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-400">
                      ₹{donation.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
