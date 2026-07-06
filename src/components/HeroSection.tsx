import { motion } from "motion/react";
import { AudioEngine } from "./AudioEngine";
import { ChevronDown, Sparkles, Code2, Terminal } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface HeroSectionProps {
  onScrollToConsole: () => void;
  onScrollToPlayground: () => void;
}

export default function HeroSection({ onScrollToConsole, onScrollToPlayground }: HeroSectionProps) {
  const { t } = useLanguage();
  
  const handleHover = () => {
    AudioEngine.playHover();
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-6 select-none overflow-hidden">
      {/* Immersive radial gradient shadows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: "2s" }} />

      {/* Decorative neon corner frames - Cyber luxury look */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-purple-500/30 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-purple-500/30 rounded-br-lg pointer-events-none" />

      {/* Main typography content with staggered motion reveals */}
      <div className="relative z-10 max-w-4xl space-y-8 flex flex-col items-center">
        {/* Hologram badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onMouseEnter={handleHover}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-505/10 border border-cyan-400/20 text-[10px] md:text-xs font-mono text-cyan-300 tracking-[0.25em] uppercase hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.05)] cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "6s" }} />
          {t("hero.badge")}
        </motion.div>

        {/* Big name overlay with chromatic accent */}
        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            onMouseEnter={handleHover}
            className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-400 leading-none drop-shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
          >
            ARPAN
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center justify-center gap-4 font-mono text-xs sm:text-sm tracking-[0.4em] text-cyan-400 text-cyber-glow"
          >
            <span className="w-6 h-0.5 bg-cyan-400/40" />
            <span>AKA DEVIL</span>
            <span className="w-6 h-0.5 bg-cyan-400/40" />
          </motion.div>
        </div>

        {/* Creative Pitch Statement */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="max-w-2xl text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed font-sans font-light tracking-wide px-4"
        >
          {t("hero.desc")}
        </motion.p>

        {/* CTA Magnetic Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 pt-4 relative z-20"
        >
          {/* Main button */}
          <button
            onMouseEnter={handleHover}
            onClick={onScrollToConsole}
            className="group relative px-6 py-3.5 rounded-lg overflow-hidden border border-cyan-500/30 font-mono text-xs tracking-widest font-bold text-cyan-300 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.05)]"
          >
            {/* Glossy hover fill */}
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative flex items-center justify-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              {t("hero.boot")}
            </span>
          </button>

          {/* Secondary button */}
          <button
            onMouseEnter={handleHover}
            onClick={onScrollToPlayground}
            className="group relative px-6 py-3.5 rounded-lg overflow-hidden border border-purple-500/30 font-mono text-xs tracking-widest font-bold text-purple-300 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(176,38,255,0.05)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative flex items-center justify-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              {t("hero.playground")}
            </span>
          </button>
        </motion.div>
      </div>

      {/* Bottom status scroll reminder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ delay: 1.2, duration: 3, repeat: Infinity }}
        onClick={onScrollToConsole}
        className="absolute bottom-6 flex flex-col items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-gray-500 cursor-pointer hover:text-cyan-400 transition-colors"
      >
        <span>{t("hero.scroll")}</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-cyan-400/50" />
      </motion.div>
    </section>
  );
}
