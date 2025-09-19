'use client';

import React from 'react';

/**
 * A themed loader for DreamFundr pages.
 * It features multiple animated elements inspired by the "Dream Bubble"
 * logo concept, using the brand's cyan-to-purple gradient.
 */
const DreamFundrLoader = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-screen bg-slate-900">
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Outer spinning gradient ring, adds motion */}
          <div 
            className="absolute w-full h-full rounded-full opacity-50 animate-spin-slow"
            style={{
              background: 'conic-gradient(from 90deg at 50% 50%, #22d3ee 0%, #a855f7 50%, #ec4899 100%)'
            }}
          ></div>
          
          {/* Inner pulsing bubble, gives a "heartbeat" feel */}
          <div className="absolute w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full animate-pulse-fast opacity-80"></div>

          {/* Two "dream bubbles" that orbit each other, based on the logo */}
          <div 
            className="absolute w-12 h-12 bg-cyan-500 rounded-full mix-blend-screen opacity-70 animate-bubble1"
          ></div>
          <div 
            className="absolute w-12 h-12 bg-purple-600 rounded-full mix-blend-screen opacity-70 animate-bubble2"
          ></div>
        </div>
        <p className="mt-6 text-lg font-semibold tracking-widest text-gray-300 uppercase animate-pulse">
          Loading Dreams...
        </p>
      </div>

      {/* We include the CSS animations directly in the component using a standard <style> tag.
        This makes the component self-contained and avoids issues with styled-jsx
        in some Next.js App Router setups.
      */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        @keyframes pulse-fast {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        .animate-pulse-fast {
            animation: pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes bubble1 {
          0%, 100% {
            transform: translateX(-12px) scale(1);
          }
          50% {
            transform: translateX(12px) scale(1.1);
          }
        }
        .animate-bubble1 {
          animation: bubble1 2.5s ease-in-out infinite;
        }

        @keyframes bubble2 {
          0%, 100% {
            transform: translateX(12px) scale(1);
          }
          50% {
            transform: translateX(-12px) scale(1.1);
          }
        }
        .animate-bubble2 {
          animation: bubble2 2.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default DreamFundrLoader;

