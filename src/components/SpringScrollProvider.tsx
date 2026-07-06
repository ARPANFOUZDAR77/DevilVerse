import React, { createContext, useContext, useEffect, useRef } from "react";

interface SpringScrollContextProps {
  springScrollTo: (targetY: number) => void;
  scrollToSection: (id: string) => void;
}

const SpringScrollContext = createContext<SpringScrollContextProps | null>(null);

export function useSpringScroll() {
  const context = useContext(SpringScrollContext);
  if (!context) {
    throw new Error("useSpringScroll must be used within a SpringScrollProvider");
  }
  return context;
}

export const SpringScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollData = useRef({
    targetY: typeof window !== "undefined" ? window.scrollY : 0,
    currentY: typeof window !== "undefined" ? window.scrollY : 0,
    isAnimating: false,
    rafId: 0,
    lastTime: 0,
  });

  const springScrollTo = (targetY: number) => {
    const data = scrollData.current;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    data.targetY = Math.max(0, Math.min(targetY, maxScroll));

    if (data.isAnimating) return;
    data.isAnimating = true;
    data.lastTime = performance.now();

    const animate = (now: number) => {
      const deltaMs = Math.min(now - data.lastTime, 32); // clamp to avoid giant jumps on frame drops
      data.lastTime = now;

      const diff = data.targetY - data.currentY;

      // Adjust interpolation factor based on delta-time to ensure consistent speed across 60Hz/120Hz/144Hz displays
      // base speed is 0.07 at 16.67ms (60fps)
      const interpolationFactor = 1 - Math.pow(1 - 0.07, deltaMs / 16.67);

      if (Math.abs(diff) < 0.3) {
        data.currentY = data.targetY;
        window.scrollTo(0, data.currentY);
        data.isAnimating = false;
        return;
      }

      data.currentY += diff * interpolationFactor;
      window.scrollTo(0, data.currentY);

      data.rafId = requestAnimationFrame(animate);
    };

    data.rafId = requestAnimationFrame(animate);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Calculate top position taking header height (16px * 4 = 64px) into account
      const offsetTop = el.getBoundingClientRect().top + window.scrollY - 64;
      springScrollTo(offsetTop);
    }
  };

  useEffect(() => {
    const data = scrollData.current;

    // Synchronize scroll values on manual/native scrolling that we didn't initiate
    const syncScroll = () => {
      if (!data.isAnimating) {
        data.targetY = window.scrollY;
        data.currentY = window.scrollY;
      }
    };

    window.addEventListener("scroll", syncScroll, { passive: true });

    // Handle smooth wheel interception
    const handleWheel = (e: WheelEvent) => {
      // Detect if user is hovering inside scrollable areas
      const target = e.target as HTMLElement | null;
      if (target) {
        // Exclude inputs, textareas, terminal consoles, scroll buffers, custom 3D sliders
        const isScrollableElement =
          target.closest(".overflow-y-auto") ||
          target.closest(".scrollbar-thin") ||
          target.closest("textarea") ||
          target.closest("pre") ||
          target.closest("input[type='range']");

        if (isScrollableElement) {
          // Sync targets to actual current positions after they finish scrolling
          setTimeout(() => {
            if (!data.isAnimating) {
              data.targetY = window.scrollY;
              data.currentY = window.scrollY;
            }
          }, 50);
          return; // Let standard scrolling happen inside this element
        }
      }

      // Detect trackpad swipe or mouse wheel. Trackpads generate high frequency, smaller delta steps.
      // We also verify touch capable devices to disable completely on mobile safari/chrome.
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      if (isTouchDevice) {
        return; // Allow native momentum scrolling on touch devices
      }

      e.preventDefault();

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      // Normal mouse wheel has deltaY around 100, trackpads around 10-30.
      // Boost the wheel movement slightly for mouse scroll, keep it natural.
      const boostFactor = Math.abs(e.deltaY) >= 100 ? 1.4 : 1.0;
      data.targetY = Math.max(0, Math.min(data.targetY + e.deltaY * boostFactor, maxScroll));

      if (!data.isAnimating) {
        data.isAnimating = true;
        data.lastTime = performance.now();

        const tick = (now: number) => {
          const deltaMs = Math.min(now - data.lastTime, 32);
          data.lastTime = now;

          const diff = data.targetY - data.currentY;
          // Interpolate with spring constant
          const interpolationFactor = 1 - Math.pow(1 - 0.08, deltaMs / 16.67);

          if (Math.abs(diff) < 0.3) {
            data.currentY = data.targetY;
            window.scrollTo(0, data.currentY);
            data.isAnimating = false;
            return;
          }

          data.currentY += diff * interpolationFactor;
          window.scrollTo(0, data.currentY);
          data.rafId = requestAnimationFrame(tick);
        };

        data.rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("scroll", syncScroll);
      window.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(data.rafId);
    };
  }, []);

  return (
    <SpringScrollContext.Provider value={{ springScrollTo, scrollToSection }}>
      {children}
    </SpringScrollContext.Provider>
  );
};
