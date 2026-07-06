import { Project, DesignAsset, TimelineEvent, SkillNode } from "./types";

export const projectsData: Project[] = [
  {
    id: "project-1",
    title: "NEURAL-SYNAPSE v2.5",
    description: "An AI-guided generative design workstation mapping human thought patterns to procedural visual nodes via local neural transformers.",
    tech: ["React 19", "Three.js", "WebAssembly", "TensorFlow.js", "GLSL Shaders"],
    role: "Lead Interactive Engineer",
    category: "AI",
    year: "2026",
    features: [
      "Procedural noise map generation using Rust-compiled WASM for 120 FPS calculations.",
      "Custom vertex & fragment shaders simulating cognitive waves with mouse cursor interaction.",
      "Hardware-accelerated rendering capable of displaying 250k particle nodes dynamically."
    ]
  },
  {
    id: "project-2",
    title: "KRONOS CHRONICLES",
    description: "An immersive spatial computing metaverse interface rendering hyper-fast chronological timelines as interactive celestial constellations.",
    tech: ["WebXR", "Vite", "D3.js", "Framer Motion", "WebAudio API"],
    role: "Creative Technologist",
    category: "Immersive",
    year: "2025",
    features: [
      "Custom WebAudio synthesizer crafting real-time ambient frequencies mapped to scroll velocity.",
      "Awwwards-inspired immersive fluid transitions utilizing SVG displacement filters.",
      "Optimized matrix math delivering flawless performance across mobile and desktop devices."
    ]
  },
  {
    id: "project-3",
    title: "SOLARIS DEX",
    description: "A dark high-fidelity decentralized financial terminal featuring real-time physical simulation of capital pools, complete with gravity wells and cosmic orbits.",
    tech: ["Next.js 15", "Tailwind CSS", "Canvas2D", "Drizzle ORM", "Matter.js"],
    role: "Full-Stack UI Architect",
    category: "Web3",
    year: "2025",
    features: [
      "Integrated 2D rigid-body physics engine simulating currency flow and transaction collisions.",
      "Adaptive dark-luxury glassmorphism UI reacting to ambient ledger fluctuations.",
      "Instant multi-wallet connection UI optimized for low-latency feedback."
    ]
  },
  {
    id: "project-4",
    title: "NEXUS SENTINEL v4.1",
    description: "An automated threat intelligence and security mainframe dashboard featuring an interactive deflector firewall and real-time network attack telemetry monitoring.",
    tech: ["React 18", "Tailwind CSS", "HTML5 Canvas", "Lucide Icons", "Audio Synth"],
    role: "Principal Security Dev",
    category: "Cybersecurity",
    year: "2026",
    features: [
      "Dynamic HTML5 canvas particle collision engine simulating high-velocity security packet deflection.",
      "Audio synthesis feedback generating customized low-frequency waveforms on user events.",
      "Real-time decryption handshake terminal processing continuous system audit telemetry logs."
    ]
  },
  {
    id: "project-5",
    title: "ASTRA BIOSYNTH v1.0",
    description: "A high-fidelity genetic sequencing synthesizer using hardware-accelerated shaders to pair double-helix chromosomes and simulate molecular gene mutation chains.",
    tech: ["WebGL", "GLSL", "React 19", "Framer Motion", "Three.js"],
    role: "Bio-Tech UI Lead",
    category: "Bio-Engineering",
    year: "2026",
    features: [
      "Simulates dynamic chromosome splitting sequences under active radiation modifiers in WebGL.",
      "Custom procedural gene mutation synthesizer translating nucleotide maps into polyphonic melodies.",
      "Advanced bento-grid panel containing interactive sliders to tweak base-pair density."
    ]
  }
];

export const designsData: DesignAsset[] = [
  {
    id: "design-1",
    title: "AETHERIA PORTAL",
    category: "Landing Page",
    description: "A luxury minimal landing page design for an aerospace tourism concept. Features sweeping geometric layouts, delicate serif typography, and extreme negative space.",
    imageUrl: "landing_aetheria",
    color: "#00f0ff",
    techStack: ["Figma", "Photoshop", "Cinema4D"],
    highlights: ["Interactive geometric grid", "Ambient backdrop-blur elements", "Cinematic parallax layout"]
  },
  {
    id: "design-2",
    title: "HELIOS CONTROL CENTER",
    category: "Dashboard",
    description: "A high-density operational telemetry dashboard for autonomous power grids. Maximizes data density with pure vector dials and active terminal panels.",
    imageUrl: "dashboard_helios",
    color: "#b026ff",
    techStack: ["Figma", "Illustrator", "After Effects"],
    highlights: ["SVG vector graph layouts", "Reactive status lightboards", "High-contrast telemetry tables"]
  },
  {
    id: "design-3",
    title: "VORTEX SOUND",
    category: "Mobile UI",
    description: "A tactile mobile audio sequencer concept. Features physical-looking dark metallic sliders, glowing knobs, and orbital sound wave visualizers.",
    imageUrl: "mobile_vortex",
    color: "#ff007f",
    techStack: ["Figma", "Blender", "Procreate"],
    highlights: ["Skeuomorphic metal surfaces", "Dynamic visualizer overlays", "Compact spatial navigation model"]
  },
  {
    id: "design-4",
    title: "SPECTRA NEBULA HUD",
    category: "Spatial HUD",
    description: "An ultra-futuristic holographic heads-up display dashboard designed for interstellar mining vessels. Contains active orbital path selectors and radial navigation coordinates.",
    imageUrl: "hud_spectra",
    color: "#06b6d4",
    techStack: ["Figma", "Vector Shader", "Spline 3D"],
    highlights: ["Dynamic orbital trajectory tracks", "Radial navigation gauges", "Real-time laser vector crosshairs"]
  },
  {
    id: "design-5",
    title: "QUANTUM LEDGER",
    category: "Mobile FinTech",
    description: "A premium luxury cryptographic wealth interface styling liquid mercury balances, biometric key handshakes, and absolute minimalist dark-platinum panel geometry.",
    imageUrl: "mobile_ledger",
    color: "#fbbf24",
    techStack: ["Figma", "KeyShot", "Framer Motion"],
    highlights: ["Simulated liquid mercury fluid balance", "Touch-sensitive biometric scanner loop", "Premium brushed titanium dark style"]
  }
];

export const timelineData: TimelineEvent[] = [
  {
    year: "2024 - PRESENT",
    title: "Creative Tech Lead",
    subtitle: "Devil Labs & Open Source Ventures",
    description: "Spearheading immersive web development. Designing custom physics libraries, highly animated WebGL canvas micro-sites, and leading UX exploration projects globally.",
    tags: ["Creative Direction", "Canvas Systems", "Performance Tuning"],
    icon: "Terminal"
  },
  {
    year: "2022 - 2024",
    title: "Senior UI/UX & WebAssembly Engineer",
    subtitle: "Chronos Cybernetic Solutions",
    description: "Bridged design systems and low-level code. Re-engineered data visualizations using WebAssembly in C++ to bypass JS processing lag, lifting FPS from 30 to a solid 120.",
    tags: ["WebAssembly", "C++", "D3.js", "Design Systems"],
    icon: "Cpu"
  },
  {
    year: "2020 - 2022",
    title: "Immersive Frontend Developer",
    subtitle: "Aether Interactive Agency",
    description: "Designed award-winning experiences for international brands. Specialized in scroll-driven cinematic stories, multi-layered parallax web pages, and heavy audio synthesis.",
    tags: ["GSAP", "Framer Motion", "WebAudio", "Interactive Art"],
    icon: "Compass"
  },
  {
    year: "2018",
    title: "The Genesis",
    subtitle: "Self-Guided Engineering Journey",
    description: "Fell down the rabbit hole of procedural geometry, shader structures, and terminal emulators. Began crafting custom digital interfaces under the handle 'Devil'.",
    tags: ["Procedural Art", "Web Standards", "Glitch Theory"],
    icon: "Zap"
  }
];

export const skillsData: SkillNode[] = [
  // Languages
  { name: "TypeScript", category: "Languages", level: 98, angle: 0, radius: 100, details: ["Advanced types", "ESNext systems", "Strict architecture"] },
  { name: "JavaScript", category: "Languages", level: 99, angle: 45, radius: 100, details: ["Engine internals", "Asynchronous logic", "Event loops"] },
  { name: "Rust / C++", category: "Languages", level: 85, angle: 90, radius: 110, details: ["WASM pipelines", "Memory safety", "Low-level structures"] },
  { name: "GLSL / Shaders", category: "Languages", level: 90, angle: 135, radius: 120, details: ["Vertex matrices", "Fragment math", "Procedural noise"] },
  
  // Frameworks
  { name: "React 19 / Next.js", category: "Frameworks", level: 95, angle: 180, radius: 115, details: ["Server Components", "Suspense boundaries", "Custom hook architectures"] },
  { name: "Vite / Bundlers", category: "Frameworks", level: 92, angle: 225, radius: 105, details: ["Hot compile setups", "Asset pipelines", "Rollup configs"] },
  
  // Creative/3D
  { name: "HTML5 Canvas", category: "Creative/3D", level: 98, angle: 270, radius: 120, details: ["Particle physics", "Double buffering", "Collision matrices"] },
  { name: "Framer Motion", category: "Creative/3D", level: 96, angle: 315, radius: 110, details: ["Layout animations", "Orchestrated triggers", "Spring constants"] },
  { name: "Three.js", category: "Creative/3D", level: 88, angle: 15, radius: 125, details: ["Mesh geometry", "Lighting setups", "Custom cameras"] },
  
  // Tools/DevOps
  { name: "Docker / Cloud Run", category: "Tools/DevOps", level: 82, angle: 105, radius: 130, details: ["Containerization", "VPC routing", "Continuous deployment"] },
  { name: "Git / Workflows", category: "Tools/DevOps", level: 94, angle: 160, radius: 110, details: ["Cherry-picks", "Interactive rebases", "CI/CD hooks"] }
];
