import { useEffect, useRef, useState } from "react";

interface BackgroundSystemProps {
  mode: "normal" | "matrix" | "cyber";
}

export default function BackgroundSystem({ mode }: BackgroundSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse coordinates smoothly (with interpolation/lag for elegant cursor lag)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Handle Resize using ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      window.requestAnimationFrame(() => {
        if (!canvasRef.current) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
      });
    });
    resizeObserver.observe(document.body);

    // Particle Setup
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      decaySpeed?: number;
    }

    // Respect user motion preferences & handle screen-density scale
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speedScale = prefersReducedMotion ? 0.05 : 1.0;
    const maxParticles = window.innerWidth < 768 ? 30 : 90;

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      const colors = ["#00f0ff", "#b026ff", "#00ffff", "#ffffff"];
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
    };

    initParticles();

    // Matrix Rain Stream Setup
    interface MatrixStream {
      x: number;
      y: number;
      speed: number;
      chars: string[];
      opacity: number;
    }
    let matrixStreams: MatrixStream[] = [];
    const charList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*+-/\\§".split("");

    const initMatrix = () => {
      matrixStreams = [];
      const columns = Math.floor(width / 20) + 1;
      for (let i = 0; i < columns; i++) {
        const streamChars: string[] = [];
        const length = Math.floor(Math.random() * 15) + 8;
        for (let j = 0; j < length; j++) {
          streamChars.push(charList[Math.floor(Math.random() * charList.length)]);
        }
        matrixStreams.push({
          x: i * 20,
          y: Math.random() * -height - 100,
          speed: Math.random() * 3 + 2,
          chars: streamChars,
          opacity: Math.random() * 0.7 + 0.3,
        });
      }
    };

    if (mode === "matrix") {
      initMatrix();
    }

    // Cyber Mode Grid & Ring system
    interface CyberRing {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      radius: number;
      maxRadius: number;
      speed: number;
      color: string;
    }
    const cyberRings: CyberRing[] = [];
    let gridOffset = 0;

    // Smooth cursor interpolation
    const updateMousePos = () => {
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.12;
      m.y += (m.targetY - m.y) * 0.12;
    };

    // Render loop
    const render = () => {
      // Pause drawing when tab is hidden to prevent unnecessary background tab battery/CPU drain
      if (document.hidden) {
        animationId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      updateMousePos();

      // Ambient background glow (Corner auroras in all modes)
      const gradient = ctx.createRadialGradient(
        width * 0.1,
        height * 0.1,
        10,
        0,
        0,
        Math.max(width, height) * 0.6
      );
      if (mode === "matrix") {
        gradient.addColorStop(0, "rgba(0, 20, 5, 0.4)");
        gradient.addColorStop(1, "rgba(3, 3, 5, 0.95)");
      } else if (mode === "cyber") {
        gradient.addColorStop(0, "rgba(50, 0, 80, 0.25)");
        gradient.addColorStop(0.5, "rgba(0, 20, 40, 0.15)");
        gradient.addColorStop(1, "rgba(2, 2, 4, 0.95)");
      } else {
        // Normal luxury
        gradient.addColorStop(0, "rgba(10, 15, 30, 0.5)");
        gradient.addColorStop(0.5, "rgba(16, 12, 32, 0.3)");
        gradient.addColorStop(1, "rgba(3, 3, 6, 0.98)");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Rendering styles based on active modes
      if (mode === "matrix") {
        // Matrix Rain Rendering
        ctx.font = "14px monospace";
        matrixStreams.forEach((stream) => {
          stream.chars.forEach((char, idx) => {
            const charY = stream.y + idx * 18;
            if (charY < 0 || charY > height) return;

            // First character is bright white, others are green fading out
            if (idx === 0) {
              ctx.fillStyle = `rgba(200, 255, 200, ${stream.opacity})`;
            } else {
              const alpha = stream.opacity * (1 - idx / stream.chars.length);
              ctx.fillStyle = `rgba(0, 255, 70, ${alpha})`;
            }

            // Occasional character morphing
            if (Math.random() < 0.02) {
              stream.chars[idx] = charList[Math.floor(Math.random() * charList.length)];
            }

            ctx.fillText(char, stream.x, charY);
          });

          // Move stream down
          stream.y += stream.speed * speedScale;
          if (stream.y > height) {
            stream.y = Math.random() * -150 - 50;
            stream.speed = Math.random() * 3 + 2;
          }
        });

        // Add binary stream mouse trail
        const m = mouseRef.current;
        if (m.x > 0 && Math.random() < 0.3) {
          ctx.fillStyle = "rgba(0, 255, 70, 0.8)";
          ctx.fillText(Math.random() > 0.5 ? "1" : "0", m.x + (Math.random() - 0.5) * 40, m.y + (Math.random() - 0.5) * 40);
        }
      } else if (mode === "cyber") {
        // Cyber Grid Layout
        ctx.strokeStyle = "rgba(0, 240, 255, 0.04)";
        ctx.lineWidth = 1;
        gridOffset = (gridOffset + 0.3) % 40;

        // Vertical lines
        for (let x = gridOffset; x < width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        // Horizontal lines
        for (let y = gridOffset; y < height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Draw orbital orbits & rings around cursor
        const m = mouseRef.current;
        if (m.x > 0) {
          ctx.strokeStyle = "rgba(176, 38, 255, 0.12)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(m.x, m.y, 110, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
          ctx.setLineDash([15, 10]);
          ctx.beginPath();
          ctx.arc(m.x, m.y, 180, gridOffset * 0.02, gridOffset * 0.02 + Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Floating retro particles
        particles.forEach((p) => {
          p.x += p.vx * 1.5 * speedScale;
          p.y += p.vy * 1.5 * speedScale;

          if (p.x < 0 || p.x > width) p.vx = -p.vx;
          if (p.y < 0 || p.y > height) p.vy = -p.vy;

          // Mouse proximity boost glow
          const m = mouseRef.current;
          let alpha = p.alpha;
          if (m.x > 0) {
            const dist = Math.hypot(p.x - m.x, p.y - m.y);
            if (dist < 200) {
              alpha = Math.min(0.9, p.alpha + (1 - dist / 200) * 0.7);
            }
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        });
      } else {
        // Normal Immersive Constellation (Minimal luxury)
        particles.forEach((p) => {
          p.x += p.vx * speedScale;
          p.y += p.vy * speedScale;

          // Boundary bouncing
          if (p.x < 0 || p.x > width) p.vx = -p.vx;
          if (p.y < 0 || p.y > height) p.vy = -p.vy;

          // Draw the star point
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Connect particles close to each other
        ctx.lineWidth = 0.6;
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

            if (dist < 110) {
              const alpha = (1 - dist / 110) * 0.18;
              ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        // Draw connections to mouse cursor smoothly
        const m = mouseRef.current;
        if (m.x > 0) {
          particles.forEach((p) => {
            const dist = Math.hypot(p.x - m.x, p.y - m.y);
            if (dist < 180) {
              const alpha = (1 - dist / 180) * 0.28;
              ctx.strokeStyle = `rgba(176, 38, 255, ${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(m.x, m.y);
              ctx.stroke();

              // Attract particle slightly to cursor for interactive feel
              p.x += (m.x - p.x) * 0.005;
              p.y += (m.y - p.y) * 0.005;
            }
          });

          // == HIGH QUALITY CURSOR TRACKER HUD IN WEB BG ==
          const time = Date.now() * 0.0015;
          ctx.strokeStyle = "rgba(0, 240, 255, 0.16)";
          ctx.lineWidth = 0.8;

          // Central miniature reticle
          ctx.beginPath();
          ctx.arc(m.x, m.y, 3, 0, Math.PI * 2);
          ctx.stroke();

          // Horizontal/Vertical tracker hairs
          ctx.beginPath();
          ctx.moveTo(m.x - 18, m.y); ctx.lineTo(m.x - 6, m.y);
          ctx.moveTo(m.x + 6, m.y); ctx.lineTo(m.x + 18, m.y);
          ctx.moveTo(m.x, m.y - 18); ctx.lineTo(m.x, m.y - 6);
          ctx.moveTo(m.x, m.y + 6); ctx.lineTo(m.x, m.y + 18);
          ctx.stroke();

          // Rotating dashed HUD targeting orbital ring
          ctx.strokeStyle = "rgba(176, 38, 255, 0.1)";
          ctx.setLineDash([3, 5]);
          ctx.beginPath();
          ctx.arc(m.x, m.y, 32, time, time + Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Elegant outer bracket corners
          ctx.strokeStyle = "rgba(0, 240, 255, 0.12)";
          const bs = 8; // Bracket size
          const bd = 44; // Bracket distance
          // Top-Left corner
          ctx.beginPath();
          ctx.moveTo(m.x - bd, m.y - bd + bs); ctx.lineTo(m.x - bd, m.y - bd); ctx.lineTo(m.x - bd + bs, m.y - bd);
          // Top-Right corner
          ctx.moveTo(m.x + bd, m.y - bd + bs); ctx.lineTo(m.x + bd, m.y - bd); ctx.lineTo(m.x + bd - bs, m.y - bd);
          // Bottom-Left corner
          ctx.moveTo(m.x - bd, m.y + bd - bs); ctx.lineTo(m.x - bd, m.y + bd); ctx.lineTo(m.x - bd + bs, m.y + bd);
          // Bottom-Right corner
          ctx.moveTo(m.x + bd, m.y + bd - bs); ctx.lineTo(m.x + bd, m.y + bd); ctx.lineTo(m.x + bd - bs, m.y + bd);
          ctx.stroke();

          // Floating real-time coordinate data readout text
          ctx.font = "bold 7.5px monospace";
          ctx.fillStyle = "rgba(0, 240, 255, 0.28)";
          ctx.textAlign = "left";
          ctx.fillText(`SYS_LOC: ${Math.round(m.x)}PX / ${Math.round(m.y)}PX`, m.x + 52, m.y - 12);
          
          ctx.fillStyle = "rgba(176, 38, 255, 0.24)";
          ctx.fillText(`L_PING: ${(12 + (Math.round(m.x) % 5)).toFixed(0)}MS`, m.x + 52, m.y - 2);
          
          ctx.fillStyle = "rgba(16, 185, 129, 0.22)";
          ctx.fillText("MATRIX_TRACKING: TRUE", m.x + 52, m.y + 8);
        }
      }


      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      id="bg-canvas"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
