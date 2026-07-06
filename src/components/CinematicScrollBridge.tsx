import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { AudioEngine } from "./AudioEngine";
import {
  Compass,
  ArrowDown,
  Navigation,
  Globe,
  Radio,
  Zap,
  Terminal,
  ChevronDown,
} from "lucide-react";

interface CinematicWaypointProps {
  type: "zoom-portal" | "floating-world" | "cyber-tunnel" | "deep-space";
  title: string;
  subtitle: string;
  badge: string;
}

export default function CinematicScrollBridge({
  type,
  title,
  subtitle,
  badge,
}: CinematicWaypointProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Use motion's scroll listener for parallax and reactive zoom speeds
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const speedY = useTransform(scrollYProgress, [0, 1], [1, 4]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          // Play atmospheric transition chime sound
          AudioEngine.playHover();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Set up specific HTML5 Canvas rendering loops depending on waypoint type
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInView) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 340);

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        if (!canvas) return;
        width = canvas.width = canvas.parentElement?.clientWidth || 800;
        height = canvas.height = 340;
      });
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Initialize custom variables depending on particle style
    const particles: any[] = [];
    const maxParticles = type === "deep-space" ? 180 : 80;

    if (type === "zoom-portal") {
      // 3D Starfield Tunnel Zoom
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: (Math.random() - 0.5) * width,
          y: (Math.random() - 0.5) * height,
          z: Math.random() * width,
          size: Math.random() * 2 + 0.5,
          color: i % 2 === 0 ? "rgba(0, 240, 255, 0.85)" : "rgba(176, 38, 255, 0.85)",
        });
      }
    } else if (type === "floating-world") {
      // Floating hexagonal grid vectors
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 4 + 2,
          pulse: Math.random() * Math.PI,
        });
      }
    } else if (type === "cyber-tunnel") {
      // Depth tunnel perspective lines
      for (let i = 0; i < 15; i++) {
        particles.push({
          z: (i / 15) * 400, // Z perspective depths
          color: `rgba(16, 185, 129, ${0.1 + (i / 15) * 0.4})`,
        });
      }
    } else if (type === "deep-space") {
      // Deep space space nebula dust
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -Math.random() * 0.5 - 0.1, // Drifts upwards
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random(),
        });
      }
    }

    // Animation Tick Frame
    const tick = () => {
      ctx.fillStyle = "rgba(7, 7, 18, 0.26)"; // trailing fade blur
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      if (type === "zoom-portal") {
        // Starfield warp rendering
        particles.forEach((p) => {
          // Dynamic scroll factor adjusts warp zoom velocity
          p.z -= 4 * speedY.get();

          if (p.z <= 0) {
            p.z = width;
            p.x = (Math.random() - 0.5) * width;
            p.y = (Math.random() - 0.5) * height;
          }

          // Perspective scaling
          const scale = 260 / p.z;
          const px = cx + p.x * scale;
          const py = cy + p.y * scale;
          const size = p.size * scale;

          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(px, py, Math.min(6, size), 0, Math.PI * 2);
            ctx.fill();

            // Light trails
            ctx.strokeStyle = p.color;
            ctx.lineWidth = Math.min(2, size / 2);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px - p.x * 0.05 * speedY.get(), py - p.y * 0.05 * speedY.get());
            ctx.stroke();
          }
        });

        // Overlay central energetic wormhole pulse
        const t = Date.now() * 0.003;
        const gradient = ctx.createRadialGradient(cx, cy, 2, cx, cy, 140 + Math.sin(t) * 15);
        gradient.addColorStop(0, "rgba(0, 240, 255, 0.08)");
        gradient.addColorStop(0.5, "rgba(176, 38, 255, 0.03)");
        gradient.addColorStop(1, "rgba(7, 7, 18, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, 180, 0, Math.PI * 2);
        ctx.fill();

      } else if (type === "floating-world") {
        // drifting hexagons and interconnecting node connections
        const time = Date.now() * 0.001;
        
        // Drifting lines
        ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
        ctx.lineWidth = 1;
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          p.pulse += 0.02;
          const r = p.radius + Math.sin(p.pulse) * 1.5;

          ctx.fillStyle = `rgba(168, 85, 247, ${0.15 + Math.sin(p.pulse) * 0.1})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "rgba(0, 240, 255, 0.18)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, r + 4, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Connect nearby drifting world islands with lines
        ctx.strokeStyle = "rgba(0, 240, 255, 0.04)";
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
            if (dist < 110) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

      } else if (type === "cyber-tunnel") {
        // Perspective grids moving forward
        const scrollFactor = speedY.get();
        particles.forEach((p) => {
          p.z -= 1.8 * scrollFactor;
          if (p.z <= 0) {
            p.z = 400;
          }

          // Projection scale ratio
          const scale = 380 / p.z;
          const rSize = scale * 120; // grid size

          // Centered perspective square wireframe
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.min(2.5, scale * 1.2);
          ctx.strokeRect(cx - rSize, cy - rSize, rSize * 2, rSize * 2);

          // Draw perspective alignment connector rays from center of square outwards
          ctx.strokeStyle = "rgba(16, 185, 129, 0.05)";
          ctx.beginPath();
          ctx.moveTo(cx, cy); ctx.lineTo(cx - rSize, cy - rSize);
          ctx.moveTo(cx, cy); ctx.lineTo(cx + rSize, cy - rSize);
          ctx.moveTo(cx, cy); ctx.lineTo(cx - rSize, cy + rSize);
          ctx.moveTo(cx, cy); ctx.lineTo(cx + rSize, cy + rSize);
          ctx.stroke();
        });

      } else if (type === "deep-space") {
        // Gentle galaxy stellar drift
        particles.forEach((p) => {
          p.y += p.vy;
          p.x += p.vx;

          // Recycle particle at screen boundaries
          if (p.y < 0) p.y = height;
          if (p.x < 0 || p.x > width) p.x = Math.random() * width;

          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Ambient nebular overlay gradient
        const spacePulse = Math.sin(Date.now() * 0.001) * 30;
        const spaceGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 260 + spacePulse);
        spaceGrad.addColorStop(0, "rgba(88, 28, 135, 0.06)");
        spaceGrad.addColorStop(0.5, "rgba(59, 130, 246, 0.02)");
        spaceGrad.addColorStop(1, "rgba(7, 7, 18, 0)");
        ctx.fillStyle = spaceGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 300, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [isInView, speedY, type]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden border-t border-b border-gray-900/30 bg-cyber-black/75 py-12 flex flex-col items-center justify-center min-h-[300px]"
    >
      {/* Background HTML5 Canvas simulator */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-80">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Narrative Waypoint Overlay */}
      <div className="relative z-10 text-center px-6 max-w-xl space-y-4">
        {/* Animated Beacon Indicator Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 text-[9.5px] font-mono border px-2.5 py-1 rounded-full text-cyan-300 border-cyan-400/20 bg-cyan-400/5 uppercase tracking-[0.25em]"
        >
          {type === "zoom-portal" && <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
          {type === "floating-world" && <Globe className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />}
          {type === "cyber-tunnel" && <Terminal className="w-3.5 h-3.5 text-cyan-400" />}
          {type === "deep-space" && <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
          {badge}
        </motion.div>

        {/* Narrative Step Title */}
        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl font-extrabold font-display uppercase tracking-widest text-slate-100">
            {title}
          </h3>
          <p className="text-slate-400 text-xs font-sans font-light max-w-md mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Dynamic down indicator prompt */}
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="flex justify-center pt-2"
        >
          <ChevronDown className="w-4 h-4 text-cyan-400/60" />
        </motion.div>
      </div>
    </div>
  );
}
