"use client";

import { useState, useEffect, useRef } from "react";
import { X, Menu, User, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isLoggedIn, user, logout } = useAuthStore();

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.header 
      className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-900/90 border-b border-zinc-800/50 px-6 py-3"
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0.95
      }}
      transition={{ 
        duration: 0.25, 
        ease: "easeInOut" 
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <img 
              src="/logo.png" 
              alt="logo" 
              className="w-9 h-7 rounded-md group-hover:scale-105 transition-transform duration-200" 
            />
            <span className="text-lg font-bold text-white">
              Dream<span className="text-indigo-400">Fundr</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              href="/fundraisers" 
              className="px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-md transition-all duration-200"
            >
              Explore
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  href="/fundraisers/create" 
                  className="px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-md transition-all duration-200"
                >
                  Create
                </Link>
                <Link 
                  href="/dashboard" 
                  className="px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-md transition-all duration-200"
                >
                  Dashboard
                </Link>
                
                {/* Divider */}
                <div className="w-px h-4 bg-zinc-800 mx-2" />
                
                {/* User Menu */}
                <div className="flex items-center space-x-1.5">
                  <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900/60 border border-zinc-800/50 hover:bg-zinc-900/80 transition-all">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-zinc-400" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs text-zinc-300 font-medium max-w-[90px] truncate">{user?.name}</span>
                  </div>
                  
                  <button 
                    onClick={logout}
                    className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 rounded-md transition-all duration-200"
                    title="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login">
                <button className="px-6 py-1.5 bg-zinc-50 text-black rounded-md text-sm font-semibold hover:bg-white hover:scale-[1.02] transition-all duration-200">
                  Login
                </button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-1.5 hover:bg-zinc-800/60 rounded-md transition-all duration-200"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <X className="w-4.5 h-4.5 text-zinc-300" strokeWidth={2.5} />
            ) : (
              <Menu className="w-4.5 h-4.5 text-zinc-300" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-zinc-800/50 bg-zinc-900/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1.5">
              <Link 
                href="/fundraisers" 
                className="block px-3 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-md transition-all font-medium text-sm"
                onClick={() => setShowMobileMenu(false)}
              >
                Explore
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link 
                    href="/fundraisers/create" 
                    className="block px-3 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-md transition-all font-medium text-sm"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Create
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="block px-3 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-md transition-all font-medium text-sm"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Dashboard
                  </Link>
                  
                  <div className="pt-3 mt-3 border-t border-zinc-800">
                    <div className="flex items-center space-x-2.5 px-3 py-2.5 bg-zinc-900/60 border border-zinc-800/50 rounded-md mb-2 hover:bg-zinc-900/80 transition-all">
                      <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <User className="w-4 h-4 text-zinc-400" strokeWidth={2.5} />
                      </div>
                      <span className="text-zinc-200 font-medium text-sm max-w-[200px] truncate">{user?.name}</span>
                    </div>
                    <button 
                      onClick={() => {
                        logout();
                        setShowMobileMenu(false);
                      }}
                      className="w-full px-3 py-2.5 flex items-center justify-center gap-2 bg-zinc-900/60 hover:bg-zinc-800/60 text-zinc-300 hover:text-white border border-zinc-800/50 rounded-md transition-all font-medium text-sm"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={2.5} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link href="/login" onClick={() => setShowMobileMenu(false)}>
                  <button className="w-full px-4 py-2.5 bg-zinc-50 text-black rounded-md font-semibold hover:bg-white hover:scale-[1.02] transition-all duration-200 text-sm">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
