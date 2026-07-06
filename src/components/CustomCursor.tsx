import { useEffect, useRef, useState } from "react";
import { AudioEngine } from "./AudioEngine";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [enabled, setEnabled] = useState(false);
  const rippleIdCounter = useRef(0);

  useEffect(() => {
    // Only enable custom cursor on desktop/mouse-enabled devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (isTouchDevice || prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    // Hide standard cursor
    document.body.style.cursor = "none";
    
    // Create global styling to hide cursor on links as well
    const style = document.createElement("style");
    style.innerHTML = `
      a, button, input, textarea, select, [role="button"] {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;

      // Check if mouse is currently hovering an interactive element
      const target = e.target as HTMLElement;
      if (target) {
        const isInteractive = 
          target.tagName === "BUTTON" || 
          target.tagName === "A" || 
          target.closest("button") || 
          target.closest("a") || 
          target.closest(".interactive-card") ||
          target.getAttribute("role") === "button" ||
          target.classList.contains("interactive-element");
        
        setIsHovered(!!isInteractive);
      }
    };

    // Click Ripple and sound trigger
    const handleMouseDown = (e: MouseEvent) => {
      AudioEngine.playClick();
      
      const newRipple = {
        id: rippleIdCounter.current++,
        x: e.clientX,
        y: e.clientY
      };
      
      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after transition
      const timer = setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);

    // Render loop for ultra-smooth spring motion of the trailing cursor ring
    let animationId: number;
    const ringPos = { x: 0, y: 0 };
    const dotPos = { x: 0, y: 0 };

    const render = () => {
      const mouse = mouseRef.current;
      const dot = dotRef.current;
      const ring = ringRef.current;

      // Instant dot tracing
      dotPos.x += (mouse.targetX - dotPos.x) * 0.4;
      dotPos.y += (mouse.targetY - dotPos.y) * 0.4;

      // Spring lagging trailing ring
      ringPos.x += (mouse.targetX - ringPos.x) * 0.12;
      ringPos.y += (mouse.targetY - ringPos.y) * 0.12;

      if (dot) {
        dot.style.transform = `translate3d(${dotPos.x - 4}px, ${dotPos.y - 4}px, 0)`;
      }

      if (ring) {
        ring.style.transform = `translate3d(${ringPos.x - 18}px, ${ringPos.y - 18}px, 0)`;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      document.body.style.cursor = "auto";
      try {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      } catch (e) {
        // ignore
      }
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        id="cursor-dot"
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cyan-400 pointer-events-none z-[9999] shadow-[0_0_8px_#00ffff]"
      />

      {/* Trailing Soft Halo Ring */}
      <div
        ref={ringRef}
        id="cursor-ring"
        style={{
          width: isHovered ? "50px" : "36px",
          height: isHovered ? "50px" : "36px",
          borderColor: isHovered ? "#b026ff" : "#00f0ff",
          backgroundColor: isHovered ? "rgba(176, 38, 255, 0.08)" : "transparent",
          boxShadow: isHovered ? "0 0 16px rgba(176, 38, 255, 0.4)" : "0 0 8px rgba(0, 240, 255, 0.2)",
          marginLeft: isHovered ? "-7px" : "0px",
          marginTop: isHovered ? "-7px" : "0px",
        }}
        className="fixed top-0 left-0 rounded-full border border-solid pointer-events-none z-[9998] transition-all duration-300 ease-out"
      />

      {/* Click Ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            transform: "translate(-50%, -50%)"
          }}
          className="fixed w-4 h-4 border-2 border-cyan-400 rounded-full pointer-events-none z-[9997] animate-ripple-expand opacity-0"
        />
      ))}
    </>
  );
}
