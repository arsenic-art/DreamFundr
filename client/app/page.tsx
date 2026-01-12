"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Shield,
  Sparkles,
  Target,
  BarChart3,
  LucideProps,
  Heart,
} from "lucide-react";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const backApi = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

type Dream = {
  text: string;
  author: string;
  funded: number;
};

type Feature = {
  icon: React.ElementType<LucideProps>;
  title: string;
  description: string;
};

const MOCK_DREAMS: Dream[] = [
  { text: "Open a coffee shop that feeds students for free.", author: "Akshara, 21", funded: 54 },
  { text: "Buy art supplies to teach neighborhood kids.", author: "Navya, 23", funded: 73 },
  { text: "A powerful laptop for my coding bootcamp.", author: "Shreyansh, 19", funded: 59 },
  { text: "Grandma's cataract surgery.", author: "Rudransh, 26", funded: 67 },
];

const HOW_IT_WORKS_FEATURES: Feature[] = [
  {
    icon: Target,
    title: "Create Your Campaign",
    description: "Set your goal and share your story in minutes. No complexity, just clarity.",
  },
  {
    icon: Users,
    title: "Build Your Community",
    description: "Connect with supporters who believe in your vision and want to help.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor every contribution with real-time analytics and insights.",
  },
];

const MAIN_FEATURES: Feature[] = [
  {
    icon: Shield,
    title: "Radical Transparency",
    description:
      "Track every contribution in real time. Supporters see exactly how funds move and where they're used.",
  },
  {
    icon: CheckCircle2,
    title: "No Platform Cut",
    description:
      "We don't skim your success. Every rupee goes to your cause — no hidden fees, no surprises.",
  },
  {
    icon: BarChart3,
    title: "Clear Progress, Always",
    description:
      "Simple, meaningful insights that show how close you are to your goal — nothing overwhelming.",
  },
];

const PrimaryButton = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <button className={clsx(
    "relative group overflow-hidden rounded-full py-4 px-8 bg-white text-black font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]",
    className
  )}>
    <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-200/50 to-transparent z-0" />
  </button>
);

const SecondaryButton = ({ children }: { children: React.ReactNode }) => (
  <button className="group relative rounded-full py-4 px-8 bg-white/5 border border-white/10 text-white font-medium text-lg overflow-hidden transition-all duration-300 hover:border-white/30 hover:bg-white/10">
    <div className="absolute inset-0 w-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 transition-all duration-[250ms] ease-out group-hover:w-full opacity-0 group-hover:opacity-100" />
    <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
  </button>
);

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={clsx(
    "relative overflow-hidden rounded-2xl border bg-[#0a0a0a] backdrop-blur-xl transition-all duration-500 group",
    "border-white/5",
    "hover:border-white/20 hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.15)]",
    className
  )}>
    <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {children}
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }: Feature) => (
  <GlassCard className="p-8 hover:-translate-y-1">
    <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/5 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 group-hover:scale-110 transition-all duration-500">
      <Icon className="w-6 h-6 text-gray-400 group-hover:text-indigo-400 transition-colors" strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
      {title}
    </h3>
    <p className="text-gray-500 leading-relaxed text-sm group-hover:text-gray-400 transition-colors">{description}</p>
  </GlassCard>
);

export default function DreamFundrLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [currentDreamIndex, setCurrentDreamIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDreamIndex((i) => (i + 1) % MOCK_DREAMS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const dream = MOCK_DREAMS[currentDreamIndex];

  return (
    <div className="bg-[#030303] min-h-screen text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans antialiased">

      {/* CINEMATIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
          }}
        />
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 px-6 pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-white">
            Fund What <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300 animate-gradient-x">
              Matters Most.
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
            No clutter. No hidden fees. Just a beautiful platform connecting
            <span className="text-white font-medium"> visionaries </span> with
            <span className="text-white font-medium"> believers</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/fundraisers/create">
              <PrimaryButton>
                Start Campaign <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </PrimaryButton>
            </Link>

            <Link href="/fundraisers">
              <SecondaryButton>
                Explore Dreams
              </SecondaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* DREAM SHOWCASE */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDreamIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              <GlassCard className="p-10 md:p-12 border-white/10 bg-black/50 shadow-2xl">
                <div className="text-center">
                  <Heart className="w-8 h-8 mx-auto text-pink-500 fill-pink-500/20 mb-6" />
                  <h3 className="text-2xl md:text-3xl font-medium text-white mb-6 leading-tight">
                    "{dream.text}"
                  </h3>
                  <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-gray-400">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" /> {dream.author}
                    </span>
                    <span className="w-px h-4 bg-gray-800 hidden sm:block" />
                    <span className="flex items-center gap-2 text-indigo-400 font-medium">
                      <TrendingUp className="w-4 h-4" /> {dream.funded}% Funded
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-8 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dream.funded}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">How It Works</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We stripped away the complexity. Launching your dream takes three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS_FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Smooth gradient transition */}
      <section className="relative z-10 px-6 py-32">
        {/* Smooth gradient overlay for transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-white/[0.02] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-center mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Built for <span className="text-indigo-400">Transparency</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Trust is the currency of crowdfunding. We give you the tools to earn it.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {MAIN_FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION - Smooth transition from features */}
      <section className="relative z-10 px-6 py-40">
        {/* Gradient overlay for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative">
          {/* Big Glow behind CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter text-white relative z-10">
            Ready to change the world?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto relative z-10">
            Join thousands of creators who are making their dreams a reality today.
          </p>

          <div className="relative z-10">
            <Link href="/fundraisers/create">
              <PrimaryButton className="px-12 py-6 text-xl">
                Create Your Fundraiser
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center gap-6">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} DreamFundr Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
