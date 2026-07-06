import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { TerminalLog } from "../types";
import { AudioEngine } from "./AudioEngine";
import { Terminal, CornerDownLeft, ShieldAlert, Cpu, Sparkles } from "lucide-react";

interface DeveloperConsoleProps {
  onSetBackgroundMode: (mode: "normal" | "matrix" | "cyber") => void;
  onScrollToPlayground: () => void;
  onScrollToContact: () => void;
  onScrollToGallery: () => void;
  onScrollToSkills: () => void;
  onScrollToSecurity: () => void;
  onScrollToThreeD: () => void;
}

export default function DeveloperConsole({
  onSetBackgroundMode,
  onScrollToPlayground,
  onScrollToContact,
  onScrollToGallery,
  onScrollToSkills,
  onScrollToSecurity,
  onScrollToThreeD,
}: DeveloperConsoleProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalLog[]>([
    { text: "DEVILVERSE OS [Version 2.5.120]", type: "system" },
    { text: "(c) 2026 Devil Labs. All rights reserved.", type: "system" },
    { text: "ESTABLISHING SHADER CORE EMULATION... STABLE.", type: "success" },
    { text: "Type 'help' to unlock custom command vectors, or click pills below.", type: "output" },
  ]);
  const [historyIndex, setHistoryIndex] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  
  const consoleBufferRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandPills = [
    "help",
    "about",
    "skills",
    "security",
    "studio",
    "projects",
    "designs",
    "experiments",
    "contact",
    "matrix",
    "cyber",
    "secret"
  ];

  useEffect(() => {
    if (consoleBufferRef.current) {
      consoleBufferRef.current.scrollTop = consoleBufferRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmdText: string) => {
    const trimmed = cmdText.trim().toLowerCase();
    if (!trimmed) return;

    // Save history pointers
    const updatedHistoryIndex = [...historyIndex, cmdText];
    setHistoryIndex(updatedHistoryIndex);
    setHistoryPointer(updatedHistoryIndex.length);

    // Append user input log
    const userLog: TerminalLog = { text: `arpan@devilverse:~$ ${cmdText}`, type: "input" };
    let outputs: TerminalLog[] = [];

    switch (trimmed) {
      case "help":
        AudioEngine.playClick();
        outputs = [
          { text: "STATION COMMANDS VECTORS:", type: "system" },
          { text: "  about       - Read Arpan's creative tech profile", type: "output" },
          { text: "  skills      - Inspect holographic tech clusters", type: "output" },
          { text: "  security    - Access Cryptographic Firewall Control panel", type: "output" },
          { text: "  studio      - Open real-time 3D metallic vector engine", type: "output" },
          { text: "  projects    - Explore major full-stack developments", type: "output" },
          { text: "  designs     - Open high-fidelity visual assets", type: "output" },
          { text: "  experiments - Jump to physics interactive sandbox", type: "output" },
          { text: "  contact     - Access communication coordinates", type: "output" },
          { text: "  matrix      - Activate falling binary streams [Easter Egg]", type: "output" },
          { text: "  cyber       - Boot neon orbital grid layouts [Easter Egg]", type: "output" },
          { text: "  normal      - Restore minimal starry dark background", type: "output" },
          { text: "  secret      - Execute subharmonic frequency blast", type: "output" },
          { text: "  clear       - Wipe the screen logs buffer", type: "output" },
        ];
        break;

      case "studio":
      case "3d":
      case "threed":
        AudioEngine.playSuccess();
        outputs = [
          { text: "BOOTING REAL-TIME 3D METALLIC SHADER VECTOR ENGINE...", type: "system" },
          { text: "Matrix resolution set. Rendering phong specular coordinates...", type: "success" },
        ];
        setTimeout(() => {
          onScrollToThreeD();
        }, 1200);
        break;

      case "security":
      case "firewall":
        AudioEngine.playSuccess();
        outputs = [
          { text: "ESTABLISHING SHIELD ACCORD HANDSHAKE...", type: "system" },
          { text: "Active security layer: SHIELD_D-SHIELD [STABLE]", type: "success" },
          { text: "Routing mainframe control signals to Firewall Subsystem...", type: "output" },
        ];
        setTimeout(() => {
          onScrollToSecurity();
        }, 1200);
        break;

      case "about":
        AudioEngine.playGlitch();
        outputs = [
          { text: "ARPAN // AKA DEVIL - PROFILE SUMMARY:", type: "system" },
          { text: "====================================", type: "output" },
          { text: "Design Philosophy: 'Beyond conventional squares. Designing interfaces as physical art.'", type: "output" },
          { text: "Focus Areas: Custom WebGL canvas mechanics, performant algorithms (WebAssembly), full-stack interactive design, audio synthesis.", type: "output" },
          { text: "Vibe: Cyberpunk, Futuristic Minimal Luxury.", type: "output" },
        ];
        break;

      case "skills":
        AudioEngine.playSuccess();
        outputs = [
          { text: "SKILL PROFILE DECRYPTED:", type: "success" },
          { text: "Languages: TypeScript (98%), JavaScript (99%), Rust/C++ (85%), GLSL Shaders (90%)", type: "output" },
          { text: "Frameworks: React 19, Next.js, Express, Vite, D3.js", type: "output" },
          { text: "Immersive: HTML5 Canvas, Matter.js Physics, Framer Motion, WebAudio API, Three.js", type: "output" },
          { text: "Redirecting view to Skills Sphere panel...", type: "system" },
        ];
        setTimeout(() => {
          onScrollToSkills();
        }, 1200);
        break;

      case "projects":
        AudioEngine.playSuccess();
        outputs = [
          { text: "RETRIEVING COMPLETED ARTIFACTS:", type: "success" },
          { text: "1. NEURAL-SYNAPSE v2.5 - AI procedural node mapper utilizing WebAssembly calculations.", type: "output" },
          { text: "2. KRONOS CHRONICLES - Immersive temporal WebXR navigation system.", type: "output" },
          { text: "3. SOLARIS DEX - Financial orbit tracker powered by gravity-well particle physics.", type: "output" },
        ];
        break;

      case "designs":
        AudioEngine.playSuccess();
        outputs = [
          { text: "INITIALIZING MOUNT POINTS:", type: "system" },
          { text: "Mounting Aetheria Portal design file...", type: "output" },
          { text: "Mounting Helios Operational Telemetry interface...", type: "output" },
          { text: "Loading custom asset designs grid...", type: "output" },
        ];
        setTimeout(() => {
          onScrollToGallery();
        }, 1200);
        break;

      case "experiments":
        AudioEngine.playGlitch();
        outputs = [
          { text: "BOOTING EXPERIMENT RUNTIME...", type: "system" },
          { text: "Linking mouse attraction vectors...", type: "success" },
          { text: "Routing to physical playground canvas below...", type: "output" },
        ];
        setTimeout(() => {
          onScrollToPlayground();
        }, 1000);
        break;

      case "contact":
        AudioEngine.playClick();
        outputs = [
          { text: "COMMUNICATION NODE ACTIVE:", type: "system" },
          { text: "Matrix Signal: VERIFIED", type: "success" },
          { text: "Identity Vector: DEVILVERSE_SECURE_COMLINK", type: "output" },
          { text: "Opening secure mainframe contact terminal...", type: "output" },
        ];
        setTimeout(() => {
          onScrollToContact();
        }, 1200);
        break;

      case "matrix":
        AudioEngine.playSecret();
        onSetBackgroundMode("matrix");
        outputs = [
          { text: "EASTER EGG DETECTED: MATRIX DIGITAL DRIFT ACTIVE.", type: "glitch" },
          { text: "Binary streams compiled successfully. Enjoy the green fall.", type: "success" },
        ];
        break;

      case "cyber":
        AudioEngine.playSecret();
        onSetBackgroundMode("cyber");
        outputs = [
          { text: "EASTER EGG DETECTED: HYPER-NEON ORBITAL GRID BOOTED.", type: "glitch" },
          { text: "Magnetic coordinates mapping 120Hz system frame lines.", type: "success" },
        ];
        break;

      case "normal":
        AudioEngine.playClick();
        onSetBackgroundMode("normal");
        outputs = [
          { text: "Restoring minimal luxury dark star system...", type: "system" },
        ];
        break;

      case "secret":
        AudioEngine.playSecret();
        outputs = [
          { text: "SUBHARMONIC RESONANCE BLAST LAUNCHED.", type: "glitch" },
          { text: "Oscillators detuning 55Hz and 55.4Hz real-time nodes. Check your subwoofers.", type: "success" },
        ];
        break;

      case "clear":
        AudioEngine.playClick();
        setHistory([]);
        return;

      default:
        AudioEngine.playGlitch();
        outputs = [
          { text: `Error: Command Vector '${trimmed}' not found.`, type: "error" },
          { text: "Type 'help' to review safe navigational command hooks.", type: "output" },
        ];
        break;
    }

    setHistory((prev) => [...prev, userLog, ...outputs]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyPointer > 0) {
        const nextIdx = historyPointer - 1;
        setHistoryPointer(nextIdx);
        setInput(historyIndex[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPointer < historyIndex.length - 1) {
        const nextIdx = historyPointer + 1;
        setHistoryPointer(nextIdx);
        setInput(historyIndex[nextIdx]);
      } else {
        setHistoryPointer(historyIndex.length);
        setInput("");
      }
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 relative z-10 select-none">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded bg-cyan-500/10 border border-cyan-400/20 text-cyan-400">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display tracking-wide text-slate-100 flex items-center gap-2">
            DEVILOS COMMAND CENTER
          </h2>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
            INTEGRATED SCI-FI COMPILER & NAVIGATOR
          </p>
        </div>
      </div>

      {/* Main Terminal Window */}
      <div
        onClick={focusInput}
        className="glass-panel rounded-xl border border-gray-800/80 shadow-[0_10px_35px_rgba(0,0,0,0.4)] overflow-hidden cursor-text flex flex-col h-[400px]"
      >
        {/* Terminal Title Bar */}
        <div className="bg-cyber-dark/95 border-b border-gray-800/80 px-4 py-3 flex items-center justify-between font-mono text-[10px] text-gray-500 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            <span className="ml-2 text-slate-400 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              arpan@devilverse:~$
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="animate-pulse text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              SYS_STABLE
            </span>
            <span>60 FPS</span>
          </div>
        </div>

        {/* Console Log Buffer */}
        <div ref={consoleBufferRef} className="flex-1 p-5 overflow-y-auto font-mono text-xs space-y-2.5 bg-cyber-dark/45 scrollbar-thin">
          {history.map((log, idx) => {
            let style = "text-slate-300";
            if (log.type === "input") style = "text-cyan-400 font-medium";
            if (log.type === "system") style = "text-slate-500 border-b border-gray-900 pb-1.5 font-bold mb-1";
            if (log.type === "success") style = "text-green-400 font-medium";
            if (log.type === "error") style = "text-rose-500 font-medium animate-pulse";
            if (log.type === "glitch") style = "text-purple-400 font-black tracking-wide text-cyber-glow";

            return (
              <div key={idx} className="flex gap-2 items-start leading-relaxed">
                {log.type === "input" ? null : (
                  <span className="text-gray-600 select-none">&gt;&gt;</span>
                )}
                <span className={style}>{log.text}</span>
              </div>
            );
          })}
        </div>

        {/* Input Interface Area */}
        <div className="bg-cyber-dark/95 border-t border-gray-800/80 px-4 py-3 flex items-center gap-2">
          <span className="font-mono text-xs text-cyan-400 select-none">arpan@devilverse:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help'..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-slate-100 placeholder-gray-700 caret-cyan-400"
            autoComplete="off"
            autoCapitalize="off"
          />
          <button
            onClick={() => {
              handleCommand(input);
              setInput("");
            }}
            className="p-1 rounded text-cyan-400/60 hover:text-cyan-400 transition-colors"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Touch Pill Shortcuts */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {commandPills.map((pill) => (
          <button
            key={pill}
            onClick={() => {
              setInput(pill);
              handleCommand(pill);
              setInput("");
            }}
            onMouseEnter={() => AudioEngine.playHover()}
            className="px-3 py-1.5 rounded bg-gray-900/50 border border-gray-800 hover:border-cyan-500/30 font-mono text-[10px] text-slate-400 hover:text-cyan-300 transition-all duration-300 cursor-pointer"
          >
            {pill}
          </button>
        ))}
      </div>
    </section>
  );
}
