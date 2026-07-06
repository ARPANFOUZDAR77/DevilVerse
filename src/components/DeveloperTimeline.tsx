import { motion } from "motion/react";
import { timelineData } from "../data";
import { AudioEngine } from "./AudioEngine";
import { Terminal, Cpu, Compass, Zap, Milestone } from "lucide-react";

export default function DeveloperTimeline() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Terminal":
        return <Terminal className="w-4 h-4 text-cyan-400" />;
      case "Cpu":
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case "Compass":
        return <Compass className="w-4 h-4 text-pink-400" />;
      case "Zap":
        return <Zap className="w-4 h-4 text-yellow-400" />;
      default:
        return <Milestone className="w-4 h-4 text-cyan-400" />;
    }
  };

  const handleHover = () => {
    AudioEngine.playHover();
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-20 relative z-10 select-none">
      {/* Section Header */}
      <div className="text-center mb-16 space-y-3">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-purple-400 tracking-[0.3em] uppercase"
        >
          <Milestone className="w-3.5 h-3.5" />
          DEVELOPMENT TIMELINE
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-100">
          THE ROAD TO DEVILVERSE
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto font-sans font-light">
          A spatial chronicle mapping Arpan's evolution from procedural terminal scripts to world-class interactive architectures.
        </p>
      </div>

      {/* Timeline spine layout */}
      <div className="relative">
        {/* Glow pipeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent -translate-x-1/2 pointer-events-none" />

        <div className="space-y-12">
          {timelineData.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div
                key={index}
                className="relative flex flex-col md:flex-row items-start md:items-center justify-between"
              >
                {/* Node Anchor on the thread */}
                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-cyber-dark border border-gray-800 flex items-center justify-center -translate-x-1/2 z-20 shadow-[0_0_12px_rgba(0,240,255,0.15)]">
                  {getIcon(item.icon)}
                </div>

                {/* Left/Right Card position container */}
                <div className="w-full pl-12 md:pl-0 md:w-[45%]">
                  {isLeft ? (
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, type: "spring" }}
                      onMouseEnter={handleHover}
                      className="glass-panel p-6 rounded-xl border border-gray-800/60 hover:border-cyan-500/30 transition-all duration-300 relative group interactive-card"
                    >
                      <div className="flex flex-col gap-1.5 mb-3">
                        <span className="font-mono text-[10px] font-bold text-cyan-400 tracking-wider">
                          {item.year}
                        </span>
                        <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono italic">
                          {item.subtitle}
                        </p>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed font-light mb-4">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/10 font-mono text-[8px] text-cyan-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    // Spacer for large screens to maintain layout balance
                    <div className="hidden md:block" />
                  )}
                </div>

                {/* Left/Right offset element */}
                <div className="w-full pl-12 md:pl-0 md:w-[45%]">
                  {!isLeft ? (
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, type: "spring" }}
                      onMouseEnter={handleHover}
                      className="glass-panel p-6 rounded-xl border border-gray-800/60 hover:border-purple-500/30 transition-all duration-300 relative group interactive-card"
                    >
                      <div className="flex flex-col gap-1.5 mb-3">
                        <span className="font-mono text-[10px] font-bold text-purple-400 tracking-wider">
                          {item.year}
                        </span>
                        <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono italic">
                          {item.subtitle}
                        </p>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed font-light mb-4">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-400/10 font-mono text-[8px] text-purple-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    // Spacer for large screens
                    <div className="hidden md:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
