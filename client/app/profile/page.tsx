"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { 
  Camera, User, MapPin, Edit3, Loader2, Heart, 
  Mail, Calendar, Save, LogOut, CheckCircle2 
} from "lucide-react";

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  totalDonated: number;
  donationCount: number;
  isVerified: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/profile`);
      const profileData = res.data;
      
      setProfile(profileData);
      setFormData({
        name: profileData.name,
        bio: profileData.bio || "",
        location: profileData.location || "",
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const uploadAvatar = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setAvatarUploading(true);
      const res = await api.put("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      const newAvatar = res.data.avatar;
      setProfile(prev => prev ? { ...prev, avatar: newAvatar } : null);
      
      if (user) {
        updateUser({ ...user, avatar: newAvatar } as any);
      }
      
      return newAvatar;
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setAvatarUploading(false);
      setAvatarFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await api.put("/profile", formData);
      
      setProfile(res.data.user);
      updateUser(res.data.user);
      setEditing(false);
    } catch (err) {
      console.error("Profile update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-800 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303] px-4">
        <div className="max-w-md w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-8 text-center backdrop-blur-sm">
          <User className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-zinc-400 mb-8">Please log in to view your profile</p>
          <button 
            onClick={() => router.push("/login")}
            className="w-full bg-zinc-50 text-black py-3 rounded-lg font-semibold hover:bg-white transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] relative py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
      }} />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900/50 border border-zinc-800 rounded-lg backdrop-blur-sm">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Account Settings</h1>
              <p className="text-xs text-zinc-500">Manage your profile and preferences</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-medium px-4 py-2 hover:bg-zinc-900/50 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl grid md:grid-cols-[340px_1fr]">
          {/* LEFT: Avatar & Stats */}
          <div className="bg-black/20 p-8 border-b md:border-b-0 md:border-r border-zinc-800/50 flex flex-col items-center text-center h-full relative">
            <div className="relative group mb-6">
              <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/5 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 relative">
                  <img
                    src={profile.avatar || `https://ui-avatars.io/api/?name=${encodeURIComponent(profile.name)}&background=6366f1&color=ffffff&size=150`}
                    alt={profile.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                    <Camera className="w-8 h-8 text-white mb-1" />
                    <span className="text-[10px] text-zinc-300 font-medium uppercase tracking-wide">
                      {avatarUploading ? "Uploading..." : "Change Photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={avatarUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file && file.size < 5 * 1024 * 1024) { // 5MB limit
                          await uploadAvatar(file);
                        }
                      }}
                    />
                  </label>
                  {avatarUploading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
            <p className="text-zinc-500 text-sm mb-6 flex items-center gap-1.5 justify-center">
              <Mail className="w-3.5 h-3.5" /> {profile.email}
            </p>

            <div className="w-full grid grid-cols-2 gap-3 mb-8">
              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4 hover:bg-zinc-900/60 transition-colors">
                <p className="text-indigo-400 font-bold text-xl">₹{profile.totalDonated.toLocaleString()}</p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mt-1">Donated</p>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4 hover:bg-zinc-900/60 transition-colors">
                <p className="text-purple-400 font-bold text-xl">{profile.donationCount}</p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mt-1">Impacts</p>
              </div>
            </div>

            <div className="mt-auto w-full pt-6 border-t border-zinc-800/50">
              <p className="text-xs text-zinc-600 flex items-center justify-center gap-2 uppercase tracking-wide font-medium">
                <Calendar className="w-3.5 h-3.5" />
                Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="p-8 lg:p-10 relative flex flex-col justify-center min-h-[500px]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Profile Details</h3>
                <p className="text-zinc-500 text-sm">Update your personal information.</p>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-zinc-700 transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/30 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-black/30 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                        placeholder="e.g. Mumbai, India"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    maxLength={200}
                    className="w-full bg-black/30 border border-zinc-800 rounded-lg p-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none text-sm leading-relaxed"
                    placeholder="Tell the community about yourself..."
                  />
                  <p className="text-xs text-zinc-600 text-right">{formData.bio.length}/200</p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-zinc-800/50">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-zinc-50 text-black py-2.5 rounded-lg font-semibold hover:bg-white hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: profile.name,
                        bio: profile.bio || "",
                        location: profile.location || "",
                      });
                    }}
                    disabled={saving}
                    className="px-6 py-2.5 bg-zinc-800/50 text-zinc-300 hover:text-white rounded-lg font-medium transition-colors border border-zinc-800 hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                  <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">About Me</h4>
                  {profile.bio ? (
                    <div className="bg-zinc-900/30 p-5 rounded-xl border border-zinc-800/50">
                      <p className="text-zinc-300 leading-relaxed text-sm">{profile.bio}</p>
                    </div>
                  ) : (
                    <div className="text-zinc-600 italic text-sm p-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20 text-center">
                      No bio added yet. Click 'Edit' to tell your story.
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="group flex items-center gap-4 p-4 rounded-xl border border-zinc-800/30 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-500/30 transition-colors">
                      <MapPin className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Location</p>
                      <p className="text-zinc-200 text-sm font-medium">
                        {profile.location || "Not specified"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="group flex items-center gap-4 p-4 rounded-xl border border-zinc-800/30 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:border-purple-500/30 transition-colors">
                      <Heart className="w-5 h-5 text-zinc-400 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Status</p>
                      <div className="flex items-center gap-2">
                        <p className="text-zinc-200 text-sm font-medium">Active Member</p>
                        {profile.isVerified && (
                          <span className="flex items-center gap-0.5 text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
