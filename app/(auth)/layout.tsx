import React from 'react';
import Link from 'next/link';

const logoSrc = "/logo.png"; 

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <img className='w-12 h-10 rounded' src={logoSrc} alt="logo" />
            <span className="text-2xl font-black tracking-tight">DreamFundr</span>
          </Link>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}