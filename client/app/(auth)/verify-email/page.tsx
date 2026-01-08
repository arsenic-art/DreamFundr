"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const hasRun = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token missing");
        return;
      }

      try {
        await api.post("/auth/verify-email", { token });
        setStatus("success");
        setMessage("Email verified successfully! Redirecting to login...");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "This verification link is no longer valid."
        );
      }
    };

    verifyEmail();
  }, [token, router]);

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

      {/* Verification Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-zinc-900/50 border border-zinc-800/50 p-10 rounded-xl text-center">
          {/* Loading State */}
          {status === "loading" && (
            <>
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border border-white/5 rounded-full" />
                <div className="absolute inset-0 rounded-full animate-spin border-2 border-transparent border-t-indigo-400 border-r-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold mb-3 text-white">Verifying Your Email</h1>
              <p className="text-zinc-400">Please wait while we confirm your account...</p>
            </>
          )}

          {/* Success State */}
          {status === "success" && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto mb-6 text-emerald-400" strokeWidth={1.5} />
              <h1 className="text-2xl font-bold mb-3 text-emerald-400">Verification Successful!</h1>
              <p className="text-zinc-300 mb-6">{message}</p>
              <div className="w-12 h-1 mx-auto bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
            </>
          )}

          {/* Error State */}
          {status === "error" && (
            <>
              <XCircle className="w-16 h-16 mx-auto mb-6 text-red-400" strokeWidth={1.5} />
              <h1 className="text-2xl font-bold mb-3 text-red-400">Verification Failed</h1>
              <p className="text-zinc-300 mb-8">{message}</p>
              <Link href="/login">
                <button className="px-6 py-3 bg-zinc-50 text-black rounded-lg font-semibold hover:bg-white hover:scale-[1.01] transition-all">
                  Go to Login
                </button>
              </Link>
            </>
          )}
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
