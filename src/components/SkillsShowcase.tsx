import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { skillsData } from "../data";
import { SkillNode } from "../types";
import { AudioEngine } from "./AudioEngine";
import { Brain, Star, Award, Layers, Sparkles, Cpu, ShieldAlert, ChevronRight } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function SkillsShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(skillsData[0]);
  const [hoveredSkillName, setHoveredSkillName] = useState<string | null>(null);
  const skillsRef = useRef<SkillNode[]>(skillsData);

  // Synchronized select callback for both visualizations
  const handleSelectSkill = (skill: SkillNode) => {
    setSelectedSkill(skill);
    AudioEngine.playClick();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = 360);

    const nodes = skillsRef.current.map((skill) => ({
      ...skill,
      currentAngle: skill.angle * (Math.PI / 180),
      currentRadius: skill.radius - 15, // slightly tighter orbit for side-by-side density
      pulse: Math.random() * Math.PI,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const centerX = width / 2;
      const centerY = height / 2;

      let found: SkillNode | null = null;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const x = centerX + Math.cos(node.currentAngle) * node.currentRadius;
        const y = centerY + Math.sin(node.currentAngle) * node.currentRadius;

        const dist = Math.hypot(mouseX - x, mouseY - y);
        if (dist < 18) {
          found = node;
          break;
        }
      }

      if (found) {
        if (hoveredSkillName !== found.name) {
          setHoveredSkillName(found.name);
          AudioEngine.playHover();
        }
      } else {
        setHoveredSkillName(null);
      }
    };

    const handleMouseClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const x = centerX + Math.cos(node.currentAngle) * node.currentRadius;
        const y = centerY + Math.sin(node.currentAngle) * node.currentRadius;

        const dist = Math.hypot(mouseX - x, mouseY - y);
        if (dist < 18) {
          handleSelectSkill(node);
          break;
        }
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseClick);

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        if (!canvas) return;
        width = canvas.width = canvas.parentElement?.clientWidth || 400;
        height = canvas.height = 360;
      });
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      [80, 100, 115].forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      const corePulse = Math.sin(Date.now() * 0.002) * 3;
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        2,
        centerX,
        centerY,
        15 + corePulse
      );
      coreGradient.addColorStop(0, "#00f0ff");
      coreGradient.addColorStop(0.5, "rgba(176, 38, 255, 0.25)");
      coreGradient.addColorStop(1, "rgba(7, 7, 18, 0)");

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20 + corePulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(0, 240, 255, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.stroke();

      nodes.forEach((node) => {
        node.currentAngle += 0.003;
        node.pulse += 0.02;

        const pulseScale = Math.sin(node.pulse) * 2;
        const x = centerX + Math.cos(node.currentAngle) * node.currentRadius;
        const y = centerY + Math.sin(node.currentAngle) * node.currentRadius;

        const isHovered = hoveredSkillName === node.name;
        const isSelected = selectedSkill?.name === node.name;

        const isCyan = node.category === "Languages" || node.category === "Creative/3D";
        const connectionAlpha = isHovered ? 0.4 : isSelected ? 0.3 : 0.06;
        ctx.strokeStyle = isCyan
          ? `rgba(0, 240, 255, ${connectionAlpha})`
          : `rgba(176, 38, 255, ${connectionAlpha})`;
        ctx.lineWidth = isHovered || isSelected ? 1.5 : 0.7;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();

        if (isSelected || isHovered) {
          ctx.shadowColor = isCyan ? "#00f0ff" : "#b026ff";
          ctx.shadowBlur = 10;
        }

        ctx.fillStyle = isCyan ? "#00f0ff" : "#b026ff";
        ctx.beginPath();
        ctx.arc(x, y, (isSelected || isHovered ? 6 : 4) + pulseScale * 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        ctx.strokeStyle = isCyan ? "rgba(0, 240, 255, 0.2)" : "rgba(176, 38, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 9 + pulseScale * 0.3, 0, Math.PI * 2);
        ctx.stroke();

        if (width > 320) {
          ctx.font = isSelected ? "bold 9px monospace" : "8px monospace";
          ctx.fillStyle = isSelected ? "#ffffff" : isHovered ? "#e2e8f0" : "#64748b";
          ctx.textAlign = x > centerX ? "left" : "right";
          const textOffset = x > centerX ? 12 : -12;
          ctx.fillText(node.name, x + textOffset, y + 2.5);
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseClick);
      resizeObserver.disconnect();
    };
  }, [hoveredSkillName, selectedSkill]);

  // Recharts radar data construction
  const radarData = skillsData.map((skill) => ({
    subject: skill.name,
    level: skill.level,
    category: skill.category,
    fullMark: 100,
  }));

  // Recharts interactive handlers
  const handleRadarClick = (state: any) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const subjectClicked = state.activePayload[0].payload.subject;
      const found = skillsData.find((s) => s.name === subjectClicked);
      if (found) {
        handleSelectSkill(found);
      }
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 relative z-10 select-none">
      {/* Section Header */}
      <div className="text-center mb-12 space-y-3">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 tracking-[0.3em] uppercase"
        >
          <Brain className="w-3.5 h-3.5 animate-pulse" />
          COGNITIVE CLUSTER MAINFLOW
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-100">
          TECHNICAL SKILLS METRICS
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto font-sans font-light">
          Compare core structures with the interactive multidimensional radar grid. Tap points on either visualization to analyze logs.
        </p>
      </div>

      {/* Main Dual Panels Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-8">
        {/* Panel 1: Neural Constellation Map */}
        <div className="flex flex-col justify-between glass-panel rounded-xl border border-gray-800/60 p-5 h-[410px] relative shadow-2xl bg-cyber-dark/5">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[9px] text-slate-500 uppercase flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-cyan-400" />
              SYSTEM_CONSTELLATION_DECODER
            </span>
            <span className="text-[8px] font-mono text-cyan-400 border border-cyan-400/20 px-1.5 py-0.5 rounded bg-cyan-400/5">
              ACTIVE VECTORS
            </span>
          </div>
          
          <div className="flex-1 flex justify-center items-center overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
          </div>
        </div>

        {/* Panel 2: Interactive Recharts Radar Chart */}
        <div className="flex flex-col justify-between glass-panel rounded-xl border border-gray-800/60 p-5 h-[410px] relative shadow-2xl bg-cyber-dark/5">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[9px] text-slate-500 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-purple-400" />
              RADAR_DIAGNOSTIC_POLAR_GRID
            </span>
            <span className="text-[8px] font-mono text-purple-400 border border-purple-400/20 px-1.5 py-0.5 rounded bg-purple-400/5">
              METRIC SYNC
            </span>
          </div>

          <div className="flex-1 w-full h-full min-h-[280px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData} onClick={handleRadarClick}>
                <defs>
                  <radialGradient id="radarGlowGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.35} />
                    <stop offset="75%" stopColor="#b026ff" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#000000" stopOpacity={0} />
                  </radialGradient>
                </defs>
                <PolarGrid stroke="#1e293b" strokeWidth={0.8} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#94a3b8", fontSize: 8, fontFamily: "monospace", fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "#475569", fontSize: 7, fontFamily: "monospace" }}
                  stroke="rgba(255, 255, 255, 0.05)"
                />
                <Radar
                  name="Proficiency"
                  dataKey="level"
                  stroke="#00f0ff"
                  strokeWidth={1.5}
                  fill="url(#radarGlowGrad)"
                  fillOpacity={0.6}
                  dot={{ r: 4, fill: "#b026ff", stroke: "#00f0ff", strokeWidth: 1 }}
                  activeDot={{ r: 6, fill: "#00f0ff", stroke: "#ffffff" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const isScl = selectedSkill?.name === data.subject;
                      return (
                        <div className="bg-gray-950 border border-cyan-400/30 p-2.5 rounded font-mono text-[9px] text-slate-300 shadow-xl space-y-1">
                          <p className="text-white font-bold">{data.subject}</p>
                          <p className="text-cyan-400">CATEGORY: {data.category}</p>
                          <p className="text-purple-400">STABILITY: {data.level}%</p>
                          {isScl && <p className="text-green-400 animate-pulse text-[8px] mt-1">LOCKED IN</p>}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Unified Specs Deck at the Bottom */}
      <AnimatePresence mode="wait">
        {selectedSkill ? (
          <motion.div
            key={selectedSkill.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-panel-neon p-6 rounded-xl border border-gray-800/80 bg-cyber-dark/30 shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Skill Identity */}
              <div className="md:col-span-4 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 font-mono text-[8px] text-cyan-400 tracking-wider uppercase">
                    {selectedSkill.category}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[9px] text-purple-400">
                    <Star className="w-3 h-3 fill-purple-400" />
                    DECIBEL LEVEL
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black font-display text-slate-100 tracking-wide text-cyber-glow">
                    {selectedSkill.name}
                  </h3>
                  <div className="flex items-center gap-1.5 font-mono text-[8px] text-slate-500 uppercase">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    STATION_MATRIX_PROFILED: YES
                  </div>
                </div>

                {/* Performance linear meter */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>EMULATION_STABILITY_INDEX</span>
                    <span className="text-cyan-400 font-bold">{selectedSkill.level}%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden border border-gray-800/30">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedSkill.level}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Middle Column: Detailed Tech Logs */}
              <div className="md:col-span-5 space-y-2 border-t md:border-t-0 md:border-l border-gray-800/50 pt-4 md:pt-0 md:pl-6">
                <h4 className="text-[9px] font-mono text-slate-500 tracking-widest uppercase mb-1">
                  CORE_FUNCTIONAL_LOGS:
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedSkill.details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-[11px] text-slate-300 font-mono bg-gray-950/40 px-2.5 py-1.5 rounded border border-gray-900"
                    >
                      <ChevronRight className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Signature / Security Status */}
              <div className="md:col-span-3 space-y-3 border-t md:border-t-0 md:border-l border-gray-800/50 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                <div className="bg-gray-950/60 p-3 rounded-lg border border-gray-900/60 space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                    <span>VERIFICATION_HASH:</span>
                    <span className="text-green-400 font-bold">MATCH</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                    <span>AETHER_SECURITY:</span>
                    <span className="text-cyan-400 font-bold">STABLE</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 border-t border-gray-900 pt-1.5">
                    <Award className="w-3 h-3 text-purple-400" />
                    <span>SYS: ARPAN_CORE</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="glass-panel p-6 text-center text-slate-500 font-mono text-xs">
            <ShieldAlert className="w-5 h-5 mx-auto mb-2 text-purple-500 animate-bounce" />
            <span>DECRYPT VECTOR INTERLOCK SECURED. SELECT DATA POINT.</span>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
