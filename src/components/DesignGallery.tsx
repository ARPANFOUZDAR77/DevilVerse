import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { designsData, projectsData } from "../data";
import { DesignAsset, Project } from "../types";
import { AudioEngine } from "./AudioEngine";
import { Eye, X, Compass, ExternalLink, Sparkles, MonitorUp, Code, Activity, Music, Terminal } from "lucide-react";

export default function DesignGallery() {
  const [activeTab, setActiveTab] = useState<"projects" | "designs">("projects");
  const [selectedDesign, setSelectedDesign] = useState<DesignAsset | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleOpenDesign = (design: DesignAsset) => {
    setSelectedDesign(design);
    AudioEngine.playSuccess();
  };

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    AudioEngine.playSuccess();
  };

  const handleClose = () => {
    setSelectedDesign(null);
    setSelectedProject(null);
    AudioEngine.playClick();
  };

  const handleHover = () => {
    AudioEngine.playHover();
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedDesign || selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedDesign, selectedProject]);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 relative z-10 select-none">
      {/* Header */}
      <div className="text-center mb-12 space-y-3">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 tracking-[0.3em] uppercase"
        >
          <Compass className="w-3.5 h-3.5 animate-pulse" />
          CREATIVE WORKS PORTFOLIO
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-100">
          DESIGN GALLERY & ARTIFACTS
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto font-sans font-light">
          A curate collective of immersive full-stack products and premium spatial interface mockups.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => {
            setActiveTab("projects");
            AudioEngine.playClick();
          }}
          onMouseEnter={handleHover}
          className={`px-5 py-2.5 rounded-lg font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 border cursor-pointer ${
            activeTab === "projects"
              ? "bg-cyan-500/10 text-cyan-300 border-cyan-400/40 shadow-[0_0_12px_rgba(0,240,255,0.1)]"
              : "bg-gray-950/40 text-slate-500 border-transparent hover:text-slate-300"
          }`}
        >
          FULL-STACK ARTIFACTS ({projectsData.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("designs");
            AudioEngine.playClick();
          }}
          onMouseEnter={handleHover}
          className={`px-5 py-2.5 rounded-lg font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 border cursor-pointer ${
            activeTab === "designs"
              ? "bg-purple-500/10 text-purple-300 border-purple-400/40 shadow-[0_0_12px_rgba(176,38,255,0.1)]"
              : "bg-gray-950/40 text-slate-500 border-transparent hover:text-slate-300"
          }`}
        >
          INTERACTIVE CONCEPTS ({designsData.length})
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {activeTab === "projects" &&
            projectsData.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                onMouseEnter={handleHover}
                onClick={() => handleOpenProject(project)}
                className="glass-panel p-6 rounded-xl border border-gray-800/60 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[280px] relative group interactive-card"
              >
                <div>
                  {/* Category Pill */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/15 font-mono text-[8px] text-cyan-300 uppercase tracking-widest">
                      {project.category}
                    </span>
                    <span className="font-mono text-[9px] text-gray-500">{project.year}</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold font-display text-slate-100 group-hover:text-cyan-300 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-gray-800/40 pt-4 mt-auto">
                  <div className="flex flex-wrap gap-1">
                    {project.tech.slice(0, 3).map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-gray-900/80 font-mono text-[8px] text-slate-500">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Eye className="w-4 h-4 text-cyan-400 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}

          {activeTab === "designs" &&
            designsData.map((design) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                onMouseEnter={handleHover}
                onClick={() => handleOpenDesign(design)}
                className="glass-panel p-5 rounded-xl border border-gray-800/60 hover:border-purple-500/30 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[440px] relative group interactive-card"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-400/15 font-mono text-[8px] text-purple-300 uppercase tracking-widest">
                      {design.category}
                    </span>
                    <span className="font-mono text-[9px] text-purple-400/50">UI CONCEPT</span>
                  </div>

                  {/* Dynamic interactive mini previews rendered inside the website card layout */}
                  {design.id === "design-1" && (
                    <div className="w-full h-36 rounded-lg bg-gray-950/80 border border-gray-900/60 relative overflow-hidden flex flex-col justify-between p-3 mb-4 shadow-inner pointer-events-none">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.04)_0%,transparent_70%)]" />
                      <div className="absolute top-2 left-2 font-mono text-[6px] text-cyan-400/70">AETHERIA_PORTAL_v1</div>
                      <div className="flex-1 flex items-center justify-center relative">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          className="w-16 h-16 border border-dashed border-cyan-400/30 rounded-full flex items-center justify-center"
                        >
                          <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="w-10 h-10 border border-double border-purple-400/25 rounded-full"
                          />
                        </motion.div>
                        <div className="absolute font-display text-[7px] text-center text-slate-300 font-bold tracking-[0.2em] uppercase">
                          BEYOND
                        </div>
                      </div>
                      <div className="flex justify-between items-center font-mono text-[5px] text-slate-600">
                        <span>LAT_0.00</span>
                        <span>AEROSPACE CO.</span>
                      </div>
                    </div>
                  )}

                  {design.id === "design-2" && (
                    <div className="w-full h-36 rounded-lg bg-gray-950/80 border border-gray-900/60 p-3 relative overflow-hidden flex flex-col justify-between mb-4 shadow-inner font-mono pointer-events-none">
                      <div className="flex justify-between items-center border-b border-gray-900/60 pb-1.5">
                        <span className="text-[6px] text-purple-400/70 font-bold">HELIOS_GRID</span>
                        <span className="text-[6px] text-green-400 animate-pulse">● ACTIVE</span>
                      </div>
                      <div className="flex-1 flex gap-2 items-center justify-center my-1">
                        <div className="flex-1 flex flex-col justify-end gap-1.5 h-12 border-l border-b border-gray-900/40 px-1 relative">
                          <div className="flex items-end justify-between w-full h-8">
                            {[0.8, 0.4, 0.9, 0.6, 0.75, 0.3, 0.85].map((val, i) => (
                              <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${val * 100}%` }}
                                transition={{ delay: i * 0.05, duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                                className="w-1 bg-gradient-to-t from-purple-500/40 to-cyan-400"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="w-16 space-y-1 p-1 rounded bg-gray-900/40 border border-gray-800/40 text-[5px]">
                          <div className="flex justify-between text-slate-600">
                            <span>EFF:</span>
                            <span className="text-purple-400 font-bold">98%</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>AMP:</span>
                            <span className="text-cyan-400 font-bold">4.1K</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[5px] text-slate-600">
                        <span>SYS_CAL</span>
                        <span>34.2 °C</span>
                      </div>
                    </div>
                  )}

                  {design.id === "design-3" && (
                    <div className="w-full h-36 rounded-lg bg-gray-950/80 border border-gray-900/60 p-3 relative overflow-hidden flex flex-col justify-between mb-4 shadow-inner font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-[6px] text-pink-400/75">VORTEX_SEQ_v2</span>
                        <Music className="w-2.5 h-2.5 text-pink-400/70 animate-bounce" />
                      </div>
                      <div className="flex-1 my-1.5 flex flex-col justify-center gap-1.5 pointer-events-none">
                        <div className="grid grid-cols-8 gap-0.5">
                          {Array.from({ length: 16 }).map((_, idx) => (
                            <motion.div
                              key={idx}
                              animate={{ opacity: idx % 3 === 0 ? [0.4, 1, 0.4] : 0.3 }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.08 }}
                              className="w-full aspect-square rounded-sm bg-pink-500/80 border border-pink-500/10 shadow-[0_0_4px_rgba(255,0,127,0.05)]"
                            />
                          ))}
                        </div>
                        <div className="space-y-0.5">
                          <div className="w-full h-0.5 bg-gray-900 rounded-full relative">
                            <motion.div
                              animate={{ left: ["5%", "90%", "5%"] }}
                              transition={{ duration: 3.5, repeat: Infinity }}
                              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-100 border border-pink-400"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[5px] text-slate-600">
                        <span>BATTERY: 88%</span>
                        <span>MASTER_OUT</span>
                      </div>
                    </div>
                  )}

                  {design.id === "design-4" && (
                    <div className="w-full h-36 rounded-lg bg-gray-950/80 border border-cyan-500/20 p-3 relative overflow-hidden flex flex-col justify-between mb-4 shadow-inner font-mono text-cyan-400/80 pointer-events-none">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
                      <div className="flex justify-between items-center border-b border-cyan-950/40 pb-1">
                        <span className="text-[6px] tracking-wider font-bold">DRONE_HUD_v4</span>
                        <span className="text-[6px] text-amber-400/80 animate-pulse">LOCK</span>
                      </div>
                      <div className="flex-1 flex gap-3 items-center justify-center my-1">
                        <div className="w-12 h-12 border border-cyan-500/20 rounded-full flex items-center justify-center relative">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-t border-cyan-400/60 rounded-full"
                          />
                          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping shadow-[0_0_6px_#00f0ff]" />
                        </div>
                        <div className="flex-1 space-y-0.5 bg-cyan-950/10 p-1 rounded border border-cyan-500/10 text-[5px]">
                          <div className="flex justify-between">
                            <span>ALT:</span>
                            <span className="text-white">41.2K KM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>VEL:</span>
                            <span className="text-white">12.8 M/S</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[5px] text-slate-600">
                        <span>MINING RIG v8.2</span>
                        <span>60FPS</span>
                      </div>
                    </div>
                  )}

                  {design.id === "design-5" && (
                    <div className="w-full h-36 rounded-lg bg-neutral-900 border border-neutral-800/60 p-3 relative overflow-hidden flex flex-col justify-between mb-4 shadow-inner font-mono text-amber-400/80 pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-neutral-950/30 via-transparent to-neutral-800/10" />
                      <div className="flex justify-between items-center">
                        <span className="text-[6px] text-neutral-500">QUANTUM_VAULT</span>
                        <div className="w-1 h-1 rounded-full bg-amber-400/70 animate-ping" />
                      </div>
                      <div className="my-1 text-center space-y-0.5">
                        <span className="text-[5px] text-neutral-500 uppercase">ASSETS</span>
                        <div className="text-[10px] font-bold text-slate-100">
                          142.08 <span className="text-amber-400 text-[8px]">SOL</span>
                        </div>
                        <div className="w-full h-4 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center relative overflow-hidden">
                          <motion.div
                            animate={{
                              height: ["20%", "55%", "20%"]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-0 left-0 w-full bg-amber-400/5"
                          />
                          <span className="text-[5px] text-neutral-500 uppercase tracking-wider">MERCURY_FLOW</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[5px] text-neutral-600">
                        <span>TITAN_Q1</span>
                        <span>SECURED</span>
                      </div>
                    </div>
                  )}

                  <h3 className="text-lg font-bold font-display text-slate-100 group-hover:text-purple-300 transition-colors mb-1.5">
                    {design.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-light line-clamp-2">
                    {design.description}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-gray-800/40 pt-3 mt-4">
                  <div className="flex flex-wrap gap-1">
                    {design.techStack.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-gray-900/80 font-mono text-[8px] text-slate-500">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-400 text-[10px] font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                    <span>SPEC</span>
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* FULLSCREEN CONCEPT DETAILS OVERLAY MODALS */}
      <AnimatePresence>
        {/* Design Concept Modal */}
        {selectedDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cyber-black/95 z-[9999] overflow-y-auto flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-5xl glass-panel border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[550px]"
            >
              {/* Concept Sandbox Demo Panel (7 Columns) */}
              <div className="lg:col-span-7 bg-cyber-dark/85 p-6 flex flex-col justify-between border-r border-gray-800/60 relative min-h-[350px]">
                {/* Visual Header */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-purple-400 uppercase tracking-widest">
                    <MonitorUp className="w-3.5 h-3.5 animate-pulse" />
                    <span>CONCEPT_PROTOTYPE_STABLE</span>
                  </div>
                </div>

                {/* Simulated Coded Device Frame containing active concept graphics */}
                <div className="flex-1 flex items-center justify-center py-6 px-4 z-10">
                  {selectedDesign.id === "design-1" && (
                    /* AETHERIA PORTAL: Minimal luxury geometry wireframe screen */
                    <div className="w-full max-w-md h-56 rounded-lg bg-gray-950 border border-gray-800/80 relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
                      {/* Grid bg */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)] pointer-events-none" />
                      <div className="absolute top-4 left-4 font-mono text-[7px] text-cyan-400">AETHERIA_PORTAL_v1</div>
                      
                      {/* Rotating procedural geometry vector lines */}
                      <div className="flex-1 flex items-center justify-center relative">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          className="w-24 h-24 border border-dashed border-cyan-400/40 rounded-full flex items-center justify-center"
                        >
                          <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border border-double border-purple-400/30 rounded-full"
                          />
                        </motion.div>
                        <div className="absolute font-display text-[11px] text-center text-slate-100 font-bold tracking-[0.2em] uppercase">
                          BEYOND EARTH
                        </div>
                      </div>

                      <div className="flex justify-between items-center font-mono text-[7px] text-slate-500">
                        <span>LATITUDE_0.00</span>
                        <span>LUXURY AEROSPACE CO.</span>
                      </div>
                    </div>
                  )}

                  {selectedDesign.id === "design-2" && (
                    /* HELIOS CONTROL CENTER: Operational Telemetry system */
                    <div className="w-full max-w-md h-56 rounded-lg bg-gray-950 border border-gray-800/80 p-4 relative overflow-hidden flex flex-col justify-between shadow-2xl font-mono">
                      <div className="flex justify-between items-center border-b border-gray-900 pb-2">
                        <span className="text-[7px] text-purple-400 font-bold">HELIOS_GRID_SYS</span>
                        <span className="text-[7px] text-green-400 animate-pulse">● TELEMETRY_ACTIVE</span>
                      </div>

                      {/* Moving vector wave graphics */}
                      <div className="flex-1 flex gap-2 items-center justify-center my-2">
                        {/* Vector bar dials */}
                        <div className="flex-1 flex flex-col justify-end gap-1.5 h-20 border-l border-b border-gray-900 px-2 relative">
                          <div className="absolute right-2 top-2 text-[6px] text-slate-500">GRID_CAPS</div>
                          <div className="flex items-end justify-between w-full h-12">
                            {[0.8, 0.4, 0.9, 0.6, 0.75, 0.3, 0.85].map((val, i) => (
                              <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${val * 100}%` }}
                                transition={{ delay: i * 0.05, duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                                className="w-2.5 bg-gradient-to-t from-purple-500/40 to-cyan-400"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Metric readout */}
                        <div className="w-28 space-y-1.5 p-2 rounded bg-gray-900/60 border border-gray-800">
                          <div className="flex justify-between text-[6px] text-slate-500">
                            <span>GRID_EFF</span>
                            <span className="text-purple-400">98.4%</span>
                          </div>
                          <div className="flex justify-between text-[6px] text-slate-500">
                            <span>AMP_OUTPUT</span>
                            <span className="text-cyan-400">4,120 A</span>
                          </div>
                          <div className="flex justify-between text-[6px] text-slate-500">
                            <span>VIBE_COGNITIVE</span>
                            <span className="text-green-400 font-bold">STABLE</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[6px] text-slate-500">
                        <span>CAL_REF_SYSTEMS</span>
                        <span>TEMP: 34.2 °C</span>
                      </div>
                    </div>
                  )}

                  {selectedDesign.id === "design-3" && (
                    /* VORTEX SOUND: Tactile Mobile UI Knobs sequencer */
                    <div className="w-44 h-72 rounded-3xl bg-slate-950 border-4 border-gray-800 p-4 relative overflow-hidden flex flex-col justify-between shadow-2xl font-mono">
                      {/* Speaker grill */}
                      <div className="w-12 h-1.5 rounded-full bg-gray-900 mx-auto mb-3" />

                      <div className="flex justify-between items-center">
                        <span className="text-[6px] text-pink-400">VORTEX_SEQ_v2</span>
                        <Music className="w-3 h-3 text-pink-400 animate-bounce" />
                      </div>

                      {/* Sequencer matrix grids */}
                      <div className="flex-1 my-3 flex flex-col justify-center gap-1.5">
                        <span className="text-[6px] text-slate-500 uppercase tracking-wider">SEQUENCE MAP</span>
                        <div className="grid grid-cols-4 gap-1">
                          {Array.from({ length: 16 }).map((_, idx) => (
                            <motion.button
                              key={idx}
                              animate={{ opacity: idx % 3 === 0 ? [0.4, 1, 0.4] : 0.3 }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.1 }}
                              className="w-full aspect-square rounded bg-pink-500 border border-pink-500/20 shadow-[0_0_8px_rgba(255,0,127,0.1)]"
                            />
                          ))}
                        </div>
                        
                        {/* Metallic Slider dial */}
                        <div className="space-y-1 mt-2">
                          <div className="flex justify-between text-[5px] text-slate-400">
                            <span>FREQ_FILTER</span>
                            <span>420HZ</span>
                          </div>
                          <div className="w-full h-1 bg-gray-900 rounded-full relative">
                            <motion.div
                              animate={{ left: ["10%", "80%", "10%"] }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-100 shadow border border-pink-400"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[5px] text-slate-500">
                        <span>BATTERY: 88%</span>
                        <span>MASTER_OUT_STABLE</span>
                      </div>
                    </div>
                  )}

                  {selectedDesign.id === "design-4" && (
                    /* SPECTRA NEBULA HUD: Interactive Circular holographic scope */
                    <div className="w-full max-w-md h-56 rounded-lg bg-gray-950 border border-cyan-500/30 p-4 relative overflow-hidden flex flex-col justify-between shadow-2xl font-mono text-cyan-400">
                      {/* Grid scanning effect */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />
                      
                      <div className="flex justify-between items-center border-b border-cyan-950 pb-2 z-10">
                        <span className="text-[8px] tracking-wider font-bold">SPECTRA_DRONE_HUD_v4</span>
                        <span className="text-[7px] text-amber-400 animate-pulse">SYS_LOCK: TARGET_ACQUIRED</span>
                      </div>

                      <div className="flex-1 flex gap-4 items-center justify-center my-2 relative z-10">
                        {/* Interactive Radar Ring */}
                        <div className="w-24 h-24 border border-cyan-500/30 rounded-full flex items-center justify-center relative">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-t-2 border-cyan-400 rounded-full opacity-60"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 2.2, repeat: Infinity }}
                            className="w-16 h-16 border border-dashed border-cyan-500/20 rounded-full flex items-center justify-center"
                          >
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_#00f0ff]" />
                          </motion.div>

                          {/* Blip dots */}
                          <span className="absolute top-3 right-6 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span className="absolute bottom-6 left-3 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        </div>

                        {/* Coordinates list */}
                        <div className="flex-1 space-y-1 bg-cyan-950/20 p-2.5 rounded border border-cyan-500/15 text-[7px] max-w-[160px]">
                          <div className="text-[8px] text-cyan-300 font-bold uppercase tracking-wider mb-1">DRONE TELEMETRY</div>
                          <div className="flex justify-between">
                            <span>ORBIT_ALT:</span>
                            <span className="text-white">41,209 KM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>VELOCITY:</span>
                            <span className="text-white">12.8 KM/S</span>
                          </div>
                          <div className="flex justify-between">
                            <span>GRID_COORD:</span>
                            <span className="text-white">[X3.4, Y9.1]</span>
                          </div>
                          <div className="flex justify-between">
                            <span>FUEL_CELL:</span>
                            <span className="text-white text-green-400">92%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[7px] text-slate-500 z-10">
                        <span>PLANETARY MINING RIG v8.2</span>
                        <span>FPS_LOCKED: 60FPS</span>
                      </div>
                    </div>
                  )}

                  {selectedDesign.id === "design-5" && (
                    /* QUANTUM LEDGER: Luxury Hardware Wallet */
                    <div className="w-44 h-72 rounded-3xl bg-neutral-900 border-4 border-neutral-800 p-4 relative overflow-hidden flex flex-col justify-between shadow-2xl font-mono text-amber-400">
                      {/* Brushed titanium surface highlights */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-neutral-950 via-transparent to-neutral-800/20 pointer-events-none" />

                      <div className="flex justify-between items-center z-10">
                        <span className="text-[7px] text-neutral-400 tracking-wider">QUANTUM_VAULT</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      </div>

                      {/* Liquid balance display */}
                      <div className="my-3 space-y-2 text-center z-10">
                        <span className="text-[6px] text-neutral-400 uppercase tracking-widest">CURRENT LIQUID ASSETS</span>
                        <div className="text-base font-bold text-slate-100 tracking-tight">
                          142.08 <span className="text-amber-400 text-[10px]">SOL</span>
                        </div>
                        
                        {/* Simulated liquid mercury pulse */}
                        <div className="w-full h-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center relative overflow-hidden">
                          <motion.div
                            animate={{
                              height: ["30%", "65%", "30%"],
                              borderRadius: ["20%", "40%", "20%"]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-0 left-0 w-full bg-amber-400/10 pointer-events-none"
                          />
                          <span className="text-[7px] text-neutral-500 uppercase tracking-widest">MERCURY_BALANCE_FLOW</span>
                        </div>
                      </div>

                      {/* Touch Biometric sensor loop */}
                      <div className="flex flex-col items-center gap-1.5 z-10">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="w-12 h-12 rounded-full bg-neutral-950 border border-amber-500/40 hover:border-amber-400 flex items-center justify-center cursor-pointer relative"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-1.5 border border-dashed border-amber-500/30 rounded-full"
                          />
                          <span className="text-[6px] text-amber-300 tracking-widest font-bold">SCAN</span>
                        </motion.button>
                        <span className="text-[5px] text-neutral-500 uppercase">PLACE FINGERPRINT KEY</span>
                      </div>

                      <div className="flex justify-between items-center text-[5px] text-neutral-500 z-10">
                        <span>MODEL_TITAN_Q1</span>
                        <span>STABLE_SECURE</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Procedural grid coordinate labels */}
                <div className="border-t border-gray-800/40 pt-4 flex justify-between items-center font-mono text-[9px] text-slate-500 z-10">
                  <span>MOUNT_VECTORS: DEVIL_LABS</span>
                  <span>SYS_STABLE: 120HZ</span>
                </div>
              </div>

              {/* Design Specifications Panel (5 Columns) */}
              <div className="lg:col-span-5 bg-cyber-dark p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  {/* Exit Close Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleClose}
                      className="p-1.5 rounded-full bg-gray-900 border border-gray-800 hover:border-purple-500 text-slate-400 hover:text-purple-300 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 font-mono text-[9px] text-purple-400 tracking-wider uppercase">
                      {selectedDesign.category}
                    </span>
                    <h3 className="text-3xl font-black font-display text-slate-100 text-purple-glow">
                      {selectedDesign.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">
                    {selectedDesign.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">
                      KEY_DESIGN_ELEMENTS:
                    </h4>
                    <ul className="space-y-2 font-mono text-xs text-slate-300">
                      {selectedDesign.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer spec tags */}
                <div className="space-y-4 pt-6 border-t border-gray-800/60">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDesign.techStack.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-gray-900 font-mono text-[9px] text-purple-300">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="font-mono text-[9px] text-slate-600 flex justify-between items-center">
                    <span>ARPAN STUDIO CREATIVE GROUP</span>
                    <span>©2026 COGNITIVE</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Project Details Modal */}
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cyber-black/95 z-[9999] overflow-y-auto flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-4xl glass-panel border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 font-mono text-[9px] text-cyan-400 tracking-wider uppercase">
                    {selectedProject.category} // PROJECT ARTIFACT
                  </span>
                  <h3 className="text-3xl font-black font-display text-slate-100 text-cyber-glow">
                    {selectedProject.title}
                  </h3>
                  <div className="flex gap-4 font-mono text-[10px] text-slate-500 uppercase">
                    <span>ROLE: {selectedProject.role}</span>
                    <span>YEAR: {selectedProject.year}</span>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full bg-gray-900 border border-gray-800 hover:border-cyan-500 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono text-slate-500 tracking-wider uppercase flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    PROJECT_SUMMARY
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans font-light">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono text-slate-500 tracking-wider uppercase flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    KEY_TECHNICAL_ACHIEVEMENTS
                  </h4>
                  <ul className="space-y-3 text-xs text-slate-400 font-sans font-light">
                    {selectedProject.features.map((feature, idx) => (
                      <li key={idx} className="flex gap-3 items-start leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_8px_#00ffff]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Specs & Tech Stack */}
              <div className="border-t border-gray-800/80 pt-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded bg-gray-950 border border-gray-800 font-mono text-[10px] text-cyan-300">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center font-mono text-[9px] text-slate-600">
                  <span>ENGINEER: ARPAN AKA DEVIL</span>
                  <span>BUILD_TAG: STABLE_COMPILED</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
