import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AudioEngine } from "./AudioEngine";
import {
  Activity,
  Zap,
  Cpu,
  Layers,
  Terminal,
  ShieldCheck,
  RefreshCw,
  Play,
  Pause,
  Server,
  Network,
  Disc,
  Power,
  Sliders,
} from "lucide-react";

export default function ContactSection() {
  const [tick, setTick] = useState(0);
  const [graphMode, setGraphMode] = useState<"synapse" | "cognition" | "stability">("synapse");
  const [isLive, setIsLive] = useState(true);
  const [frequencyScale, setFrequencyScale] = useState(1.0);
  const [metrics, setMetrics] = useState({
    bandwidth: 824.2,
    coreTemp: 41.2,
    syncRate: 98.45,
    power: 120,
    networkLatency: 12,
    systemLoad: 24,
  });

  const [kernelLogs, setKernelLogs] = useState<string[]>([
    "INITIALIZING CORE SYSTEM DIAGNOSTICS...",
    "ESTABLISHING SECURE KERNEL STACK...",
    "STABLE CHANNELS IDENTIFIED FOR ARPAN CORE.",
  ]);

  // Live simulation update loop
  useEffect(() => {
    if (!isLive) return;

    const timer = setInterval(() => {
      setTick((t) => t + 1);

      // Randomly update numbers with organic wave motion
      setMetrics((m) => {
        const nextTemp = Number(
          (40 + Math.cos(Date.now() / 4000) * 3 + Math.random() * 0.4).toFixed(1)
        );
        const nextLoad = Math.floor(20 + Math.sin(Date.now() / 2500) * 15 + Math.random() * 5);
        return {
          bandwidth: Number(
            (820 + Math.sin(Date.now() / 2000) * 15 * frequencyScale + Math.random()).toFixed(1)
          ),
          coreTemp: nextTemp,
          syncRate: Number(
            (98.5 + Math.sin(Date.now() / 1500) * 0.8 + Math.random() * 0.1).toFixed(2)
          ),
          power: Math.floor(115 + Math.sin(Date.now() / 1000) * 8 + Math.random() * 4),
          networkLatency: Math.floor(10 + Math.random() * 6),
          systemLoad: Math.max(1, Math.min(99, nextLoad)),
        };
      });
    }, 120);

    return () => clearInterval(timer);
  }, [isLive, frequencyScale]);

  // Periodic simulated kernel reports
  useEffect(() => {
    if (!isLive) return;

    const kernelSentences = [
      "SYNAPSE CACHE FLUSHED SUCCESSFULLY",
      "BUFFER RECONCILIATION COMPLETE ON ARRAY_3",
      "ROUTING SCHEDULER: PRIORITY SET TO HIGH",
      "ARPAN MAIN CORE DETECTING AMBIENT PULSES",
      "SYS STATE REPORT: HEALTH VECTOR STABLE",
      "ENCRYPTION ROTATION: KEY RENEW VERIFIED",
      "CPU HEAT DISPERSION NODE 2: NOMINAL",
      "VOLTAGE STABILITY GUARANTEED AT 1.22V",
      "THROTTLING PREVENTION MECHANISMS SECURED",
      "AUTONOMIC RESYNC: COMPLETED INTEL GRID",
    ];

    const timer = setInterval(() => {
      const randomLine = kernelSentences[Math.floor(Math.random() * kernelSentences.length)];
      const timestamp = new Date().toISOString().slice(11, 19);
      setKernelLogs((prev) => {
        const next = [`[${timestamp}] ${randomLine}`, ...prev];
        return next.slice(0, 15); // keep last 15 logs
      });
    }, 2800);

    return () => clearInterval(timer);
  }, [isLive]);

  const getGraphPath = () => {
    const points: string[] = [];
    const width = 360;
    const height = 120;
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      let y = height / 2;
      const angleMultiplier = frequencyScale * 0.3;
      if (graphMode === "synapse") {
        y = height / 2 + Math.sin((i + tick) * angleMultiplier) * 28 + Math.cos((i - tick) * 0.08) * 8;
      } else if (graphMode === "cognition") {
        const isSpike = i % 8 === 0;
        y = isSpike
          ? height / 2 + Math.sin((i + tick) * 0.6) * 40
          : height / 2 + Math.cos(i + tick) * 6;
      } else {
        // Stability mode represents highly clean and low noise sine wave
        y = height / 2 + Math.sin(i * 0.2 + tick * 0.15) * 12 + Math.cos(i * 0.5) * 3;
      }
      y = Math.max(8, Math.min(height - 8, y));
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  const handleSystemReset = () => {
    AudioEngine.playClick();
    AudioEngine.playSuccess();
    setKernelLogs((prev) => [
      `[${new Date().toISOString().slice(11, 19)}] >> INITIALIZING HARD REBOOT SEQUENCE...`,
      `[${new Date().toISOString().slice(11, 19)}] >> CACHE STORAGE DUMP RECONCILED.`,
      `[${new Date().toISOString().slice(11, 19)}] >> ALL CORE PROCESSES SYSTEM: NOMINAL.`,
      ...prev,
    ]);
  };

  const toggleFeed = () => {
    AudioEngine.playClick();
    setIsLive(!isLive);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 relative z-10 select-none">
      {/* Header */}
      <div className="text-center mb-12 space-y-3">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 tracking-[0.3em] uppercase"
        >
          <Server className="w-3.5 h-3.5 animate-pulse" />
          STATION COGNITIVE CORE
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-100">
          MAIN CONTROL TELEMETRY
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto font-sans font-light">
          Real-time diagnostics mapping Arpan's active terminal. Adjust signal generator limits or monitor active kernel logs directly.
        </p>
      </div>

      {/* Grid of Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Waveform Generator (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between glass-panel rounded-xl border border-gray-800/60 p-6 space-y-6 bg-cyber-dark/10 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
                  WAVEFORM_MATRIX_ANALYZER
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleFeed}
                  className={`p-1 px-2.5 rounded text-[8px] font-mono uppercase cursor-pointer border transition-all duration-300 flex items-center gap-1 ${
                    isLive
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  {isLive ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                  {isLive ? "LIVE FEED" : "PAUSED"}
                </button>
              </div>
            </div>

            {/* Sub Mode Selectors */}
            <div className="grid grid-cols-3 gap-1.5 bg-gray-950 p-1.5 rounded-lg border border-gray-900">
              {(["synapse", "cognition", "stability"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setGraphMode(mode);
                    AudioEngine.playClick();
                  }}
                  className={`py-2 text-[10px] font-mono tracking-wider uppercase rounded transition-all duration-300 cursor-pointer ${
                    graphMode === mode
                      ? "bg-gray-800 text-cyan-400 font-bold border border-cyan-500/25 shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {mode} array
                </button>
              ))}
            </div>

            {/* Glowing Spectral Screen */}
            <div className="relative h-44 bg-gray-950/90 rounded-lg border border-gray-900 p-3 flex items-center justify-center overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.15)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />

              <svg className="w-full h-full overflow-visible" viewBox="0 0 360 120" preserveAspectRatio="none">
                <g stroke="#111827" strokeWidth="0.5" strokeDasharray="3 3">
                  <line x1="0" y1="30" x2="360" y2="30" />
                  <line x1="0" y1="60" x2="360" y2="60" />
                  <line x1="0" y1="90" x2="360" y2="90" />
                  <line x1="90" y1="0" x2="90" y2="120" />
                  <line x1="180" y1="0" x2="180" y2="120" />
                  <line x1="270" y1="0" x2="270" y2="120" />
                </g>
                <polyline
                  fill="none"
                  stroke={graphMode === "synapse" ? "#22d3ee" : graphMode === "cognition" ? "#c084fc" : "#f472b6"}
                  strokeWidth="1.8"
                  className="transition-all duration-300 ease-out"
                  points={getGraphPath()}
                  style={{ filter: "drop-shadow(0px 0px 6px currentColor)" }}
                />
              </svg>

              <div className="absolute bottom-3 left-3 font-mono text-[8px] text-slate-500 flex gap-4">
                <span>INDEX_X: {(tick % 1000).toString().padStart(4, "0")}</span>
                <span>AMPLITUDE: {Math.floor(40 + Math.sin(tick * 0.1) * 20)}%</span>
                <span>HERTZ: {(frequencyScale * 120).toFixed(0)}HZ</span>
              </div>
              <div className="absolute top-3 right-3 font-mono text-[8px] text-cyan-500/60 uppercase">
                {graphMode}_STABILIZATION_LOCK: OK
              </div>
            </div>
          </div>

          {/* Interactive Wave Controls */}
          <div className="space-y-4 pt-4 border-t border-gray-900/60">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                FREQUENCY COEFFICIENT GENERATOR
              </span>
              <span className="text-purple-400 font-bold">{(frequencyScale * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-mono text-slate-600">0.5x</span>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={frequencyScale}
                onChange={(e) => {
                  setFrequencyScale(parseFloat(e.target.value));
                  AudioEngine.playHover();
                }}
                className="flex-1 accent-purple-500 bg-gray-900 h-1 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[9px] font-mono text-slate-600">2.5x</span>
            </div>
            <div className="grid grid-cols-2 gap-4 font-mono text-[9px] text-slate-500">
              <div className="bg-gray-950 p-2.5 rounded border border-gray-900 flex justify-between items-center">
                <span>VOLTAGE BIAS</span>
                <span className="text-slate-300 font-bold">1.22V (STABLE)</span>
              </div>
              <div className="bg-gray-950 p-2.5 rounded border border-gray-900 flex justify-between items-center">
                <span>DECIBEL RATIO</span>
                <span className="text-slate-300 font-bold">-4.5dB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: System Metrics & Diagnostics (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-panel rounded-xl border border-gray-800/60 p-6 space-y-6 bg-cyber-dark/10 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono text-purple-400 tracking-wider uppercase flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                SYS_METRIC_REPORTS
              </h3>
              <ShieldCheck className="w-4 h-4 text-green-400" />
            </div>

            {/* Mini Progress bars representing active resources */}
            <div className="space-y-3 font-mono text-[10px]">
              {/* Load Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Disc className="w-3 h-3 text-cyan-400 animate-spin-slow" />
                    COGNITIVE PROCESS LOAD
                  </span>
                  <span className="text-cyan-400 font-bold">{metrics.systemLoad}%</span>
                </div>
                <div className="w-full h-1 bg-gray-900 rounded overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${metrics.systemLoad}%` }}
                  />
                </div>
              </div>

              {/* Bandwidth Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-purple-400" />
                    BANDWIDTH DENSITY
                  </span>
                  <span className="text-purple-400 font-bold">{metrics.bandwidth} GB/s</span>
                </div>
                <div className="w-full h-1 bg-gray-900 rounded overflow-hidden">
                  <div
                    className="h-full bg-purple-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(10, ((metrics.bandwidth - 800) / 40) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Temp Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Network className="w-3 h-3 text-pink-400" />
                    CORE CHIP TEMPERATURE
                  </span>
                  <span className="text-pink-400 font-bold">{metrics.coreTemp}°C</span>
                </div>
                <div className="w-full h-1 bg-gray-900 rounded overflow-hidden">
                  <div
                    className="h-full bg-pink-400 transition-all duration-300"
                    style={{ width: `${(metrics.coreTemp / 60) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Core Logs Frame */}
          <div className="flex-1 flex flex-col justify-between pt-4 border-t border-gray-900/60 min-h-[160px]">
            <div className="space-y-2">
              <h4 className="text-[9px] font-mono text-slate-500 tracking-widest uppercase flex items-center gap-1">
                <Terminal className="w-3 h-3 text-cyan-400" />
                KERNEL_SYSTEM_LOGS
              </h4>
              
              <div className="bg-gray-950 p-3 rounded border border-gray-900 h-28 overflow-y-auto font-mono text-[8.5px] text-slate-400 space-y-1.5 scrollbar-thin">
                <AnimatePresence>
                  {kernelLogs.map((log, idx) => (
                    <motion.div
                      key={idx + "-" + log.length}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-1.5 leading-normal"
                    >
                      <span className="text-cyan-400 font-bold shrink-0">&gt;</span>
                      <span className={idx === 0 ? "text-slate-100 font-medium" : "text-slate-400"}>
                        {log}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="pt-3 border-t border-gray-900/50 flex justify-between items-center">
              <button
                onClick={handleSystemReset}
                className="w-full py-2 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-cyan-400/50 rounded font-mono text-[9px] text-slate-400 hover:text-cyan-300 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 animate-spin-slow text-cyan-400" />
                CYCLE SYSTEM DIAGNOSTICS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Branding Frame / Non-Contact Signature Block */}
      <div className="mt-8 glass-panel p-4 rounded-xl border border-gray-900 flex flex-col sm:flex-row justify-between items-center text-center font-mono text-[9px] text-slate-500 gap-4">
        <div className="flex items-center gap-2 text-green-400/90">
          <Power className="w-3.5 h-3.5 animate-pulse text-green-400" />
          <span>SECURITY CLASSIFICATION: ARPAN MAIN STATION CORE</span>
        </div>
        <div className="flex items-center gap-1 uppercase">
          <span>COGNITIVE PLATFORM DESIGNED & STABILIZED BY ARPAN</span>
        </div>
      </div>
    </section>
  );
}
