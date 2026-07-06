import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import LoadingSequence from "./components/LoadingSequence";
import BackgroundSystem from "./components/BackgroundSystem";
import CustomCursor from "./components/CustomCursor";
import ErrorBoundary from "./components/ErrorBoundary";
import CinematicScrollBridge from "./components/CinematicScrollBridge";
import { AudioEngine } from "./components/AudioEngine";
import { Volume2, VolumeX, Menu, Compass, Eye, Terminal, Award, Languages } from "lucide-react";
import { SpringScrollProvider, useSpringScroll } from "./components/SpringScrollProvider";
import { LanguageProvider, useLanguage } from "./components/LanguageContext";

// Lazy-loaded heavy components for Bundle Optimization & Tree Shaking
const HeroSection = lazy(() => import("./components/HeroSection"));
const DeveloperTimeline = lazy(() => import("./components/DeveloperTimeline"));
const SkillsShowcase = lazy(() => import("./components/SkillsShowcase"));
const DeveloperConsole = lazy(() => import("./components/DeveloperConsole"));
const InteractivePlayground = lazy(() => import("./components/InteractivePlayground"));
const SecurityMainframe = lazy(() => import("./components/SecurityMainframe"));
const ThreeDMetallicViewer = lazy(() => import("./components/ThreeDMetallicViewer"));
const DesignGallery = lazy(() => import("./components/DesignGallery"));
const ContactSection = lazy(() => import("./components/ContactSection"));

const SectionLoader = ({ label }: { label: string }) => (
  <div className="w-full min-h-[350px] flex flex-col items-center justify-center font-mono text-[10px] text-cyan-400 space-y-3">
    <div className="w-6 h-6 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
    <span className="uppercase tracking-[0.25em] animate-pulse">SYNCHRONIZING {label} LAYER...</span>
  </div>
);

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [bgMode, setBgMode] = useState<"normal" | "matrix" | "cyber">("normal");
  const [isMuted, setIsMuted] = useState(false);
  const { scrollToSection: triggerSpringScroll } = useSpringScroll();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  useEffect(() => {
    // Standard cleanup when unmounting
    return () => {
      AudioEngine.stopAmbientPad();
    };
  }, []);

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    AudioEngine.setMute(nextMute);
    AudioEngine.playClick();
  };

  const scrollToSection = (id: string) => {
    triggerSpringScroll(id);
    AudioEngine.playClick();
  };

  return (
    <div className="relative min-h-screen text-slate-100 bg-cyber-black selection:bg-cyan-500/30 selection:text-white">
      {/* Cinematic Loading Phase */}
      <LoadingSequence onComplete={() => setLoading(false)} />

      {/* Main Experience Layout */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-screen"
        >
          {/* Custom Cursor Trailing System */}
          <CustomCursor />

          {/* Interactive Background Systems (Normal Stars, Matrix rain, Cyber Grid) */}
          <BackgroundSystem mode={bgMode} />

          {/* Decorative Glowing Backdrop filters */}
          <div className="fixed inset-0 pointer-events-none z-[1]">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/[0.02] rounded-full blur-[160px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/[0.02] rounded-full blur-[160px] animate-pulse-slow" style={{ animationDelay: "3s" }} />
          </div>

          {/* Minimal Floating Nav Menu overlay */}
          <header className="fixed top-0 inset-x-0 h-16 z-[999] flex items-center justify-between px-8 bg-cyber-black/25 backdrop-blur-md border-b border-gray-900/40 font-mono">
            {/* Logo */}
            <div
              onClick={() => scrollToSection("hero")}
              onMouseEnter={() => AudioEngine.playHover()}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors shadow-[0_0_12px_rgba(0,240,255,0.1)]">
                <span className="text-xs font-black">D</span>
              </div>
              <span className="text-xs font-black tracking-[0.2em] text-slate-100 group-hover:text-cyan-300 transition-colors">
                DEVILVERSE
              </span>
            </div>

            {/* Quick anchors */}
            <nav className="hidden md:flex items-center gap-6 text-[10px] tracking-wider uppercase text-slate-400">
              {[
                { label: t("nav.timeline"), id: "timeline" },
                { label: t("nav.skills"), id: "skills" },
                { label: t("nav.console"), id: "console" },
                { label: t("nav.playground"), id: "playground" },
                { label: t("nav.security"), id: "security" },
                { label: t("nav.threed"), id: "threed" },
                { label: t("nav.gallery"), id: "gallery" },
                { label: t("nav.contact"), id: "contact" },
              ].map((navItem) => (
                <button
                  key={navItem.id}
                  onClick={() => scrollToSection(navItem.id)}
                  onMouseEnter={() => AudioEngine.playHover()}
                  className="hover:text-cyan-300 transition-colors cursor-pointer font-bold relative group py-2 focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none rounded px-1.5"
                  aria-label={`Scroll to ${navItem.label} section`}
                >
                  {navItem.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </nav>

            {/* Audio Controllers / Language / Stats */}
            <div className="flex items-center gap-3">
              <span className="hidden lg:inline-block text-[8px] tracking-widest text-slate-500 uppercase border border-gray-800/40 px-2 py-1 rounded">
                {t("sys.stable")}
              </span>

              {/* Language Switcher Button */}
              <button
                id="language-toggle-btn"
                onClick={() => {
                  setLanguage(language === "en" ? "ja" : "en");
                  AudioEngine.playClick();
                }}
                onMouseEnter={() => AudioEngine.playHover()}
                className="px-2.5 py-1.5 rounded bg-gray-900/40 border border-gray-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none text-[9px] font-bold"
                title={language === "en" ? "Switch to Japanese" : "日本語から英語に切り替え"}
                aria-label="Toggle language"
              >
                <Languages className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === "en" ? "EN" : "日本語"}</span>
              </button>

              {/* Speaker controller */}
              <button
                onClick={handleToggleMute}
                onMouseEnter={() => AudioEngine.playHover()}
                className="p-2 rounded bg-gray-900/40 border border-gray-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none"
                title={isMuted ? t("btn.unmute") : t("btn.mute")}
                aria-label={isMuted ? t("btn.unmute") : t("btn.mute")}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              </button>
            </div>
          </header>

          {/* Main Layout Containers */}
          <main className="relative z-10 pt-16">
            {/* 1. HERO LANDING */}
            <div id="hero">
              <ErrorBoundary fallbackTitle="Hero Module Fault" isSection>
                <Suspense fallback={<SectionLoader label="Hero" />}>
                  <HeroSection
                    onScrollToConsole={() => scrollToSection("console")}
                    onScrollToPlayground={() => scrollToSection("playground")}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* CINEMATIC WAYPOINT: HERO -> CAMERA ZOOM / PORTAL -> TIMELINE */}
            <CinematicScrollBridge
              type="zoom-portal"
              title="Camera Zoom Portal"
              subtitle="Accelerating camera matrices into Arpan's retro-futuristic development story timeline."
              badge="PORTAL_COORDINATES: DEEP_WARP"
            />

            {/* 2. DEVELOPER TIMELINE STORY */}
            <div id="timeline" className="border-t border-gray-900/40 bg-cyber-black/20">
              <ErrorBoundary fallbackTitle="Timeline Module Fault" isSection>
                <Suspense fallback={<SectionLoader label="Timeline" />}>
                  <DeveloperTimeline />
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* 3. COGNITIVE SKILLS CONSTALLATION */}
            <div id="skills" className="border-t border-gray-900/40 bg-cyber-black/30">
              <ErrorBoundary fallbackTitle="Skills Module Fault" isSection>
                <Suspense fallback={<SectionLoader label="Skills" />}>
                  <SkillsShowcase />
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* CINEMATIC WAYPOINT: SKILLS -> FLOATING WORLD -> CONSOLE */}
            <CinematicScrollBridge
              type="floating-world"
              title="Floating Mindworld"
              subtitle="Beholding modular system interfaces drifting across high-altitude memory spaces."
              badge="PORTAL_COORDINATES: WORLD_DRIFT"
            />

            {/* 4. ARPAN CORE SHELL CONSOLE */}
            <div id="console" className="border-t border-gray-900/40 bg-cyber-black/44">
              <ErrorBoundary fallbackTitle="Developer Console Fault" isSection>
                <Suspense fallback={<SectionLoader label="Console" />}>
                  <DeveloperConsole
                    onSetBackgroundMode={(mode) => setBgMode(mode)}
                    onScrollToPlayground={() => scrollToSection("playground")}
                    onScrollToContact={() => scrollToSection("contact")}
                    onScrollToGallery={() => scrollToSection("gallery")}
                    onScrollToSkills={() => scrollToSection("skills")}
                    onScrollToSecurity={() => scrollToSection("security")}
                    onScrollToThreeD={() => scrollToSection("threed")}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* 5. INTERACTIVE SANDBOX PLAYGROUND */}
            <div id="playground" className="border-t border-gray-900/40 bg-cyber-black/50">
              <ErrorBoundary fallbackTitle="Sandbox Playground Fault" isSection>
                <Suspense fallback={<SectionLoader label="Interactive Sandbox" />}>
                  <InteractivePlayground />
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* CINEMATIC WAYPOINT: SANDBOX -> CYBER TUNNEL -> SECURITY */}
            <CinematicScrollBridge
              type="cyber-tunnel"
              title="Cyber Tunnel Matrix"
              subtitle="Diving deep through cascading grid pipelines into secure defensive firewall territory."
              badge="PORTAL_COORDINATES: SECURE_CORE"
            />

            {/* 6. SECURITY MAIN CONTROL MATRIX */}
            <div id="security" className="border-t border-gray-900/40 bg-cyber-black/45">
              <ErrorBoundary fallbackTitle="Security Mainframe Fault" isSection>
                <Suspense fallback={<SectionLoader label="Intrusion Firewall" />}>
                  <SecurityMainframe />
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* 6.5. 3D METALLIC ENGINE STUDIO */}
            <div id="threed" className="border-t border-gray-900/40 bg-cyber-black/35">
              <ErrorBoundary fallbackTitle="3D Metallic Engine Fault" isSection>
                <Suspense fallback={<SectionLoader label="3D Specular Renderer" />}>
                  <ThreeDMetallicViewer />
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* 7. DESIGN EXHIBITION GALLERY */}
            <div id="gallery" className="border-t border-gray-900/40 bg-cyber-black/40">
              <ErrorBoundary fallbackTitle="Gallery Module Fault" isSection>
                <Suspense fallback={<SectionLoader label="Design Gallery" />}>
                  <DesignGallery />
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* CINEMATIC WAYPOINT: GALLERY -> SPACE -> CONTACT */}
            <CinematicScrollBridge
              type="deep-space"
              title="Cosmic Space Orbit"
              subtitle="Slowing momentum, ascending to deep stellar orbits to transmit planetary feedback signals."
              badge="PORTAL_COORDINATES: NEBULA_STATION"
            />

            {/* 7. CONTACT CHANNELS GATEWAY */}
            <div id="contact" className="border-t border-gray-900/40 bg-cyber-black/30 pb-20">
              <ErrorBoundary fallbackTitle="Contact Form Fault" isSection>
                <Suspense fallback={<SectionLoader label="Contact Channels" />}>
                  <ContactSection />
                </Suspense>
              </ErrorBoundary>
            </div>
          </main>

          {/* Cinematic minimalist page margins telemetry indicator */}
          <footer className="relative z-10 border-t border-gray-900/60 bg-cyber-black py-8 font-mono text-[9px] text-gray-500 flex flex-col sm:flex-row justify-between items-center px-12 gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>{t("sys.resolved")}</span>
            </div>
            <div>
              <span>{t("sys.designedBy")}</span>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallbackTitle="System Core Collapse">
      <LanguageProvider>
        <SpringScrollProvider>
          <AppContent />
        </SpringScrollProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
