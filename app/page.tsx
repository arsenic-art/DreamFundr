'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  MessageSquare,
  Crown,
  Wallet,
  Eye,
  Coffee,
  Rocket,
  Heart,
  ChevronDown,
  X,
  Menu,
  LucideProps,
} from 'lucide-react';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';


type Dream = {
  text: string;
  author: string;
  funded: number;
};

type Stat = {
  label: string;
  value: string;
};

type Feature = {
  icon: React.ElementType<LucideProps>;
  title: string;
  description: string;
  color: string;
};

const MOCK_DREAMS: Dream[] = [
  { text: "I want to open a coffee shop that gives free meals to students.", author: "Maya, 24", funded: 78 },
  { text: "Help me buy art supplies to teach kids in my neighborhood.", author: "Carlos, 31", funded: 92 },
  { text: "I need a powerful laptop to finish my coding bootcamp.", author: "Priya, 19", funded: 45 },
  { text: "Funding my grandma's cataract surgery so she can see again.", author: "Ahmed, 27", funded: 67 }
];

const WEIRD_STATS: Stat[] = [
  { label: "Dreams that started with 'I wish I could...'", value: "12,847" },
  { label: "Cups of coffee funded", value: "23,891" },
  { label: "Midnight dream submissions", value: "4,321" },
  { label: "Happy tears (estimated)", value: "∞" }
];

const HOW_IT_WORKS_FEATURES: Feature[] = [
  { icon: Eye, title: "AI-Powered Vetting", description: "No 'help me buy a Lambo' posts. Our AI filters out the noise, keeping only genuine dreams that matter.", color: "text-cyan-400" },
  { icon: Wallet, title: "Crowdfund Your Passion", description: "Strangers see your dream, think 'damn, that's cool,' and send you money. It's really that simple.", color: "text-purple-400" },
  { icon: Rocket, title: "Achieve Liftoff", description: "You get your dream funded, they get good karma. Post updates, say thanks, and change your life.", color: "text-pink-400" },
];

const MAIN_FEATURES: Feature[] = [
  { icon: MessageSquare, title: "Connect & Collaborate", description: "Chat with dreamers, ask questions, or just lurk. Public comments or private DMs - your call.", color: "text-cyan-400" },
  { icon: Crown, title: "Flex On The Leaderboard", description: "Donate more, rank higher. Get internet points for being a good human. Show off to your friends.", color: "text-purple-400" },
  { icon: Zap, title: "Secure & Seamless", description: "Bank-level security, instant transfers. We handle the boring stuff so you can focus on what matters.", color: "text-pink-400" },
  { icon: Coffee, title: "Your Dreamer Profile", description: "Make your profile yours. Track your dreams, show off your contributions, and customize everything.", color: "text-yellow-400" },
];


const FeatureCard = ({ icon: Icon, title, description, color }: Feature) => (
  <div className="text-center group">
    <div className="w-20 h-20 mx-auto mb-6 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-slate-700">
      <Icon className={clsx("w-8 h-8", color)} />
    </div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <section className={clsx("px-6 py-20", className)}>
    <div className="max-w-6xl mx-auto">
      {children}
    </div>
  </section>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-4xl font-black text-center mb-16">
    {children}
  </h2>
);


const DreamFundrLanding = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentDreamIndex, setCurrentDreamIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const dreamInterval = setInterval(() => {
      setCurrentDreamIndex(prev => (prev + 1) % MOCK_DREAMS.length);
    }, 4000);
    return () => clearInterval(dreamInterval);
  }, []);

  const currentDream = MOCK_DREAMS[currentDreamIndex];

  return (
    <div className="bg-slate-900 text-white font-sans overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img className='w-10 h-8 rounded' src="/logo.png" alt="logo" />
            <span className="text-xl font-black tracking-tight">DreamFundr</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#" className="hover:text-cyan-400 transition-colors text-sm font-medium">Browse Dreams</Link>
            <Link href="#" className="hover:text-cyan-400 transition-colors text-sm font-medium">Leaderboard</Link>
            <Link href="#" className="hover:text-cyan-400 transition-colors text-sm font-medium">How It Works</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href={"/login"}>
              <button className="text-gray-300 hover:text-white text-sm">Login</button>
            </Link>
            <Link href={"/signup"}>
              <button className="text-gray-300 hover:text-white text-sm">SignUp</button>
            </Link><Link href={"/"}>
              <button className="bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                Post a Dream
              </button>
            </Link>


          </div>

          <button className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 w-full bg-slate-800/95 backdrop-blur-sm p-6 space-y-4 mt-2"
            >
              <Link href="#" className="block hover:text-cyan-400">Browse Dreams</Link>
              <Link href="#" className="block hover:text-cyan-400">Leaderboard</Link>
              <Link href="#" className="block hover:text-cyan-400">How It Works</Link>

              <hr className="border-slate-700" />

              <div className="flex flex-col items-center space-y-4 pt-2">
                <Link href={"/login"}>
                  <button className="text-gray-300 hover:text-white text-sm">Login</button>
                </Link>
                <Link href={"/signup"}>
                  <button className="text-gray-300 hover:text-white text-sm">SignUp</button>
                </Link>
                <Link href={"/"}>
                  <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 rounded-full text-sm font-medium">
                    Post a Dream
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <main>
        <section className="relative px-6 py-20 text-center">
          <div
            className="max-w-4xl mx-auto space-y-8"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Your dreams are
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-80">
                not just dreams.
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Post what you really want. Watch the internet make it happen.
              <span className="text-cyan-400"> No bullshit</span>, just people helping people.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <button className="group bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105">
                Start Dreaming
                <Sparkles className="inline-block ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
              <button className="border border-gray-600 px-8 py-4 rounded-full font-medium hover:border-cyan-400 hover:text-cyan-400 transition-all">
                I Want to Fund
              </button>
            </div>
          </div>

        </section>

        {/* Live Dreams Feed */}
        <Section className="bg-slate-800/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">Dreams Happening Right Now</h2>
            <p className="text-gray-400">Real people, real dreams, real impact.</p>
          </div>
          <div className="relative min-h-[140px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDreamIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-cyan-500/50"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {currentDream.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg mb-2">"{currentDream.text}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">— {currentDream.author}</span>
                      <div className="flex items-center space-x-2">
                        <div className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium">
                          {currentDream.funded}% funded
                        </div>
                        <Heart className="w-4 h-4 text-red-400 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Section>

        {/* How It Works */}
        <Section>
          <SectionTitle>
            Okay, but how does this actually work?
          </SectionTitle>
          <div className="grid md:grid-cols-3 gap-12">
            {HOW_IT_WORKS_FEATURES.map(feature => <FeatureCard key={feature.title} {...feature} />)}
          </div>
        </Section>

        {/* Weird Stats */}
        <Section className="bg-slate-800/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-16">Random stats until we get real one's</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {WEIRD_STATS.map((stat, index) => (
                <div key={index} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="text-3xl font-black text-cyan-400 mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Features */}
        <Section>
          <SectionTitle>Features That Don't Suck</SectionTitle>
          <div className="grid md:grid-cols-2 gap-8">
            {MAIN_FEATURES.map(feature => (
              <div key={feature.title} className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-600 hover:border-cyan-500/50 transition-all group">
                <feature.icon className={clsx("w-12 h-12 mb-4 group-hover:scale-110 transition-transform", feature.color)} />
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <section className="px-6 py-32 bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-black mb-8">
              Stop scrolling.
              <br />
              Start dreaming.
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Worst case: nothing happens.
              <br />
              Best case: your life changes forever.
            </p>
            <div className="space-y-4">
              <button className="w-full sm:w-auto mx-auto bg-gradient-to-r from-cyan-500 to-purple-600 px-12 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-purple-500/25 transition-all hover:scale-105">
                Post Your Dream (it's free)
              </button>
              <p className="text-sm text-gray-500">
                No credit card. No catch. Just dreams.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img className='w-10 h-8 rounded' src="/logo.png" alt="logo" />
              <span className="font-bold">DreamFundr</span>
            </div>

            <div className="flex space-x-8 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
              <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            </div>
          </div>

          <div className="text-center mt-8 text-gray-500 text-sm">
            Made with ❤️ and a dash of chaos
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DreamFundrLanding;