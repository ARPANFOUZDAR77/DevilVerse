export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  role: string;
  category: "Web3" | "AI" | "Immersive" | "Creative";
  year: string;
  demoUrl?: string;
  imageUrl?: string;
  features: string[];
}

export interface DesignAsset {
  id: string;
  title: string;
  category: "Landing Page" | "Dashboard" | "Mobile UI" | "Motion Graphics" | "Illustration";
  description: string;
  imageUrl: string;
  color: string;
  techStack: string[];
  highlights: string[];
}

export interface TimelineEvent {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  icon: string;
}

export interface SkillNode {
  name: string;
  category: "Languages" | "Frameworks" | "Creative/3D" | "Tools/DevOps";
  level: number; // 0-100
  angle: number; // For circular rendering
  radius: number; // Orbit distance
  details: string[];
}

export interface TerminalLog {
  text: string;
  type: "input" | "system" | "success" | "error" | "output" | "glitch";
}
