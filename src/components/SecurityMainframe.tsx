import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AudioEngine } from "./AudioEngine";
import {
  Shield,
  ShieldAlert,
  Terminal,
  Activity,
  Cpu,
  Zap,
  RefreshCw,
  Sliders,
  Skull,
  Fingerprint,
  Lock,
  Unlock,
  KeyRound,
  EyeOff,
  BellRing,
} from "lucide-react";

interface ThreatPacket {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
  isThreat: boolean; // false means safe data packet (blue), true means injection threat (red)
  angle: number;
}

interface ShieldNode {
  id: number;
  x: number;
  y: number;
  radius: number;
  angle: number; // angle around central core
  active: boolean;
}

interface ThreatIntelLog {
  id: string;
  timestamp: string;
  message: string;
  type: "intercept" | "breach" | "sys" | "pulse";
  strength: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
}

export default function SecurityMainframe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shieldIntegrity, setShieldIntegrity] = useState(100);
  const [blockedCount, setBlockedCount] = useState(0);
  const [shieldFrequency, setShieldFrequency] = useState(1.0);
  const [threatIntensity, setThreatIntensity] = useState(1.0);
  const [lockdownMode, setLockdownMode] = useState(false);
  const [securityBypassCode, setSecurityBypassCode] = useState("");
  const [bypassStatus, setBypassStatus] = useState<"idle" | "error" | "success">("idle");
  const [threatLogs, setThreatLogs] = useState<ThreatIntelLog[]>([
    {
      id: "init-1",
      timestamp: new Date().toISOString().slice(11, 19),
      message: "SYSTEM ONLINE: Establishing orbit shield deflector matrix.",
      type: "sys",
      strength: 78.5,
    },
    {
      id: "init-2",
      timestamp: new Date().toISOString().slice(11, 19),
      message: "INITIALIZING TELEMETRY FILTER... Safe packets processed.",
      type: "sys",
      strength: 82.0,
    },
  ]);

  const shieldNodesRef = useRef<ShieldNode[]>([
    { id: 1, x: 0, y: 0, radius: 24, angle: 0, active: true },
    { id: 2, x: 0, y: 0, radius: 24, angle: 120, active: true },
    { id: 3, x: 0, y: 0, radius: 24, angle: 240, active: true },
  ]);

  const packetsRef = useRef<ThreatPacket[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const integrityRef = useRef(100);

  // Sync state for animation loop
  useEffect(() => {
    integrityRef.current = shieldIntegrity;
  }, [shieldIntegrity]);

  // Push secure system logs periodically
  useEffect(() => {
    if (lockdownMode) return;

    const securityLines = [
      "INTEGRITY CHECK: KERNEL SIGNATURE MATCHES ARPAN_CORE",
      "BLOCKED Brute-Force SSH injection attempt from IP 185.220.101.42",
      "ROTATED public authentication handshake token index_4",
      "DEEP MEMORY INTRUSION DETECTION: ZERO ANOMALIES",
      "ENCRYPTING CACHED STORAGE BLOCKS WITH AES-256-GCM",
      "ANTI-DDOS LAYER active: rate-limiting high-frequency handshakes",
      "DNS spoofing audit resolved: local resolver verified",
      "SYS SHIELD: Automated defensive nodes refreshed",
    ];

    const interval = setInterval(() => {
      const randomLine = securityLines[Math.floor(Math.random() * securityLines.length)];
      const timestamp = new Date().toISOString().slice(11, 19);
      setThreatLogs((prev) => {
        const nextStrength = Math.round((integrityRef.current * 0.4 + shieldFrequency * 20 + (1 / threatIntensity) * 15 + blockedCount * 1.5) * 10) / 10;
        return [{
          id: Math.random().toString(),
          timestamp,
          message: randomLine,
          type: "sys" as const,
          strength: nextStrength,
        }, ...prev.slice(0, 15)];
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [lockdownMode, shieldFrequency, threatIntensity, blockedCount]);

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 360);

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        if (!canvas) return;
        width = canvas.width = canvas.parentElement?.clientWidth || 500;
        height = canvas.height = 360;
      });
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const coreX = width / 2;
    const coreY = height / 2;
    const coreRadius = 35;
    const shieldOrbitRadius = 85;

    let lastSpawn = 0;

    // Canvas interactivity
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Click to reinforce nodes or trigger immediate system blast
      const distanceToCore = Math.hypot(clickX - coreX, clickY - coreY);
      if (distanceToCore < coreRadius) {
        // Trigger defensive pulse blast
        AudioEngine.playSecret();
        const timestamp = new Date().toISOString().slice(11, 19);
        setThreatLogs((prev) => {
          const nextStrength = Math.round((integrityRef.current * 0.4 + shieldFrequency * 20 + (1 / threatIntensity) * 15 + blockedCount * 1.5) * 10) / 10;
          return [{
            id: Math.random().toString(),
            timestamp,
            message: "DEFENSIVE PULSE: High-energy EMP wave cleared localized danger sectors.",
            type: "pulse" as const,
            strength: Math.min(100, nextStrength + 25),
          }, ...prev.slice(0, 15)];
        });
        
        // Push all packets away
        packetsRef.current.forEach((p) => {
          const dx = p.x - coreX;
          const dy = p.y - coreY;
          const dist = Math.hypot(dx, dy);
          p.vx = (dx / dist) * 8;
          p.vy = (dy / dist) * 8;
        });

        // Spawn a ton of safe green sparks
        for (let i = 0; i < 40; i++) {
          const sparkAngle = Math.random() * Math.PI * 2;
          const sparkSpeed = Math.random() * 5 + 2;
          sparksRef.current.push({
            x: coreX,
            y: coreY,
            vx: Math.cos(sparkAngle) * sparkSpeed,
            vy: Math.sin(sparkAngle) * sparkSpeed,
            color: "#00f0ff",
            alpha: 1.0,
          });
        }
      }
    };

    canvas.addEventListener("mousedown", handleCanvasClick);

    // Animation frames loop
    const tick = () => {
      ctx.fillStyle = "rgba(7, 7, 18, 0.22)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 1. Draw central Arpan Server Mainframe Node
      const timeMs = Date.now();
      const corePulse = Math.sin(timeMs * 0.003) * 4;
      const coreGradient = ctx.createRadialGradient(cx, cy, 5, cx, cy, coreRadius + corePulse);
      
      if (integrityRef.current > 40) {
        coreGradient.addColorStop(0, "#00f0ff");
        coreGradient.addColorStop(0.5, "rgba(0, 240, 255, 0.2)");
        coreGradient.addColorStop(1, "rgba(7, 7, 18, 0)");
      } else {
        coreGradient.addColorStop(0, "#f43f5e");
        coreGradient.addColorStop(0.5, "rgba(244, 63, 94, 0.2)");
        coreGradient.addColorStop(1, "rgba(7, 7, 18, 0)");
      }

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius + corePulse + 10, 0, Math.PI * 2);
      ctx.fill();

      // Main inner computer core
      ctx.fillStyle = integrityRef.current > 40 ? "#020617" : "#1e050b";
      ctx.strokeStyle = integrityRef.current > 40 ? "#00f0ff" : "#f43f5e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Core icon label
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = integrityRef.current > 40 ? "#00f0ff" : "#f43f5e";
      ctx.textAlign = "center";
      ctx.fillText("DEVIL_CORE", cx, cy - 2);
      ctx.font = "8px monospace";
      ctx.fillStyle = "#64748b";
      ctx.fillText(`${integrityRef.current}% SECURE`, cx, cy + 10);

      // 2. Render and orbit defensive deflector shield arcs
      shieldNodesRef.current.forEach((node) => {
        // Slow orbit
        node.angle += 0.015 * shieldFrequency;
        
        // Calculate coordinate positions relative to central core
        node.x = cx + Math.cos(node.angle) * shieldOrbitRadius;
        node.y = cy + Math.sin(node.angle) * shieldOrbitRadius;

        // Draw deflector arc line
        ctx.strokeStyle = integrityRef.current > 40 ? "#b026ff" : "#ea580c";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(
          cx,
          cy,
          shieldOrbitRadius,
          node.angle - 0.45,
          node.angle + 0.45
        );
        ctx.stroke();

        // Draw node points
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Spawn Threat Packets
      if (timeMs - lastSpawn > 800 / threatIntensity && !lockdownMode) {
        lastSpawn = timeMs;
        const spawnFromEdge = Math.random() > 0.3; // mostly spawn from edges
        let sx = 0, sy = 0;
        
        if (spawnFromEdge) {
          const side = Math.floor(Math.random() * 4);
          if (side === 0) { sx = Math.random() * width; sy = 0; }
          else if (side === 1) { sx = width; sy = Math.random() * height; }
          else if (side === 2) { sx = Math.random() * width; sy = height; }
          else { sx = 0; sy = Math.random() * height; }
        } else {
          // Spawn in outer ring
          const ringAngle = Math.random() * Math.PI * 2;
          sx = cx + Math.cos(ringAngle) * 220;
          sy = cy + Math.sin(ringAngle) * 220;
        }

        const angleToCore = Math.atan2(cy - sy, cx - sx);
        const isThreat = Math.random() > 0.35; // 65% red injections, 35% safe telemetry streams

        packetsRef.current.push({
          id: Math.random(),
          x: sx,
          y: sy,
          vx: Math.cos(angleToCore) * (isThreat ? 1.4 : 1.0),
          vy: Math.sin(angleToCore) * (isThreat ? 1.4 : 1.0),
          radius: isThreat ? 4 : 3,
          speed: isThreat ? 1.4 : 1.0,
          isThreat,
          angle: angleToCore,
        });
      }

      // 3. Update & Draw Packets
      packetsRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Draw glow path
        ctx.fillStyle = p.isThreat ? "rgba(244, 63, 94, 0.8)" : "rgba(16, 185, 129, 0.8)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Check deflector shield collisions
        let deflected = false;
        
        // Check if the packet is crossing the shield orbit
        const distToCoreForShield = Math.hypot(p.x - cx, p.y - cy);
        if (Math.abs(distToCoreForShield - shieldOrbitRadius) < 10) {
          const pAngle = Math.atan2(p.y - cy, p.x - cx);
          shieldNodesRef.current.forEach((node) => {
            // Find angular distance between packet and the center of the rotating node arc
            const angleDiff = Math.abs(Math.atan2(Math.sin(pAngle - node.angle), Math.cos(pAngle - node.angle)));
            // Arc covers from angle - 0.45 to angle + 0.45. Let's make it 0.55 rad wide for a more forgiving, rewarding deflect zone.
            if (angleDiff < 0.55) {
              deflected = true;
            }
          });
        }

        // Fallback or double check with the node's center dot
        if (!deflected) {
          shieldNodesRef.current.forEach((node) => {
            const distToShieldNode = Math.hypot(p.x - node.x, p.y - node.y);
            if (distToShieldNode < 24) {
              deflected = true;
            }
          });
        }

        if (deflected) {
          AudioEngine.playHover();
          // Bounce/Scatter away from shield node direction
          const bounceAngle = Math.atan2(p.y - cy, p.x - cx) + (Math.random() - 0.5) * 1.5;
          p.vx = Math.cos(bounceAngle) * 3;
          p.vy = Math.sin(bounceAngle) * 3;

          const timestamp = new Date().toISOString().slice(11, 19);
          if (p.isThreat) {
            setBlockedCount((b) => b + 1);
            setThreatLogs((prev) => {
              const nextStrength = Math.round((integrityRef.current * 0.4 + shieldFrequency * 20 + (1 / threatIntensity) * 15 + (blockedCount + 1) * 1.5) * 10) / 10;
              return [{
                id: Math.random().toString(),
                timestamp,
                message: `INTERCEPTED: Malicious payload deflection at coordinate (${Math.round(p.x)}, ${Math.round(p.y)})`,
                type: "intercept" as const,
                strength: nextStrength,
              }, ...prev.slice(0, 15)];
            });
          } else {
            setThreatLogs((prev) => {
              const nextStrength = Math.round((integrityRef.current * 0.4 + shieldFrequency * 20 + (1 / threatIntensity) * 15 + blockedCount * 1.5) * 10) / 10;
              return [{
                id: Math.random().toString(),
                timestamp,
                message: `FILTERED: Non-malicious telemetry packet synchronized securely.`,
                type: "sys" as const,
                strength: nextStrength,
              }, ...prev.slice(0, 15)];
            });
          }
          p.isThreat = false; // rendered safe now!

          // Spawn vibrant sparks
          for (let s = 0; s < 6; s++) {
            sparksRef.current.push({
              x: p.x,
              y: p.y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              color: "#b026ff",
              alpha: 1.0,
            });
          }
          
          // Filter out of list or let it scatter away
          packetsRef.current.splice(idx, 1);
          return;
        }

        // Check mainframe core collision
        const distToCore = Math.hypot(p.x - cx, p.y - cy);
        if (distToCore < coreRadius) {
          const timestamp = new Date().toISOString().slice(11, 19);
          if (p.isThreat) {
            // Core breached! Core gets hit
            AudioEngine.playGlitch();
            setShieldIntegrity((prev) => {
              const next = Math.max(0, prev - 3);
              if (next === 0 && !lockdownMode) {
                // Trigger auto quarantine lock
                setLockdownMode(true);
                AudioEngine.playSecret();
              }
              return next;
            });

            setThreatLogs((prev) => {
              const nextStrength = Math.round((Math.max(0, integrityRef.current - 3) * 0.4 + shieldFrequency * 20 + (1 / threatIntensity) * 15 + blockedCount * 1.5) * 10) / 10;
              return [{
                id: Math.random().toString(),
                timestamp,
                message: `CORE BREACH: Malicious packet bypassed deflectors! Integrity critical.`,
                type: "breach" as const,
                strength: nextStrength,
              }, ...prev.slice(0, 15)];
            });

            // Red sparks
            for (let s = 0; s < 12; s++) {
              sparksRef.current.push({
                x: p.x,
                y: p.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: "#f43f5e",
                alpha: 1.0,
              });
            }
          } else {
            // Safe telemetry stream processed successfully!
            setShieldIntegrity((prev) => Math.min(100, prev + 4));

            setThreatLogs((prev) => {
              const nextStrength = Math.round((Math.min(100, integrityRef.current + 4) * 0.4 + shieldFrequency * 20 + (1 / threatIntensity) * 15 + blockedCount * 1.5) * 10) / 10;
              return [{
                id: Math.random().toString(),
                timestamp,
                message: `SECURED HANDSHAKE: core-to-server connection established successfully. (+4% stability)`,
                type: "sys" as const,
                strength: nextStrength,
              }, ...prev.slice(0, 15)];
            });
          }

          packetsRef.current.splice(idx, 1);
        }
      });

      // 4. Update & Draw Sparks
      sparksRef.current.forEach((sp, idx) => {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= 0.03;
        if (sp.alpha <= 0) {
          sparksRef.current.splice(idx, 1);
          return;
        }
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousedown", handleCanvasClick);
      resizeObserver.disconnect();
    };
  }, [shieldFrequency, threatIntensity, lockdownMode]);

  const handleManualLockdown = () => {
    AudioEngine.playSecret();
    setLockdownMode(true);
    setShieldIntegrity(0);
    const timestamp = new Date().toISOString().slice(11, 19);
    setThreatLogs((prev) => [
      {
        id: Math.random().toString(),
        timestamp,
        message: "QUARANTINE PROTOCOL INITIATED BY STATION OPERATOR. System lockdown active.",
        type: "breach" as const,
        strength: 0,
      },
      ...prev.slice(0, 15),
    ]);
  };

  const handleBypassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = securityBypassCode.trim().toLowerCase();
    if (code === "devil" || code === "arpan-override") {
      AudioEngine.playSuccess();
      setBypassStatus("success");
      setTimeout(() => {
        setLockdownMode(false);
        setShieldIntegrity(100);
        setSecurityBypassCode("");
        setBypassStatus("idle");
        const timestamp = new Date().toISOString().slice(11, 19);
        setThreatLogs((prev) => [
          {
            id: Math.random().toString(),
            timestamp,
            message: "DECRYPT ACCESS KEY AUTHORIZED. Decrypt key accord: GRANTED.",
            type: "sys" as const,
            strength: 75.0,
          },
          {
            id: Math.random().toString(),
            timestamp,
            message: "RESTORING ARPAN FIREWALL LAYERS... ALL NETWORKS ONLINE AND STABLE.",
            type: "sys" as const,
            strength: 95.0,
          },
          ...prev.slice(0, 14),
        ]);
      }, 1500);
    } else {
      AudioEngine.playGlitch();
      setBypassStatus("error");
      setTimeout(() => setBypassStatus("idle"), 2000);
    }
  };

  const currentSecurityStrength = Math.round((shieldIntegrity * 0.4 + shieldFrequency * 20 + (1 / threatIntensity) * 15 + blockedCount * 1.5) * 10) / 10;

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 relative z-10 select-none">
      {/* Section Header */}
      <div className="text-center mb-12 space-y-3">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-purple-400 tracking-[0.3em] uppercase"
        >
          <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
          CRYPTOGRAPHIC SHIELD INTERCEPT
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-100 uppercase">
          Firewall Mainframe
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto font-sans font-light">
          Defend Arpan's server against threat injection vectors. Adjust threat rates, monitor decrypted handshakes, or test isolation safeguards.
        </p>
      </div>

      {/* Cyber Security Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
        
        {/* Left Console Grid (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between glass-panel rounded-xl border border-gray-800/60 p-6 relative bg-cyber-dark/10 shadow-2xl overflow-hidden min-h-[420px]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.01] to-cyan-500/[0.01] pointer-events-none" />

          {/* Normal Active Simulator Screen */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="font-mono text-[10px] text-cyan-400 tracking-wider uppercase">
                  ACTIVE_INTRUSION_FIREWALL
                </span>
              </div>
              <span className="text-[8px] font-mono text-purple-400 border border-purple-400/20 px-1.5 py-0.5 rounded bg-purple-400/5 uppercase">
                Deflectors: ONLINE
              </span>
            </div>

            {/* Interactive Defensive Screen Overlay inside simulator */}
            <div className="relative h-56 rounded-lg bg-gray-950/90 border border-gray-900 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.1)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
              
              {/* Actual Simulator Canvas */}
              <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

              {/* Lockdown Quarantine Overlay */}
              <AnimatePresence>
                {lockdownMode && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-red-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 z-40"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full"
                    >
                      <ShieldAlert className="w-8 h-8" />
                    </motion.div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-mono font-bold text-red-400 tracking-wider uppercase">
                        CRITICAL LOCKOUT STATUS
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400 max-w-sm">
                        System automatically isolated to secure credentials. Enter Arpan's bypass code below to restore firewall integrity layers.
                      </p>
                    </div>

                    <form onSubmit={handleBypassSubmit} className="flex flex-col items-center gap-2 w-full max-w-xs">
                      <div className="flex items-center gap-2 w-full bg-gray-950 border border-red-500/30 rounded px-3 py-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <input
                          type="password"
                          value={securityBypassCode}
                          onChange={(e) => setSecurityBypassCode(e.target.value)}
                          placeholder="Decrypt code (devil)"
                          className="bg-transparent border-none outline-none font-mono text-[10px] text-slate-200 placeholder-slate-700 w-full"
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full py-2 rounded text-[9px] font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer border flex items-center justify-center gap-1.5 bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20"
                      >
                        {bypassStatus === "idle" && "CONFIRM DECRYPTION CODES"}
                        {bypassStatus === "error" && "INVALID HANDSHAKE CHECKSUM"}
                        {bypassStatus === "success" && "BYPASS AUTHORIZED... RESTORING"}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Simulated telemetry details */}
            <div className="grid grid-cols-2 gap-4 font-mono text-[9px] text-slate-500">
              <div className="bg-gray-950 p-2.5 rounded border border-gray-900 flex justify-between items-center">
                <span>REJECTED INJECTIONS</span>
                <span className="text-cyan-400 font-bold">{blockedCount} VECTORS</span>
              </div>
              <div className="bg-gray-950 p-2.5 rounded border border-gray-900 flex justify-between items-center">
                <span>DEFLECTION ANGLE RATE</span>
                <span className="text-purple-400 font-bold">{(shieldFrequency * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Console Diagnostics (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-panel rounded-xl border border-gray-800/60 p-6 space-y-6 bg-cyber-dark/10 shadow-2xl">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <h3 className="text-xs font-mono text-purple-400 tracking-wider uppercase">
                  SECURITY STATS MATRIX
                </h3>
              </div>
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
            </div>

            {/* Interactive Integrity bar gauges */}
            <div className="space-y-4 font-mono text-[10px]">
              
              {/* Integrity Shield Gauge */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>CORE SHIELD STABILITY</span>
                  <span className={`${shieldIntegrity > 40 ? "text-cyan-400" : "text-red-400"} font-bold`}>
                    {shieldIntegrity}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-900 rounded overflow-hidden">
                  <motion.div
                    animate={{ width: `${shieldIntegrity}%` }}
                    className={`h-full transition-colors duration-300 ${
                      shieldIntegrity > 40 ? "bg-cyan-400" : "bg-red-500 animate-pulse"
                    }`}
                  />
                </div>
              </div>

              {/* Adjust Deflector Speed */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-purple-400" /> DEFLECTOR ORBIT FREQUENCY
                  </span>
                  <span className="text-purple-400 font-bold">{shieldFrequency.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={shieldFrequency}
                  onChange={(e) => {
                    setShieldFrequency(parseFloat(e.target.value));
                    AudioEngine.playHover();
                  }}
                  className="w-full h-1 bg-gray-800 rounded appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Adjust Threat Rate */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> INCOMING THREAT VELOCITY
                  </span>
                  <span className="text-amber-400 font-bold">{threatIntensity.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.25"
                  value={threatIntensity}
                  onChange={(e) => {
                    setThreatIntensity(parseFloat(e.target.value));
                    AudioEngine.playHover();
                  }}
                  className="w-full h-1 bg-gray-800 rounded appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Real-time Threat Intelligence Feed & Security Strength Feedback */}
          <div className="flex-1 flex flex-col justify-between pt-4 border-t border-gray-900/60 min-h-[220px]">
            <div className="space-y-3">
              
              {/* Dynamic Security Strength Meter Card */}
              <div className="bg-gray-950/70 p-3 rounded-lg border border-gray-900 flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.04)_0%,transparent_70%)] pointer-events-none" />
                
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-slate-400 tracking-wider flex items-center gap-1">
                    <Activity className="w-3 h-3 text-purple-400 animate-pulse" />
                    LIVE SECURITY STRENGTH
                  </span>
                  
                  {/* Status badge based on calculated strength */}
                  <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
                    currentSecurityStrength >= 100 
                      ? "text-purple-400 border border-purple-500/20 bg-purple-500/10 animate-pulse"
                      : currentSecurityStrength >= 70
                      ? "text-cyan-400 border border-cyan-500/20 bg-cyan-500/10"
                      : currentSecurityStrength >= 40
                      ? "text-amber-400 border border-amber-500/20 bg-amber-500/10"
                      : "text-red-400 border border-red-500/20 bg-red-500/10 animate-bounce"
                  }`}>
                    {currentSecurityStrength >= 100 
                      ? "MAX_DEFENSE_LOAD"
                      : currentSecurityStrength >= 70
                      ? "ROBUST_SAFEGUARD"
                      : currentSecurityStrength >= 40
                      ? "MODERATE_SHIELD"
                      : "CRITICAL_EXPOSURE"}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold font-display tracking-tight text-white">
                    {currentSecurityStrength.toFixed(1)}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    GigaOps / Sec
                  </span>
                </div>

                {/* Micro visual indicator line */}
                <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${Math.min(100, (currentSecurityStrength / 130) * 100)}%` }}
                    className={`h-full ${
                      currentSecurityStrength >= 100 
                        ? "bg-gradient-to-r from-cyan-400 to-purple-500"
                        : currentSecurityStrength >= 70
                        ? "bg-cyan-400"
                        : currentSecurityStrength >= 40
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                </div>
              </div>

              {/* Scrolling Threat Intelligence Logs */}
              <div className="space-y-1.5">
                <h4 className="text-[9px] font-mono text-slate-500 tracking-widest uppercase flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-purple-400" />
                  REAL-TIME_THREAT_INTELLIGENCE_FEED
                </h4>
                
                <div className="bg-gray-950 p-2.5 rounded border border-gray-900 h-32 overflow-y-auto font-mono text-[8.5px] leading-relaxed text-slate-400 space-y-1.5 scrollbar-thin">
                  <AnimatePresence initial={false}>
                    {threatLogs.map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-1 border-b border-gray-900/40 pb-1.5 last:border-0"
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-bold px-1 rounded-[3px] text-[7.5px] ${
                            log.type === "intercept" 
                              ? "bg-purple-950/80 text-purple-300 border border-purple-900/60"
                              : log.type === "breach"
                              ? "bg-red-950/80 text-red-300 border border-red-900/60 animate-pulse"
                              : log.type === "pulse"
                              ? "bg-cyan-950/80 text-cyan-300 border border-cyan-900/60"
                              : "bg-gray-900 text-slate-400 border border-gray-800"
                          }`}>
                            {log.type === "intercept" && "DEFLECTED"}
                            {log.type === "breach" && "BREACH_ALERT"}
                            {log.type === "pulse" && "EMP_DETONATE"}
                            {log.type === "sys" && "INTEL_TELEMETRY"}
                          </span>
                          <div className="flex items-center gap-1.5 text-[7.5px] text-slate-600">
                            <span>{log.timestamp}</span>
                            <span className="text-slate-500 bg-gray-900/60 px-1 rounded border border-gray-900">
                              {log.strength.toFixed(1)} GS
                            </span>
                          </div>
                        </div>
                        <span className={`text-[8.5px] pl-0.5 leading-snug ${
                          log.type === "breach" 
                            ? "text-red-400 font-medium" 
                            : log.type === "intercept"
                            ? "text-slate-200"
                            : log.type === "pulse"
                            ? "text-cyan-300"
                            : "text-slate-400 font-light"
                        }`}>
                          {log.message}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-gray-900/50">
              <button
                type="button"
                onClick={handleManualLockdown}
                className="w-full py-2 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-red-500/50 rounded font-mono text-[9px] text-slate-400 hover:text-red-300 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-red-500" />
                MANUAL LOCK SYSTEM SECURITY
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
