"use client";

import { Mail, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function VerifyPendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden bg-[#030303]">
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

      {/* Pending Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-zinc-900/50 border border-zinc-800/50 p-10 rounded-xl text-center">
          {/* Animated Mail Icon */}
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Mail className="w-10 h-10 text-indigo-400" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-white">
            Check Your Email
          </h1>

          <p className="text-zinc-300 mb-6 leading-relaxed">
            We've sent a verification link to your email address.
            Please verify your account before logging in.
          </p>

          <div className="bg-black/20 p-4 rounded-lg border border-zinc-800/50 mb-8">
            <p className="text-sm text-zinc-400">
              <strong className="text-indigo-400">Tip:</strong> Check your spam folder if you don't see the email within a few minutes.
            </p>
          </div>

          <Link href="/login">
            <button className="w-full px-6 py-3 bg-zinc-50 text-black rounded-lg font-semibold hover:bg-white hover:scale-[1.01] transition-all duration-200">
              Back to Login
            </button>
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center space-x-1"
          >
            <span>← Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
