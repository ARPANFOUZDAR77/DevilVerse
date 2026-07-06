import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { AudioEngine } from "./AudioEngine";
import {
  Play,
  RotateCcw,
  Compass,
  MousePointerClick,
  Sliders,
  Activity,
  Wind,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

type PhysicsMode = "attract" | "repel" | "vortex" | "flow" | "gravity" | "chaos";

export default function InteractivePlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<PhysicsMode>("attract");
  const [particleCount, setParticleCount] = useState(1000);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [showStats, setShowStats] = useState(true);
  const [fps, setFps] = useState(60);

  // New Physics Emulation constants
  const [gravity, setGravity] = useState(0.8);
  const [elasticity, setElasticity] = useState(0.75);
  const [windForce, setWindForce] = useState(0.0);

  const statsRef = useRef({ fps: 60, particlesCount: 1000, mode: "attract" });
  const mouseRef = useRef({ x: -1000, y: -1000, isDown: false });
  const gravityRef = useRef(0.8);
  const elasticityRef = useRef(0.75);
  const windRef = useRef(0.0);

  useEffect(() => {
    statsRef.current.particlesCount = particleCount;
  }, [particleCount]);

  useEffect(() => {
    statsRef.current.mode = mode;
  }, [mode]);

  useEffect(() => {
    gravityRef.current = gravity;
  }, [gravity]);

  useEffect(() => {
    elasticityRef.current = elasticity;
  }, [elasticity]);

  useEffect(() => {
    windRef.current = windForce;
  }, [windForce]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 440);

    // Track frame rate dynamically
    let lastTime = performance.now();
    let frameCount = 0;

    // Resizing
    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        if (!canvas) return;
        width = canvas.width = canvas.parentElement?.clientWidth || 800;
        height = canvas.height = 440;
      });
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Interactive mouse trackers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.isDown = false;
    };

    const handleMouseDown = () => {
      mouseRef.current.isDown = true;
      AudioEngine.playClick();
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);

    // Particle structure
    interface SandboxParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      hue: number;
      originalHue: number;
      density: number;
    }

    let particles: SandboxParticle[] = [];

    const initParticles = (count: number) => {
      particles = [];
      const hues = [180, 280, 320, 200]; // Cyan, Purple, Pink, Ocean
      for (let i = 0; i < count; i++) {
        const baseHue = hues[Math.floor(Math.random() * hues.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: Math.random() * 2 + 0.8,
          hue: baseHue,
          originalHue: baseHue,
          density: Math.random() * 20 + 2,
        });
      }
    };

    initParticles(particleCount);

    let tick = 0;

    // Render / Update Loop
    const render = () => {
      tick++;
      // Clear with slight trailing fade (for beautiful motion blur effect)
      ctx.fillStyle = "rgba(7, 7, 18, 0.22)";
      ctx.fillRect(0, 0, width, height);

      // FPS tracking
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }

      const m = mouseRef.current;
      const currentMode = statsRef.current.mode;

      // Draw particle nodes
      particles.forEach((p) => {
        const sizeMultiplier = (currentMode === "gravity" || currentMode === "chaos") ? 2.2 : 1.0;
        const currentRadius = p.radius * sizeMultiplier;

        // Mode calculations
        if (m.x > 0 && m.x < width && m.y > 0 && m.y < height) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const dist = Math.hypot(dx, dy);

          // Interactive physics models
          if (currentMode === "attract") {
            if (dist < 320) {
              const force = (1 - dist / 320) * 0.28 * speedMultiplier;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
              p.hue = (p.originalHue + (320 - dist) * 0.15) % 360;
            } else {
              p.hue = p.originalHue;
            }
          } else if (currentMode === "repel") {
            if (dist < 180) {
              const force = (1 - dist / 180) * 0.65 * speedMultiplier;
              p.vx -= (dx / dist) * force;
              p.vy -= (dy / dist) * force;
              p.hue = 340; // Crimson Warning Hue
            } else {
              p.hue = p.originalHue;
            }
          } else if (currentMode === "vortex") {
            if (dist < 280) {
              const force = (1 - dist / 280) * 0.35 * speedMultiplier;
              // Perpendicular vector for swirling orbital
              const rx = -dy;
              const ry = dx;
              
              p.vx += (rx / dist) * force + (dx / dist) * 0.04;
              p.vy += (ry / dist) * force + (dy / dist) * 0.04;
              p.hue = (p.originalHue - (280 - dist) * 0.2) % 360;
            } else {
              p.hue = p.originalHue;
            }
          }
        } else {
          p.hue = p.originalHue;
        }

        // Noise/Flow field Mode
        if (currentMode === "flow") {
          const angle = Math.sin(p.x * 0.005) * Math.cos(p.y * 0.005) * Math.PI * 2;
          p.vx += Math.cos(angle) * 0.08 * speedMultiplier;
          p.vy += Math.sin(angle) * 0.08 * speedMultiplier;
        }

        // Gravity Emulation Mode (Custom physical ground bouncing)
        if (currentMode === "gravity") {
          // Accelerate downwards
          p.vy += gravityRef.current * 0.12 * speedMultiplier;
          // Apply horizontal wind force
          p.vx += windRef.current * 0.03 * speedMultiplier;

          // Ground bounce calculation
          if (p.y >= height - currentRadius) {
            p.y = height - currentRadius;
            p.vy = -p.vy * elasticityRef.current;
            p.vx *= 0.95; // floor friction
          } else if (p.y <= currentRadius) {
            p.y = currentRadius;
            p.vy = -p.vy * elasticityRef.current;
          }

          // Left/Right walls bounce
          if (p.x >= width - currentRadius) {
            p.x = width - currentRadius;
            p.vx = -p.vx * elasticityRef.current;
          } else if (p.x <= currentRadius) {
            p.x = currentRadius;
            p.vx = -p.vx * elasticityRef.current;
          }

          // Shifting hue based on velocity
          const speed = Math.hypot(p.vx, p.vy);
          p.hue = (p.originalHue + speed * 6) % 360;
        }

        // Chaos Brownian motion Mode (perfect physical collision with boundaries)
        if (currentMode === "chaos") {
          // Brownian random push
          p.vx += (Math.random() - 0.5) * 0.35 * speedMultiplier;
          p.vy += (Math.random() - 0.5) * 0.35 * speedMultiplier;

          // Wall boundary collision
          if (p.y >= height - currentRadius) {
            p.y = height - currentRadius;
            p.vy = -p.vy * elasticityRef.current;
          } else if (p.y <= currentRadius) {
            p.y = currentRadius;
            p.vy = -p.vy * elasticityRef.current;
          }

          if (p.x >= width - currentRadius) {
            p.x = width - currentRadius;
            p.vx = -p.vx * elasticityRef.current;
          } else if (p.x <= currentRadius) {
            p.x = currentRadius;
            p.vx = -p.vx * elasticityRef.current;
          }
          p.hue = (p.originalHue + Math.sin(tick * 0.05) * 30) % 360;
        }

        // Apply friction/drag to stabilize
        const dragCoefficient = (currentMode === "gravity" || currentMode === "chaos") ? 0.985 : 0.96;
        p.vx *= dragCoefficient;
        p.vy *= dragCoefficient;

        // Apply velocity coordinates
        p.x += p.vx;
        p.y += p.vy;

        // Out-of-bounds safety resets for non-bounce modes
        if (currentMode !== "gravity" && currentMode !== "chaos") {
          if (p.x < 0) p.x = width;
          else if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          else if (p.y > height) p.y = 0;
        }

        // Click Explosion effect
        if (m.isDown && m.x > 0) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            const force = (1 - dist / 110) * 3.5;
            p.vx -= (dx / dist) * force;
            p.vy -= (dy / dist) * force;
          }
        }

        // Render dot
        ctx.fillStyle = `hsla(${p.hue}, 95%, 60%, 0.85)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Overlay visual indicator on mouse cursor position
      if (m.x > 0 && m.x < width) {
        ctx.strokeStyle =
          currentMode === "repel"
            ? "rgba(255, 0, 70, 0.25)"
            : currentMode === "gravity"
            ? "rgba(168, 85, 247, 0.25)"
            : "rgba(0, 240, 255, 0.2)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(m.x, m.y, currentMode === "repel" ? 50 : 80, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    // Re-initialize particles when size/count changes
    const rebuildParticles = () => {
      initParticles(particleCount);
    };
    
    rebuildParticles();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      resizeObserver.disconnect();
    };
  }, [particleCount, speedMultiplier, mode]);

  const handleModeChange = (newMode: PhysicsMode) => {
    setMode(newMode);
    AudioEngine.playClick();
  };

  const handleReset = () => {
    AudioEngine.playSecret();
    setMode("attract");
    setParticleCount(1000);
    setSpeedMultiplier(1);
    setGravity(0.8);
    setElasticity(0.75);
    setWindForce(0.0);
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-20 relative z-10 select-none">
      {/* Header */}
      <div className="text-center mb-12 space-y-3">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-pink-400 tracking-[0.3em] uppercase"
        >
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
          KINETIC EXPERIMENT CHAMBER
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-100">
          PARTICLE PHYSICS SANDBOX
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto font-sans font-light">
          Manipulate high-density mathematical vector matrices in real-time. Drag or click on the frame to trigger physical forces and custom constraints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Controls Column */}
        <div className="lg:col-span-4 flex flex-col justify-between glass-panel rounded-xl border border-gray-800/60 p-6 space-y-6 bg-cyber-dark/5 shadow-2xl">
          {/* Simulation Modes */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-slate-500 tracking-wider uppercase flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-pink-400" />
              EMULATION_ALGORITHM
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "attract", label: "Attract" },
                { name: "repel", label: "Repel" },
                { name: "vortex", label: "Vortex" },
                { name: "flow", label: "Flow Field" },
                { name: "gravity", label: "Gravity 2D" },
                { name: "chaos", label: "Chaos Lab" },
              ].map((m) => (
                <button
                  key={m.name}
                  onClick={() => handleModeChange(m.name as PhysicsMode)}
                  className={`px-3 py-2.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border transition-all duration-300 cursor-pointer ${
                    mode === m.name
                      ? "bg-pink-500/15 text-pink-300 border-pink-500/50 shadow-[0_0_12px_rgba(255,0,127,0.2)]"
                      : "bg-gray-900/50 text-slate-400 border-gray-800/80 hover:border-gray-700 hover:text-slate-200"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Knobs / Settings Sliders */}
          <div className="space-y-4 pt-4 border-t border-gray-900/60">
            {/* Particle volume */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>NODE_MATRIX_VOLUME</span>
                <span className="text-cyan-400 font-bold">{particleCount} NODES</span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={particleCount}
                onChange={(e) => {
                  setParticleCount(Number(e.target.value));
                  AudioEngine.playHover();
                }}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Kinetic velocity multiplier */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>SPEED_MULTIPLIER</span>
                <span className="text-purple-400 font-bold">{speedMultiplier.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={speedMultiplier}
                onChange={(e) => {
                  setSpeedMultiplier(Number(e.target.value));
                  AudioEngine.playHover();
                }}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            {/* Conditionally rendered parameters for Gravity mode */}
            {mode === "gravity" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4 pt-2"
              >
                {/* Gravity Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-pink-400">
                      <Zap className="w-3 h-3" /> GRAVITY CONSTANT
                    </span>
                    <span className="text-pink-400 font-bold">{gravity.toFixed(2)}G</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={gravity}
                    onChange={(e) => {
                      setGravity(Number(e.target.value));
                      AudioEngine.playHover();
                    }}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>

                {/* Wind Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Wind className="w-3 h-3" /> WIND FORCE
                    </span>
                    <span className="text-amber-400 font-bold">
                      {windForce > 0 ? `+${windForce.toFixed(2)}` : windForce.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-1.5"
                    max="1.5"
                    step="0.1"
                    value={windForce}
                    onChange={(e) => {
                      setWindForce(Number(e.target.value));
                      AudioEngine.playHover();
                    }}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </motion.div>
            )}

            {/* Conditionally rendered parameters for Chaos / Gravity mode */}
            {(mode === "gravity" || mode === "chaos") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2 pt-2"
              >
                {/* Elasticity / Bounce Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Layers className="w-3 h-3" /> BOUNDARY ELASTICITY
                    </span>
                    <span className="text-cyan-400 font-bold">{(elasticity * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.05"
                    value={elasticity}
                    onChange={(e) => {
                      setElasticity(Number(e.target.value));
                      AudioEngine.playHover();
                    }}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Reset / Diagnostic Trigger */}
          <div className="pt-4 border-t border-gray-900/60 flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 px-4 rounded bg-gray-950 border border-gray-800 hover:border-pink-500/30 text-[10px] font-mono font-bold tracking-widest text-slate-400 hover:text-pink-300 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              RESET VARIABLES
            </button>
          </div>
        </div>

        {/* Sandbox Simulation Frame */}
        <div className="lg:col-span-8 flex flex-col justify-between glass-panel rounded-xl border border-gray-800/60 p-4 relative shadow-2xl min-h-[440px] bg-cyber-dark/5">
          {/* The physics canvas */}
          <div className="flex-1 relative overflow-hidden bg-gray-950/95 rounded-lg border border-gray-900 shadow-inner">
            <canvas ref={canvasRef} className="w-full h-full block" />
            
            {/* Click to spawn notice */}
            <div className="absolute bottom-3 left-4 text-[9px] font-mono text-slate-500 uppercase flex items-center gap-1.5 pointer-events-none">
              <MousePointerClick className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              DRAG & CLICK ON CANVAS TO EMIT KINETIC IMPACT WAVE
            </div>

            {/* Gravity Direction Marker overlay */}
            {mode === "gravity" && (
              <div className="absolute top-4 right-4 bg-purple-950/40 backdrop-blur-sm border border-purple-500/20 rounded p-2.5 font-mono text-[8px] text-purple-300 pointer-events-none uppercase space-y-1">
                <div className="flex items-center gap-1 text-pink-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
                  <span>2D_GRAVITY_VECTOR</span>
                </div>
                <div>DIRECTION: [0, 1] (DOWN)</div>
                <div>WIND_DRIFT: {windForce.toFixed(2)}</div>
              </div>
            )}
          </div>

          {/* Bottom Diagnostic statistics overlay */}
          {showStats && (
            <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-slate-500 border-t border-gray-900/60 pt-3 px-1">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>RENDERER_KINETICS: ACTIVE</span>
              </div>
              <div className="flex gap-4">
                <span>NODES: {particleCount}</span>
                <span className={fps < 50 ? "text-amber-500" : "text-green-500 font-bold"}>
                  {fps} FPS
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
