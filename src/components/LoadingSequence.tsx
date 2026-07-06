import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AudioEngine } from "./AudioEngine";
import { Terminal, Cpu, ShieldAlert, Wifi, Activity } from "lucide-react";

interface LoadingSequenceProps {
  onComplete: () => void;
}

export default function LoadingSequence({ onComplete }: LoadingSequenceProps) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const bootSequence = [
    "INITIALIZING SYSTEM VECTOR KERNELS...",
    "ESTABLISHING SECURE GATEWAY ON PORT 3000...",
    "MAPPING CYBER ORBIT PARALLAX SYSTEMS...",
    "SYNAPSE v2.5 TRANSLATING HUMAN TO NEURAL COGNITION...",
    "COMPILING CANVAS PHYSICS MATHEMATICS MODULES (WASM)...",
    "GENERATING NEURAL-LINK CONSTELLATIONS...",
    "SYNTHESIZING PROCEDURAL OSCILLATOR SOUND PATTERNS...",
    "DEVILVERSE DECRYPTION COMPLETE. SYSTEM STABLE."
  ];

  useEffect(() => {
    // Progress counter simulation
    let currentProgress = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 8) + 4;
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      if (currentProgress === 100) {
        clearInterval(interval);
        setIsReady(true);
      }
    }, 150);

    // Stream system logs staggered
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < bootSequence.length) {
        setLogs((prev) => [...prev, bootSequence[logIndex]]);
        logIndex++;
        AudioEngine.playGlitch();
      } else {
        clearInterval(logInterval);
      }
    }, 450);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, []);

  const handleEnterSystem = () => {
    AudioEngine.playSuccess();
    AudioEngine.startAmbientPad();
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 850);
  };

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          id="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 bg-cyber-black z-[99999] flex flex-col items-center justify-center p-6 select-none font-mono"
        >
          {/* Subtle scanning lines overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,6px_100%] z-50 opacity-65" />
          
          {/* Moving Scanline effect */}
          <div className="absolute inset-x-0 h-1 bg-cyan-500/10 pointer-events-none z-50 animate-scanline" />

          {/* Logo container with geometric portal ring */}
          <div className="relative mb-12 flex items-center justify-center">
            {/* Outer spinning rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-44 h-44 border border-dashed border-cyan-500/30 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-40 h-40 border-2 border-double border-purple-500/20 rounded-full"
            />
            
            {/* Core Glowing Brand Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="w-28 h-28 rounded-full bg-cyber-dark border border-cyan-400/50 flex flex-col items-center justify-center relative z-10 shadow-[0_0_30px_rgba(0,240,255,0.15)]"
            >
              <span className="text-3xl font-black text-cyan-400 tracking-wider">DEVIL</span>
              <span className="text-[10px] text-purple-400 font-bold tracking-[0.25em] mt-0.5">VERSE</span>
              <div className="absolute -bottom-1.5 px-2 py-0.5 rounded bg-cyan-500/20 text-[7px] text-cyan-300 border border-cyan-500/30">
                SYS_v2.5
              </div>
            </motion.div>
          </div>

          <div className="w-full max-w-lg space-y-6">
            {/* Log Panel */}
            <div className="h-44 bg-cyber-dark/80 rounded border border-gray-800/60 p-4 font-mono text-[10px] text-gray-400 overflow-y-auto space-y-1.5 shadow-inner">
              <div className="flex items-center gap-2 text-cyan-400/80 mb-2 border-b border-gray-800/40 pb-1">
                <Terminal className="w-3.5 h-3.5" />
                <span>TERMINAL_BOOT_LOG</span>
              </div>
              
              {logs.map((log, index) => (
                <div key={index} className="flex gap-1.5 items-start leading-relaxed">
                  <span className="text-purple-400 select-none">&gt;</span>
                  <span className="text-gray-300">{log}</span>
                </div>
              ))}
              {progress < 100 && (
                <div className="flex gap-1.5 items-center text-cyan-400/70 animate-pulse">
                  <span className="text-cyan-400">&gt;</span>
                  <span>LOADING RES_CHUNKS [{progress}%]...</span>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono px-1 text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                  STABLE_GRID
                </span>
                <span>{progress}% DECRYPTED</span>
              </div>

              {/* Loader bar */}
              <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden border border-gray-800/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-[0_0_8px_#00f0ff]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Ready Button Container */}
              <div className="h-14 relative flex items-center justify-center mt-6">
                <AnimatePresence mode="wait">
                  {isReady ? (
                    <motion.button
                      key="enter-button"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEnterSystem}
                      className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/40 hover:to-purple-500/40 text-cyan-300 font-bold text-sm tracking-widest border border-cyan-400/50 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300 flex items-center gap-2"
                    >
                      ENTER DEVILVERSE
                    </motion.button>
                  ) : (
                    <motion.div
                      key="decryption-msg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-gray-600 font-bold tracking-widest"
                    >
                      DECRYPTING QUANTUM KEYPRINTS...
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Minimal footer metadata */}
          <div className="absolute bottom-4 flex justify-between w-full px-8 text-[9px] text-gray-700 font-mono">
            <span>SECURE SYSTEM CONNECTION: ACTIVE</span>
            <span>DESIGNED BY ARPAN // AKA DEVIL</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
