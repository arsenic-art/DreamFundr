'use client';

const DreamFundrLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[#030303] text-white relative overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />

      {/* Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* The Loader Ring */}
        <div className="relative w-20 h-20">
          {/* Outer Static Ring */}
          <div className="absolute inset-0 border border-white/5 rounded-full" />
          
          {/* Spinning Gradient Ring */}
          <div className="absolute inset-0 rounded-full animate-spin-slow">
            <div className="w-full h-full rounded-full border-2 border-transparent border-t-indigo-400 border-r-purple-400" 
                 style={{ 
                   filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))' 
                 }} 
            />
          </div>
          
          {/* Inner Pulsing Dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse-glow" />
          </div>
        </div>

        {/* Text */}
        <div className="mt-10 text-center space-y-3">
          <h3 className="text-2xl font-bold tracking-tight text-white">
            Dream<span className="text-indigo-400">Fundr</span>
          </h3>
          <div className="flex items-center gap-2 justify-center">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce-delay-0" />
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce-delay-1" />
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce-delay-2" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-bounce-delay-0 {
          animation: bounce-dot 1.4s ease-in-out infinite;
          animation-delay: 0s;
        }
        
        .animate-bounce-delay-1 {
          animation: bounce-dot 1.4s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        
        .animate-bounce-delay-2 {
          animation: bounce-dot 1.4s ease-in-out infinite;
          animation-delay: 0.4s;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 1;
            box-shadow: 0 0 20px 8px rgba(99, 102, 241, 0.3);
          }
          50% { 
            opacity: 0.6;
            box-shadow: 0 0 30px 12px rgba(99, 102, 241, 0.5);
          }
        }
        
        @keyframes bounce-dot {
          0%, 80%, 100% { 
            transform: translateY(0);
            opacity: 0.4;
          }
          40% { 
            transform: translateY(-8px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default DreamFundrLoader;
