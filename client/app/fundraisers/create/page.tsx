"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, AlertCircle, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errorHandler";

export default function CreateFundraiserPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setImagePreview(null);
  };

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
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("goalAmount", goalAmount);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      await api.post("/fundraisers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(getErrorMessage(err));
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

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
            Create Your Campaign
          </h1>
          <p className="text-zinc-400 text-lg">Share your story and start raising funds</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800/50 p-8 rounded-xl backdrop-blur-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image Upload */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Cover Image</label>
                {!imagePreview ? (
                    <div className="relative border-2 border-dashed border-zinc-800 rounded-lg p-8 hover:bg-zinc-900/50 transition-colors">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center text-zinc-500">
                            <ImagePlus className="w-10 h-10 mb-2" />
                            <p className="text-sm">Click to upload cover image</p>
                            <p className="text-xs text-zinc-600 mt-1">Supports JPG, PNG (Max 5MB)</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative rounded-lg overflow-hidden border border-zinc-800 h-64 bg-zinc-900">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Campaign Title</label>
              <input
                type="text"
                className="w-full bg-black/30 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Help me fund my dream project"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
              <textarea
                className="w-full bg-black/30 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell your story... Why do you need funds?"
              />
            </div>

            {/* Goal Amount */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Goal Amount (₹)</label>
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-50 text-black py-3.5 rounded-lg font-semibold hover:bg-white hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-8"
            >
              {loading ? "Creating Campaign..." : "Create Campaign"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}