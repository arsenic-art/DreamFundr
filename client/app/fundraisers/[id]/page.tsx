"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  User, Target, TrendingUp, MessageSquare, Send, AlertCircle, ArrowLeft, Calendar, Heart
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import DonationModal from "@/component/DonationModal";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string; };
}

interface Fundraiser {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  createdAt: string;
  isActive: boolean;
  user: { id: string; name: string; };
  comments: Comment[];
}

export default function FundraiserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoggedIn, user: currentUser } = useAuthStore();

  const [fundraiser, setFundraiser] = useState<Fundraiser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);

  const fetchFundraiser = async () => {
    try {
      const res = await api.get(`/fundraisers/${id}`);
      setFundraiser(res.data);
    } catch {
      setError("Fundraiser not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundraiser();
  }, [id]);

  const submitComment = async () => {
    if (!comment.trim()) return;
    setCommentLoading(true);
    try {
      await api.post("/comments", {
        fundraiserId: id,
        content: comment,
      });
      setComment("");
      fetchFundraiser();
    } catch {
      alert("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  // Loading and Error States
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border border-white/5 rounded-full" />
            <div className="absolute inset-0 rounded-full animate-spin border-2 border-transparent border-t-indigo-400 border-r-indigo-400" />
          </div>
          <p className="text-zinc-400 text-sm">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error || !fundraiser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#030303]">
        <div className="bg-zinc-900/50 border border-red-500/20 p-8 rounded-xl text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-red-400 mb-6 text-sm">{error}</p>
          <button
            onClick={() => router.push("/fundraisers")}
            className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors text-sm font-medium"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  const progress = (fundraiser.raisedAmount / fundraiser.goalAmount) * 100;

  return (
    <div className="min-h-screen py-16 px-6 relative bg-[#030303]">
      {/* ... Background Effects ... */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.push("/fundraisers")}
          className="mb-8 flex items-center space-x-2 text-zinc-400 hover:text-zinc-200 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
          <span className="text-sm font-medium">Back to Campaigns</span>
        </button>

        {/* Main Card */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden mb-8">
          <div className="p-8 border-b border-zinc-800/50">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">
              {fundraiser.title}
            </h1>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <User className="w-5 h-5 text-zinc-400" strokeWidth={2} />
              </div>
              <div>
                <p className="text-zinc-200 font-medium text-sm">{fundraiser.user.name}</p>
                <p className="text-xs text-zinc-500 flex items-center space-x-1.5 mt-0.5">
                  <Calendar className="w-3 h-3" strokeWidth={2} />
                  <span>{new Date(fundraiser.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-black/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-lg">
                <Target className="w-7 h-7 text-zinc-400 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-xs text-zinc-500 mb-1.5 uppercase tracking-wide">Goal</p>
                <p className="text-2xl font-bold text-white">₹{fundraiser.goalAmount.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-lg">
                <TrendingUp className="w-7 h-7 text-indigo-400 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-xs text-zinc-500 mb-1.5 uppercase tracking-wide">Raised</p>
                <p className="text-2xl font-bold text-indigo-400">₹{fundraiser.raisedAmount.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-lg">
                <div className="w-7 h-7 mx-auto mb-2 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-400">{progress.toFixed(0)}%</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mb-1.5 uppercase tracking-wide">Progress</p>
                <p className="text-2xl font-bold text-emerald-400">{progress.toFixed(1)}%</p>
              </div>
            </div>

            <div className="w-full bg-zinc-800/50 rounded-full h-2 overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            {fundraiser.isActive && isLoggedIn ? (
              <button
                onClick={() => setShowDonationModal(true)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.01]"
              >
                <Heart className="w-5 h-5" fill="currentColor" />
                Donate Now
              </button>
            ) : !isLoggedIn ? (
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-zinc-700"
              >
                <Heart className="w-5 h-5" />
                Login to Donate
              </button>
            ) : null}
          </div>

          <div className="p-8">
            <h2 className="text-lg font-semibold mb-4 text-white">About This Campaign</h2>
            <p className="text-zinc-300 leading-relaxed whitespace-pre-line text-sm">
              {fundraiser.description}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2 text-white">
            <MessageSquare className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
            <span>Comments ({fundraiser.comments.length})</span>
          </h2>

          {isLoggedIn ? (
            <div className="mb-8 bg-black/20 p-5 rounded-lg border border-zinc-800/50">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a supportive comment..."
                className="w-full bg-black/30 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none text-sm"
                rows={3}
              />
              <button
                onClick={submitComment}
                disabled={commentLoading || !comment.trim()}
                className="mt-3 px-5 py-2.5 bg-zinc-50 text-black rounded-lg font-semibold hover:bg-white hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 inline-flex items-center space-x-2 text-sm"
              >
                <Send className="w-4 h-4" strokeWidth={2} />
                <span>{commentLoading ? "Posting..." : "Post Comment"}</span>
              </button>
            </div>
          ) : (
            <div className="mb-8 bg-black/20 p-6 rounded-lg border border-zinc-800/50 text-center">
              <p className="text-zinc-400 mb-4 text-sm">Login to add a comment and show your support</p>
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded-lg transition-colors text-sm font-medium"
              >
                Login
              </button>
            </div>
          )}

          {fundraiser.comments.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" strokeWidth={1.5} />
              <p className="text-sm">No comments yet. Be the first to show support!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fundraiser.comments.map((c) => (
                <div key={c.id} className="bg-black/20 p-5 rounded-lg border border-zinc-800/50">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-zinc-400" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-zinc-200 text-sm">{c.user.name}</span>
                        <span className="text-xs text-zinc-600">•</span>
                        <span className="text-xs text-zinc-500">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed text-sm">{c.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Render Donation Modal Conditionally */}
      {showDonationModal && (
        <DonationModal
          fundraiserId={id!}
          fundraiserTitle={fundraiser.title}
          userEmail={currentUser?.email}
          userName={currentUser?.name}
          onClose={() => setShowDonationModal(false)}
          onSuccess={() => fetchFundraiser()}
        />
      )}
    </div>
  );
}