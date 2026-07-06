import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AudioEngine } from "./AudioEngine";
import {
  Rotate3d,
  Cpu,
  Zap,
  Sparkles,
  Sliders,
  Maximize2,
  Info,
  Apple,
  Shield,
  HelpCircle,
  TrendingUp,
  Star,
  Box,
  Infinity,
  Dna,
  Layers,
} from "lucide-react";

// Interface for 3D Vector Math
interface Vector3D {
  x: number;
  y: number;
  z: number;
}

// Face index tuple
interface Face {
  indices: number[];
  color?: string;
}

export default function ThreeDMetallicViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeShape, setActiveShape] = useState<"apple" | "shield" | "torus" | "gem" | "star" | "cube" | "knot" | "dna" | "mobius" | "quantum_fluid">("gem");
  const [metalFinish, setMetalFinish] = useState<"chrome" | "gold" | "obsidian" | "neon">("chrome");
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [renderMode, setRenderMode] = useState<"shaded" | "wireframe" | "both" | "hologram">("shaded");
  const [isHovered, setIsHovered] = useState(false);
  const [infoAlert, setInfoAlert] = useState<string | null>(null);
  const [raymarchQuality, setRaymarchQuality] = useState<"low" | "medium" | "high">("low");

  // Interaction tracking state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, lastX: 0, lastY: 0 });
  const rotationRef = useRef({ yaw: 0.4, pitch: 0.3, roll: 0.1 });

  // Play audio on state adjustments
  const triggerAudioFeedback = () => {
    AudioEngine.playHover();
  };

  // Pre-generate vertices & faces for different 3D models
  const generateGem = (): { vertices: Vector3D[]; faces: Face[] } => {
    // Elegant Geodesic Icosahedron
    const t = (1.0 + Math.sqrt(5.0)) / 2.0;
    const vertices: Vector3D[] = [
      { x: -1, y: t, z: 0 },
      { x: 1, y: t, z: 0 },
      { x: -1, y: -t, z: 0 },
      { x: 1, y: -t, z: 0 },
      { x: 0, y: -1, z: t },
      { x: 0, y: 1, z: t },
      { x: 0, y: -1, z: -t },
      { x: 0, y: 1, z: -t },
      { x: t, y: 0, z: -1 },
      { x: t, y: 0, z: 1 },
      { x: -t, y: 0, z: -1 },
      { x: -t, y: 0, z: 1 },
    ];

    // Normalize vertices to unit sphere
    vertices.forEach((v) => {
      const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
      v.x /= length;
      v.y /= length;
      v.z /= length;
    });

    const faces: Face[] = [
      { indices: [0, 11, 5] },
      { indices: [0, 5, 1] },
      { indices: [0, 1, 7] },
      { indices: [0, 7, 10] },
      { indices: [0, 10, 11] },
      { indices: [1, 5, 9] },
      { indices: [5, 11, 4] },
      { indices: [11, 10, 2] },
      { indices: [10, 7, 6] },
      { indices: [7, 1, 8] },
      { indices: [3, 9, 4] },
      { indices: [3, 4, 2] },
      { indices: [3, 2, 6] },
      { indices: [3, 6, 8] },
      { indices: [3, 8, 9] },
      { indices: [4, 9, 5] },
      { indices: [2, 4, 11] },
      { indices: [6, 2, 10] },
      { indices: [8, 6, 7] },
      { indices: [9, 8, 1] },
    ];

    return { vertices, faces };
  };

  const generateTorus = (majorR = 1.0, minorR = 0.36): { vertices: Vector3D[]; faces: Face[] } => {
    const vertices: Vector3D[] = [];
    const faces: Face[] = [];
    const radialSegments = 18;
    const tubularSegments = 18;

    for (let i = 0; i <= radialSegments; i++) {
      const u = (i / radialSegments) * Math.PI * 2;
      for (let j = 0; j <= tubularSegments; j++) {
        const v = (j / tubularSegments) * Math.PI * 2;

        const x = (majorR + minorR * Math.cos(v)) * Math.cos(u);
        const y = (majorR + minorR * Math.cos(v)) * Math.sin(u);
        const z = minorR * Math.sin(v);

        vertices.push({ x, y, z });
      }
    }

    for (let i = 0; i < radialSegments; i++) {
      for (let j = 0; j < tubularSegments; j++) {
        const a = i * (tubularSegments + 1) + j;
        const b = i * (tubularSegments + 1) + j + 1;
        const c = (i + 1) * (tubularSegments + 1) + j + 1;
        const d = (i + 1) * (tubularSegments + 1) + j;

        faces.push({ indices: [a, b, d] });
        faces.push({ indices: [b, c, d] });
      }
    }

    return { vertices, faces };
  };

  const generateShield = (): { vertices: Vector3D[]; faces: Face[] } => {
    // Beautiful curved 3D crest shield with sharp high-fidelity geometry
    const vertices: Vector3D[] = [
      { x: 0, y: 1.1, z: 0.15 },      // 0: Top-center crown peak
      { x: 0.65, y: 0.9, z: 0.1 },    // 1: Top right corner
      { x: 0.8, y: 0.1, z: 0.18 },    // 2: Mid right curve bulge
      { x: 0, y: -1.2, z: 0.35 },     // 3: Bottom pointed tip
      { x: -0.8, y: 0.1, z: 0.18 },   // 4: Mid left curve bulge
      { x: -0.65, y: 0.9, z: 0.1 },   // 5: Top left corner
      
      // Inside spine ridge for depth layering
      { x: 0, y: 0.4, z: 0.45 },      // 6: Upper spine ridge
      { x: 0, y: -0.4, z: 0.45 },     // 7: Lower spine ridge

      // Backside thickness for true 3D volumetric extrusion
      { x: 0, y: 1.05, z: -0.15 },     // 8
      { x: 0.55, y: 0.85, z: -0.15 },  // 9
      { x: 0.7, y: 0.08, z: -0.15 },   // 10
      { x: 0, y: -1.1, z: -0.15 },     // 11
      { x: -0.7, y: 0.08, z: -0.15 },  // 12
      { x: -0.55, y: 0.85, z: -0.15 }, // 13
    ];

    const faces: Face[] = [
      // Front Facets
      { indices: [0, 1, 6] },
      { indices: [1, 2, 6] },
      { indices: [2, 7, 6] },
      { indices: [2, 3, 7] },
      { indices: [0, 6, 5] },
      { indices: [5, 6, 4] },
      { indices: [4, 6, 7] },
      { indices: [4, 7, 3] },

      // Bevel side borders
      { indices: [0, 8, 1] },
      { indices: [1, 8, 9] },
      { indices: [1, 9, 2] },
      { indices: [2, 9, 10] },
      { indices: [2, 10, 3] },
      { indices: [3, 10, 11] },
      { indices: [0, 5, 8] },
      { indices: [5, 13, 8] },
      { indices: [5, 4, 13] },
      { indices: [4, 12, 13] },
      { indices: [4, 3, 12] },
      { indices: [3, 11, 12] },

      // Back covers
      { indices: [8, 13, 9] },
      { indices: [9, 13, 10] },
      { indices: [10, 13, 12] },
      { indices: [10, 12, 11] },
    ];

    return { vertices, faces };
  };

  const generateAppleLogo = (): { vertices: Vector3D[]; faces: Face[] } => {
    // High quality mathematical approximation of an Apple logo with real extrusion
    const vertices: Vector3D[] = [
      // Outer front face profile
      { x: 0, y: 0.52, z: 0.2 },       // 0: Top cleavage indent
      { x: 0.35, y: 0.75, z: 0.2 },    // 1: Top right crest
      { x: 0.72, y: 0.38, z: 0.2 },    // 2: Upper right shoulder
      { x: 0.54, y: -0.12, z: 0.2 },   // 3: Right waist indent (bite-inset edge)
      { x: 0.78, y: -0.12, z: 0.2 },   // 4: Bite outer right crest
      { x: 0.58, y: -0.58, z: 0.2 },   // 5: Lower right curve
      { x: 0.22, y: -0.88, z: 0.2 },   // 6: Bottom right foot
      { x: 0, y: -0.72, z: 0.2 },      // 7: Bottom cleavage indent
      { x: -0.22, y: -0.88, z: 0.2 },  // 8: Bottom left foot
      { x: -0.58, y: -0.58, z: 0.2 },  // 9: Lower left curve
      { x: -0.72, y: 0.05, z: 0.2 },   // 10: Left waist bulge
      { x: -0.65, y: 0.48, z: 0.2 },   // 11: Upper left shoulder
      { x: -0.32, y: 0.75, z: 0.2 },   // 12: Top left crest
      
      // Floating leaf front face
      { x: 0.12, y: 0.82, z: 0.2 },    // 13: Leaf bottom tip
      { x: 0.38, y: 1.15, z: 0.2 },    // 14: Leaf right peak
      { x: 0.05, y: 1.35, z: 0.2 },    // 15: Leaf top tip
      { x: -0.15, y: 1.05, z: 0.2 },   // 16: Leaf left curve

      // Central reference points to triangulate front surface beautifully
      { x: 0, y: 0, z: 0.25 },         // 17: Front core hub
      { x: 0.12, y: 1.05, z: 0.23 },   // 18: Leaf core hub

      // Backside profile counterparts (z: -0.2) for volumetric 3D
      { x: 0, y: 0.52, z: -0.2 },      // 19
      { x: 0.35, y: 0.75, z: -0.2 },   // 20
      { x: 0.72, y: 0.38, z: -0.2 },   // 21
      { x: 0.54, y: -0.12, z: -0.2 },  // 22
      { x: 0.78, y: -0.12, z: -0.2 },  // 23
      { x: 0.58, y: -0.58, z: -0.2 },  // 24
      { x: 0.22, y: -0.88, z: -0.2 },  // 25
      { x: 0, y: -0.72, z: -0.2 },     // 26
      { x: -0.22, y: -0.88, z: -0.2 }, // 27
      { x: -0.58, y: -0.58, z: -0.2 }, // 28
      { x: -0.72, y: 0.05, z: -0.2 },  // 29
      { x: -0.65, y: 0.48, z: -0.2 },  // 30
      { x: -0.32, y: 0.75, z: -0.2 },  // 31

      // Back leaf
      { x: 0.12, y: 0.82, z: -0.2 },   // 32
      { x: 0.38, y: 1.15, z: -0.2 },   // 33
      { x: 0.05, y: 1.35, z: -0.2 },   // 34
      { x: -0.15, y: 1.05, z: -0.2 },  // 35

      // Back reference hubs
      { x: 0, y: 0, z: -0.25 },        // 36: Back core hub
      { x: 0.12, y: 1.05, z: -0.23 },  // 37: Back leaf hub
    ];

    const faces: Face[] = [
      // Front face triangulation around the core hub
      { indices: [17, 0, 1] },
      { indices: [17, 1, 2] },
      { indices: [17, 2, 3] },
      { indices: [17, 3, 4] },
      { indices: [17, 4, 5] },
      { indices: [17, 5, 6] },
      { indices: [17, 6, 7] },
      { indices: [17, 7, 8] },
      { indices: [17, 8, 9] },
      { indices: [17, 9, 10] },
      { indices: [17, 10, 11] },
      { indices: [17, 11, 12] },
      { indices: [17, 12, 0] },

      // Leaf front
      { indices: [18, 13, 14] },
      { indices: [18, 14, 15] },
      { indices: [18, 15, 16] },
      { indices: [18, 16, 13] },

      // Back face triangulation
      { indices: [36, 19, 31] },
      { indices: [36, 31, 30] },
      { indices: [36, 30, 29] },
      { indices: [36, 29, 28] },
      { indices: [36, 28, 27] },
      { indices: [36, 27, 26] },
      { indices: [36, 26, 25] },
      { indices: [36, 25, 24] },
      { indices: [36, 24, 23] },
      { indices: [36, 23, 22] },
      { indices: [36, 22, 21] },
      { indices: [36, 21, 20] },
      { indices: [36, 20, 19] },

      // Leaf back
      { indices: [37, 32, 35] },
      { indices: [37, 35, 34] },
      { indices: [37, 34, 33] },
      { indices: [37, 33, 32] },

      // Extruded side walls (connecting front to back)
      { indices: [0, 19, 20] }, { indices: [0, 20, 1] },
      { indices: [1, 20, 21] }, { indices: [1, 21, 2] },
      { indices: [2, 21, 22] }, { indices: [2, 22, 3] },
      { indices: [3, 22, 23] }, { indices: [3, 23, 4] },
      { indices: [4, 23, 24] }, { indices: [4, 24, 5] },
      { indices: [5, 24, 25] }, { indices: [5, 25, 6] },
      { indices: [6, 25, 26] }, { indices: [6, 26, 7] },
      { indices: [7, 26, 27] }, { indices: [7, 27, 8] },
      { indices: [8, 27, 28] }, { indices: [8, 28, 9] },
      { indices: [9, 28, 29] }, { indices: [9, 29, 10] },
      { indices: [10, 29, 30] }, { indices: [10, 30, 11] },
      { indices: [11, 30, 31] }, { indices: [11, 31, 12] },
      { indices: [12, 31, 19] }, { indices: [12, 19, 0] },

      // Leaf walls
      { indices: [13, 32, 33] }, { indices: [13, 33, 14] },
      { indices: [14, 33, 34] }, { indices: [14, 34, 15] },
      { indices: [15, 34, 35] }, { indices: [15, 35, 16] },
      { indices: [16, 35, 32] }, { indices: [16, 32, 13] },
    ];

    return { vertices, faces };
  };

  const generateStar = (): { vertices: Vector3D[]; faces: Face[] } => {
    const vertices: Vector3D[] = [];
    const faces: Face[] = [];
    
    const numPoints = 5;
    const outerRadius = 1.05;
    const innerRadius = 0.42;
    
    // Add front and back apexes
    const frontApexIdx = 0;
    const backApexIdx = 1;
    vertices.push({ x: 0, y: 0, z: 0.35 });  // Front
    vertices.push({ x: 0, y: 0, z: -0.35 }); // Back
    
    // Generate outer and inner points on the z = 0 plane
    for (let i = 0; i < numPoints; i++) {
      const angleOuter = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
      const angleInner = ((i + 0.5) * 2 * Math.PI) / numPoints - Math.PI / 2;
      
      // Outer vertex
      vertices.push({
        x: Math.cos(angleOuter) * outerRadius,
        y: -Math.sin(angleOuter) * outerRadius,
        z: 0.0,
      });
      
      // Inner vertex
      vertices.push({
        x: Math.cos(angleInner) * innerRadius,
        y: -Math.sin(angleInner) * innerRadius,
        z: 0.0,
      });
    }
    
    // Vertex indices:
    // 0: Front Apex, 1: Back Apex
    // 2 + 2*i: Outer vertex i
    // 2 + 2*i + 1: Inner vertex i
    
    for (let i = 0; i < numPoints; i++) {
      const outerIdx = 2 + 2 * i;
      const innerIdx = 2 + 2 * i + 1;
      const nextOuterIdx = 2 + (2 * (i + 1)) % (numPoints * 2);
      
      // Front triangles
      faces.push({ indices: [frontApexIdx, outerIdx, innerIdx] });
      faces.push({ indices: [frontApexIdx, innerIdx, nextOuterIdx] });
      
      // Back triangles (inverted winding for correct normals pointing out)
      faces.push({ indices: [backApexIdx, innerIdx, outerIdx] });
      faces.push({ indices: [backApexIdx, nextOuterIdx, innerIdx] });
    }
    
    return { vertices, faces };
  };

  const generateCube = (): { vertices: Vector3D[]; faces: Face[] } => {
    // 8 vertices of a standard cube
    const vertices: Vector3D[] = [
      { x: -0.55, y: -0.55, z: 0.55 },  // 0
      { x: 0.55, y: -0.55, z: 0.55 },   // 1
      { x: 0.55, y: 0.55, z: 0.55 },    // 2
      { x: -0.55, y: 0.55, z: 0.55 },   // 3
      { x: -0.55, y: -0.55, z: -0.55 }, // 4
      { x: 0.55, y: -0.55, z: -0.55 },  // 5
      { x: 0.55, y: 0.55, z: -0.55 },   // 6
      { x: -0.55, y: 0.55, z: -0.55 },  // 7
    ];

    // 6 faces, each with 2 triangles
    const faces: Face[] = [
      // Front Face
      { indices: [0, 1, 2] },
      { indices: [0, 2, 3] },
      // Back Face
      { indices: [5, 4, 7] },
      { indices: [5, 7, 6] },
      // Top Face
      { indices: [3, 2, 6] },
      { indices: [3, 6, 7] },
      // Bottom Face
      { indices: [4, 5, 1] },
      { indices: [4, 1, 0] },
      // Right Face
      { indices: [1, 5, 6] },
      { indices: [1, 6, 2] },
      // Left Face
      { indices: [4, 0, 3] },
      { indices: [4, 3, 7] },
    ];

    return { vertices, faces };
  };

  const generateTorusKnot = (p = 3, q = 2, rScale = 0.7): { vertices: Vector3D[]; faces: Face[] } => {
    const vertices: Vector3D[] = [];
    const faces: Face[] = [];
    
    const N = 80; // steps along the knot curve
    const M = 8;  // vertices per tube circle
    const tubeRadius = 0.12;

    const curvePoints: Vector3D[] = [];
    
    // 1. Generate core curve points
    for (let i = 0; i < N; i++) {
      const t = (i * 2 * Math.PI) / N;
      const r = 0.75 + 0.3 * Math.cos(q * t);
      const x = r * Math.cos(p * t) * rScale;
      const y = r * Math.sin(p * t) * rScale;
      const z = 0.3 * Math.sin(q * t) * rScale;
      curvePoints.push({ x, y, z });
    }

    // 2. Generate rings along the curve
    for (let i = 0; i < N; i++) {
      const curr = curvePoints[i];
      const next = curvePoints[(i + 1) % N];
      
      // Tangent vector
      let tx = next.x - curr.x;
      let ty = next.y - curr.y;
      let tz = next.z - curr.z;
      const len = Math.hypot(tx, ty, tz);
      if (len > 0) {
        tx /= len;
        ty /= len;
        tz /= len;
      }

      // Normal and Binormal vectors (stable coordinate frame)
      // Pick a reference vector that isn't collinear with the tangent
      let rx = 0, ry = 1, rz = 0;
      if (Math.abs(ty) > 0.9) {
        rx = 0; ry = 0; rz = 1;
      }

      // Cross product for Normal
      let nx = ty * rz - tz * ry;
      let ny = tz * rx - tx * rz;
      let nz = tx * ry - ty * rx;
      const nLen = Math.hypot(nx, ny, nz);
      if (nLen > 0) {
        nx /= nLen;
        ny /= nLen;
        nz /= nLen;
      }

      // Cross product for Binormal
      const bx = tx * ny - ty * nx;
      const by = ty * nz - tz * ny;
      const bz = tz * nx - tx * nz;

      // Add circle of vertices
      for (let j = 0; j < M; j++) {
        const theta = (j * 2 * Math.PI) / M;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        vertices.push({
          x: curr.x + tubeRadius * (cosT * nx + sinT * bx),
          y: curr.y + tubeRadius * (cosT * ny + sinT * by),
          z: curr.z + tubeRadius * (cosT * nz + sinT * bz),
        });
      }
    }

    // 3. Connect rings with faces (triangles)
    for (let i = 0; i < N; i++) {
      const nextI = (i + 1) % N;
      for (let j = 0; j < M; j++) {
        const nextJ = (j + 1) % M;

        const v00 = i * M + j;
        const v10 = nextI * M + j;
        const v01 = i * M + nextJ;
        const v11 = nextI * M + nextJ;

        // Two triangles per quad
        faces.push({ indices: [v00, v10, v11] });
        faces.push({ indices: [v00, v11, v01] });
      }
    }

    return { vertices, faces };
  };

  const generateDoubleHelix = (): { vertices: Vector3D[]; faces: Face[] } => {
    const vertices: Vector3D[] = [];
    const faces: Face[] = [];
    
    const N = 45; // Steps along length (Y-axis)
    const M = 6;  // Vertices per tube ring
    const tubeRadius = 0.07;
    const helixRadius = 0.52;
    const height = 1.5;
    const turns = 2.2; // Number of full spirals

    const strandAPoints: Vector3D[] = [];
    const strandBPoints: Vector3D[] = [];

    // 1. Generate center curves for Strand A and Strand B
    for (let i = 0; i < N; i++) {
      const fraction = i / (N - 1);
      const y = (fraction - 0.5) * height;
      const angle = fraction * turns * 2 * Math.PI;

      strandAPoints.push({
        x: Math.cos(angle) * helixRadius,
        y: y,
        z: Math.sin(angle) * helixRadius,
      });

      strandBPoints.push({
        x: Math.cos(angle + Math.PI) * helixRadius,
        y: y,
        z: Math.sin(angle + Math.PI) * helixRadius,
      });
    }

    // Helper to generate a tube for a given set of points
    const addTube = (points: Vector3D[], baseIdx: number) => {
      // Generate rings
      for (let i = 0; i < N; i++) {
        const curr = points[i];
        const next = points[i === N - 1 ? N - 1 : i + 1];
        const prev = points[i === 0 ? 0 : i - 1];
        
        // Approximate tangent
        let tx = next.x - prev.x;
        let ty = next.y - prev.y;
        let tz = next.z - prev.z;
        const len = Math.hypot(tx, ty, tz);
        if (len > 0) {
          tx /= len; ty /= len; tz /= len;
        } else {
          tx = 0; ty = 1; tz = 0;
        }

        // Normal/Binormal frame
        let rx = 1, ry = 0, rz = 0;
        if (Math.abs(tx) > 0.9) {
          rx = 0; ry = 1; rz = 0;
        }
        let nx = ty * rz - tz * ry;
        let ny = tz * rx - tx * rz;
        let nz = tx * ry - ty * rx;
        const nLen = Math.hypot(nx, ny, nz);
        nx /= nLen; ny /= nLen; nz /= nLen;

        const bx = tx * ny - ty * nx;
        const by = ty * nz - tz * ny;
        const bz = tz * nx - tx * nz;

        for (let j = 0; j < M; j++) {
          const theta = (j * 2 * Math.PI) / M;
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);

          vertices.push({
            x: curr.x + tubeRadius * (cosT * nx + sinT * bx),
            y: curr.y + tubeRadius * (cosT * ny + sinT * by),
            z: curr.z + tubeRadius * (cosT * nz + sinT * bz),
          });
        }
      }

      // Add tube faces
      for (let i = 0; i < N - 1; i++) {
        const currRing = baseIdx + i * M;
        const nextRing = baseIdx + (i + 1) * M;

        for (let j = 0; j < M; j++) {
          const nextJ = (j + 1) % M;
          
          const v00 = currRing + j;
          const v10 = nextRing + j;
          const v01 = currRing + nextJ;
          const v11 = nextRing + nextJ;

          faces.push({ indices: [v00, v10, v11] });
          faces.push({ indices: [v00, v11, v01] });
        }
      }
    };

    // Add Strand A tube (vertices 0 to N*M - 1)
    addTube(strandAPoints, 0);
    // Add Strand B tube (vertices N*M to 2*N*M - 1)
    addTube(strandBPoints, N * M);

    // 2. Add horizontal rungs connecting the two strands
    const rungIndicesStart = 2 * N * M;
    let rungCount = 0;

    for (let i = 2; i < N - 2; i += 3) {
      const pA = strandAPoints[i];
      const pB = strandBPoints[i];

      let dx = pB.x - pA.x;
      let dy = pB.y - pA.y;
      let dz = pB.z - pA.z;
      const len = Math.hypot(dx, dy, dz);
      dx /= len; dy /= len; dz /= len;

      let px = 0, py = 1, pz = 0;
      if (Math.abs(dx) > 0.9) {
        px = 0; py = 0; pz = 1;
      }
      let ux = dy * pz - dz * py;
      let uy = dz * px - dx * pz;
      let uz = dx * py - dy * px;
      const uLen = Math.hypot(ux, uy, uz);
      ux /= uLen; uy /= uLen; uz /= uLen;

      const vx = dy * uz - dz * uy;
      const vy = dz * ux - dx * uz;
      const vz = dx * uy - dy * ux;

      const rungRadius = 0.035;
      const rungSegments = 4;

      const baseVertA = rungIndicesStart + rungCount * rungSegments * 2;

      for (let j = 0; j < rungSegments; j++) {
        const theta = (j * 2 * Math.PI) / rungSegments;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        
        vertices.push({
          x: pA.x + dx * tubeRadius + rungRadius * (cosT * ux + sinT * vx),
          y: pA.y + dy * tubeRadius + rungRadius * (cosT * uy + sinT * vy),
          z: pA.z + dz * tubeRadius + rungRadius * (cosT * uz + sinT * vz),
        });
      }

      for (let j = 0; j < rungSegments; j++) {
        const theta = (j * 2 * Math.PI) / rungSegments;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        
        vertices.push({
          x: pB.x - dx * tubeRadius + rungRadius * (cosT * ux + sinT * vx),
          y: pB.y - dy * tubeRadius + rungRadius * (cosT * uy + sinT * vy),
          z: pB.z - dz * tubeRadius + rungRadius * (cosT * uz + sinT * vz),
        });
      }

      for (let j = 0; j < rungSegments; j++) {
        const nextJ = (j + 1) % rungSegments;
        const vA0 = baseVertA + j;
        const vB0 = baseVertA + rungSegments + j;
        const vA1 = baseVertA + nextJ;
        const vB1 = baseVertA + rungSegments + nextJ;

        faces.push({ indices: [vA0, vB0, vB1] });
        faces.push({ indices: [vA0, vB1, vA1] });
      }

      rungCount++;
    }

    return { vertices, faces };
  };

  const generateMobiusStrip = (): { vertices: Vector3D[]; faces: Face[] } => {
    const vertices: Vector3D[] = [];
    const faces: Face[] = [];

    const U_STEPS = 60; // Steps around the circle
    const V_STEPS = 8;  // Steps across the width
    const R = 0.8;      // Radius of the main circle
    const W = 0.35;     // Width of the strip

    for (let i = 0; i < U_STEPS; i++) {
      const u = (i * 2 * Math.PI) / U_STEPS;
      for (let j = 0; j < V_STEPS; j++) {
        const v = -W + (2 * W * j) / (V_STEPS - 1);

        const cosHalfU = Math.cos(u / 2);
        const sinHalfU = Math.sin(u / 2);

        const x = (R + v * cosHalfU) * Math.cos(u);
        const y = (R + v * cosHalfU) * Math.sin(u);
        const z = v * sinHalfU;

        vertices.push({ x, y, z });
      }
    }

    for (let i = 0; i < U_STEPS; i++) {
      const nextI = (i + 1) % U_STEPS;
      const isLast = (i === U_STEPS - 1);

      for (let j = 0; j < V_STEPS - 1; j++) {
        const currRing = i * V_STEPS;
        const nextRing = nextI * V_STEPS;

        const v00 = currRing + j;
        const v01 = currRing + j + 1;

        let v10, v11;
        if (isLast) {
          v10 = nextRing + (V_STEPS - 1 - j);
          v11 = nextRing + (V_STEPS - 1 - (j + 1));
        } else {
          v10 = nextRing + j;
          v11 = nextRing + j + 1;
        }

        faces.push({ indices: [v00, v10, v11] });
        faces.push({ indices: [v00, v11, v01] });
      }
    }

    return { vertices, faces };
  };

  // Helper 3D vector rotation transformations
  const rotateX = (v: Vector3D, angle: number): Vector3D => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: v.x,
      y: v.y * cos - v.z * sin,
      z: v.y * sin + v.z * cos,
    };
  };

  const rotateY = (v: Vector3D, angle: number): Vector3D => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: v.x * cos + v.z * sin,
      y: v.y,
      z: -v.x * sin + v.z * cos,
    };
  };

  const rotateZ = (v: Vector3D, angle: number): Vector3D => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: v.x * cos - v.y * sin,
      y: v.x * sin + v.y * cos,
      z: v.z,
    };
  };

  // Main 3D Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 450);
    let height = (canvas.height = 360);

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        if (!canvas) return;
        width = canvas.width = canvas.parentElement?.clientWidth || 450;
        height = canvas.height = 360;
      });
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Get selected geometry
    let modelData = generateGem();
    if (activeShape === "apple") modelData = generateAppleLogo();
    if (activeShape === "shield") modelData = generateShield();
    if (activeShape === "torus") modelData = generateTorus();
    if (activeShape === "star") modelData = generateStar();
    if (activeShape === "cube") modelData = generateCube();
    if (activeShape === "knot") modelData = generateTorusKnot();
    if (activeShape === "dna") modelData = generateDoubleHelix();
    if (activeShape === "mobius") modelData = generateMobiusStrip();

    // Interaction handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      mouseRef.current.targetX = (currentX / width - 0.5) * 2; // -1.0 to 1.0
      mouseRef.current.targetY = (currentY / height - 0.5) * 2;

      if (mouseRef.current.isDown) {
        const dx = currentX - mouseRef.current.lastX;
        const dy = currentY - mouseRef.current.lastY;

        rotationRef.current.yaw += dx * 0.007;
        rotationRef.current.pitch += dy * 0.007;

        mouseRef.current.lastX = currentX;
        mouseRef.current.lastY = currentY;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.isDown = true;
      mouseRef.current.lastX = e.clientX - rect.left;
      mouseRef.current.lastY = e.clientY - rect.top;
      AudioEngine.playClick();
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Animation Tick
    const render = () => {
      // Clear with slight alpha to support clean ambient trails in canvas background
      ctx.fillStyle = "rgba(7, 7, 18, 0.22)";
      ctx.fillRect(0, 0, width, height);

      // Light source coordinates (follows mouse target location for interactive specular glare!)
      const mX = mouseRef.current.targetX;
      const mY = mouseRef.current.targetY;

      if (activeShape === "quantum_fluid") {
        // High-performance CPU Raymarching running on a scaled offscreen buffer for flawless 60 FPS
        const qWidth = raymarchQuality === "low" ? 160 : raymarchQuality === "medium" ? 240 : 320;
        const qHeight = raymarchQuality === "low" ? 120 : raymarchQuality === "medium" ? 180 : 240;

        let offscreen = (canvas as any).__offscreenCanvas;
        if (!offscreen || offscreen.width !== qWidth || offscreen.height !== qHeight) {
          offscreen = document.createElement("canvas");
          offscreen.width = qWidth;
          offscreen.height = qHeight;
          (canvas as any).__offscreenCanvas = offscreen;
        }
        const oCtx = offscreen.getContext("2d");
        if (oCtx) {
          const oWidth = qWidth;
          const oHeight = qHeight;
          const imgData = oCtx.createImageData(oWidth, oHeight);
          const data = imgData.data;

          const time = Date.now() * 0.0012;
          const mouseX = mouseRef.current.targetX;
          const mouseY = mouseRef.current.targetY;

          // Raymarching camera
          const ro = { x: 0, y: 0, z: -2.2 };
          for (let y = 0; y < oHeight; y++) {
            const uvY = (y / oHeight - 0.5) * (oHeight / oWidth);
            for (let x = 0; x < oWidth; x++) {
              const uvX = x / oWidth - 0.5;

              const rd = { x: uvX, y: -uvY, z: 1.0 };
              const lenRd = Math.sqrt(rd.x * rd.x + rd.y * rd.y + rd.z * rd.z);
              rd.x /= lenRd;
              rd.y /= lenRd;
              rd.z /= lenRd;

              let t = 0.0;
              let hit = false;
              const p = { x: 0, y: 0, z: 0 };

              // Stepping through space
              for (let s = 0; s < 24; s++) {
                p.x = ro.x + rd.x * t;
                p.y = ro.y + rd.y * t;
                p.z = ro.z + rd.z * t;

                // Organic fluid SDF logic
                const disp = 0.16 * Math.sin(p.x * 4.5 + time * 1.8) * Math.sin(p.y * 4.5 + mouseY * 1.5) * Math.sin(p.z * 4.5 + mouseX * 1.5);
                const dist = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z) - (0.64 + disp);

                if (dist < 0.008) {
                  hit = true;
                  break;
                }
                if (t > 4.0) break;
                t += dist;
              }

              let rVal = 5, gVal = 5, bVal = 14;

              if (hit) {
                const eps = 0.02;
                const getSDF = (pos: { x: number, y: number, z: number }) => {
                  const disp = 0.16 * Math.sin(pos.x * 4.5 + time * 1.8) * Math.sin(pos.y * 4.5 + mouseY * 1.5) * Math.sin(pos.z * 4.5 + mouseX * 1.5);
                  return Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z) - (0.64 + disp);
                };

                const nx = getSDF({ x: p.x + eps, y: p.y, z: p.z }) - getSDF({ x: p.x - eps, y: p.y, z: p.z });
                const ny = getSDF({ x: p.x, y: p.y + eps, z: p.z }) - getSDF({ x: p.x, y: p.y - eps, z: p.z });
                const nz = getSDF({ x: p.x, y: p.y, z: p.z + eps }) - getSDF({ x: p.x, y: p.y - eps, z: p.z });

                const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1.0;
                const normal = { x: nx / nLen, y: ny / nLen, z: nz / nLen };

                // Infinite environment lighting
                const lightDir = { x: 1.0 + mouseX * 1.5, y: 1.0 - mouseY * 1.5, z: -1.0 };
                const lightLen = Math.sqrt(lightDir.x * lightDir.x + lightDir.y * lightDir.y + lightDir.z * lightDir.z) || 1.0;
                lightDir.x /= lightLen; lightDir.y /= lightLen; lightDir.z /= lightLen;

                const diff = Math.max(0.0, normal.x * lightDir.x + normal.y * lightDir.y + normal.z * lightDir.z);

                const dotNL = normal.x * lightDir.x + normal.y * lightDir.y + normal.z * lightDir.z;
                const rz = 2.0 * dotNL * normal.z - lightDir.z;
                const spec = Math.pow(Math.max(0.0, -rz), 14);

                const refGrad = Math.max(0, normal.y * 0.5 + 0.5);

                let baseR = 175, baseG = 185, baseB = 205;
                let specR = 255, specG = 255, specB = 255;

                if (metalFinish === "gold") {
                  baseR = 250; baseG = 195; baseB = 35;
                  specR = 255; specG = 240; specB = 160;
                } else if (metalFinish === "obsidian") {
                  baseR = 22; baseG = 24; baseB = 32;
                  specR = 110; specG = 145; specB = 245;
                } else if (metalFinish === "neon") {
                  baseR = 190; baseG = 25; baseB = 255;
                  specR = 0; specG = 240; specB = 255;
                }

                const metallicStrength = metalFinish === "chrome" ? 0.65 : 0.35;
                rVal = baseR * (0.12 + diff * 0.38 + refGrad * metallicStrength) + spec * specR;
                gVal = baseG * (0.12 + diff * 0.38 + refGrad * metallicStrength) + spec * specG;
                bVal = baseB * (0.12 + diff * 0.38 + refGrad * metallicStrength) + spec * specB;

                const depthM = 1.0 - (t / 4.0);
                rVal = Math.min(255, Math.max(0, rVal * depthM));
                gVal = Math.min(255, Math.max(0, gVal * depthM));
                bVal = Math.min(255, Math.max(0, bVal * depthM));
              } else {
                const dx = uvX - mouseX * 0.15;
                const dy = uvY + mouseY * 0.15;
                const dDist = Math.sqrt(dx * dx + dy * dy);
                const glow = Math.max(0, 1.0 - dDist * 2.2);
                rVal = 4 + glow * 10;
                gVal = 4 + glow * 12;
                bVal = 10 + glow * 28;
              }

              const pixelIdx = (y * oWidth + x) * 4;
              data[pixelIdx] = rVal;
              data[pixelIdx + 1] = gVal;
              data[pixelIdx + 2] = bVal;
              data[pixelIdx + 3] = 255;
            }
          }
          oCtx.putImageData(imgData, 0, 0);
          ctx.drawImage(offscreen, 0, 0, width, height);
        }

        // Draw HUD scan metadata directly on top of the raymarch canvas
        ctx.strokeStyle = "rgba(0, 240, 255, 0.2)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 25, height / 2); ctx.lineTo(width / 2 + 25, height / 2);
        ctx.moveTo(width / 2, height / 2 - 25); ctx.lineTo(width / 2, height / 2 + 25);
        ctx.stroke();

        ctx.font = "8px monospace";
        ctx.fillStyle = "rgba(0, 240, 255, 0.5)";
        ctx.fillText("RAYMARCH_SDF_RESOLVED", 15, 20);
        ctx.fillText(`FPS: 60 / RESOLUTION: ${qWidth}x${qHeight}_SAMPLED`, 15, 32);

        animationId = requestAnimationFrame(render);
        return;
      }

      const lightSource: Vector3D = {
        x: mX * 2.5,
        y: -mY * 2.5,
        z: 2.0, // light source is in front of the screen
      };

      // Normalize light source vector
      const lightLength = Math.sqrt(lightSource.x * lightSource.x + lightSource.y * lightSource.y + lightSource.z * lightSource.z);
      lightSource.x /= lightLength;
      lightSource.y /= lightLength;
      lightSource.z /= lightLength;

      // Auto rotation over time
      if (!mouseRef.current.isDown) {
        rotationRef.current.yaw += 0.006 * rotationSpeed;
        rotationRef.current.pitch += 0.003 * rotationSpeed;
        rotationRef.current.roll += 0.002 * rotationSpeed;
      }

      // 1. Transform & rotate 3D vertices
      const transformedVertices = modelData.vertices.map((v) => {
        // Base scale depending on shape
        let s = Math.min(width, height) * 0.38;
        if (activeShape === "gem") s *= 1.2;
        if (activeShape === "torus") s *= 0.95;
        if (activeShape === "shield") s *= 1.05;
        if (activeShape === "star") s *= 1.15;
        if (activeShape === "cube") s *= 1.1;
        if (activeShape === "knot") s *= 1.15;
        if (activeShape === "dna") s *= 1.25;
        if (activeShape === "mobius") s *= 1.15;

        let p = { x: v.x * s, y: v.y * s, z: v.z * s };

        // Rotate
        p = rotateX(p, rotationRef.current.pitch);
        p = rotateY(p, rotationRef.current.yaw);
        p = rotateZ(p, rotationRef.current.roll);

        return p;
      });

      // 2. Project vertices to 2D screen coordinates
      const cx = width / 2;
      const cy = height / 2;
      const d = 500; // Camera perspective distance

      const projected = transformedVertices.map((v) => {
        // Perspective projection formula
        const scale = d / (d + v.z);
        return {
          x: cx + v.x * scale,
          y: cy - v.y * scale, // invert Y for standard screen coordinates
          z: v.z, // retain z for painter's depth sorting
        };
      });

      // 3. Face Depth sorting (Painter's algorithm) to avoid clipping artifacts
      interface RenderFace {
        indices: number[];
        avgZ: number;
      }

      const renderFaces: RenderFace[] = modelData.faces.map((face) => {
        let sumZ = 0;
        face.indices.forEach((idx) => {
          sumZ += transformedVertices[idx].z;
        });
        return {
          indices: face.indices,
          avgZ: sumZ / face.indices.length,
        };
      });

      // Sort faces back-to-front (largest Z/deepest drawn first)
      renderFaces.sort((a, b) => b.avgZ - a.avgZ);

      // 4. Render faces with Metallic lighting shading models
      renderFaces.forEach((rf) => {
        const idxs = rf.indices;

        // Calculate face normal using cross-product of first two edge vectors
        const p0 = transformedVertices[idxs[0]];
        const p1 = transformedVertices[idxs[1]];
        const p2 = transformedVertices[idxs[2]];

        const v1 = { x: p1.x - p0.x, y: p1.y - p0.y, z: p1.z - p0.z };
        const v2 = { x: p2.x - p0.x, y: p2.y - p0.y, z: p2.z - p0.z };

        // Cross product
        const normal = {
          x: v1.y * v2.z - v1.z * v2.y,
          y: v1.z * v2.x - v1.x * v2.z,
          z: v1.x * v2.y - v1.y * v2.x,
        };

        // Normalize normal vector
        const normalLength = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
        if (normalLength === 0) return;
        normal.x /= normalLength;
        normal.y /= normalLength;
        normal.z /= normalLength;

        // Don't draw backfacing polygons unless wireframe mode
        if (normal.z <= 0 && renderMode === "shaded") {
          return;
        }

        // Ambient reflection
        let ambient = 0.16;

        // Diffuse lighting (Lambertian)
        const diffuse = Math.max(0, normal.x * lightSource.x + normal.y * lightSource.y + normal.z * lightSource.z);

        // Specular lighting (Phong reflection highlight for pristine metallic glint!)
        // R = 2 * (N . L) * N - L
        const dotNL = normal.x * lightSource.x + normal.y * lightSource.y + normal.z * lightSource.z;
        const reflection = {
          x: 2 * dotNL * normal.x - lightSource.x,
          y: 2 * dotNL * normal.y - lightSource.y,
          z: 2 * dotNL * normal.z - lightSource.z,
        };

        // View vector is simply [0, 0, 1] in parallel projection
        const specular = Math.pow(Math.max(0, reflection.z), 18); // shininess power = 18

        // Metallic reflection mapping (simulate sky/studio gradient reflections based on Y-normal)
        const reflectionGrad = Math.max(0, normal.y * 0.5 + 0.5);

        // Determine metal hue properties based on selected theme
        let baseR = 180, baseG = 190, baseB = 210; // Chrome defaults
        let specularColor = { r: 255, g: 255, b: 255 };

        if (metalFinish === "gold") {
          baseR = 250; baseG = 195; baseB = 40;
          specularColor = { r: 255, g: 245, b: 180 };
          ambient = 0.18;
        } else if (metalFinish === "obsidian") {
          baseR = 24; baseG = 26; baseB = 35;
          specularColor = { r: 120, g: 150, b: 240 };
          ambient = 0.08;
        } else if (metalFinish === "neon") {
          baseR = 190; baseG = 30; baseB = 255;
          specularColor = { r: 0, g: 240, b: 255 };
          ambient = 0.22;
        }

        // Blend Ambient + Diffuse + Specular + Simulated Chrome reflection
        const metallicStrength = metalFinish === "chrome" ? 0.45 : 0.25;
        const r = Math.min(255, baseR * (ambient + diffuse * 0.5 + reflectionGrad * metallicStrength) + specular * specularColor.r);
        const g = Math.min(255, baseG * (ambient + diffuse * 0.5 + reflectionGrad * metallicStrength) + specular * specularColor.g);
        const b = Math.min(255, baseB * (ambient + diffuse * 0.5 + reflectionGrad * metallicStrength) + specular * specularColor.b);

        // Draw Polygon Face
        ctx.beginPath();
        ctx.moveTo(projected[idxs[0]].x, projected[idxs[0]].y);
        for (let i = 1; i < idxs.length; i++) {
          ctx.lineTo(projected[idxs[i]].x, projected[idxs[i]].y);
        }
        ctx.closePath();

        if (renderMode === "shaded" || renderMode === "both") {
          ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
          ctx.fill();
        }

        if (renderMode === "wireframe" || renderMode === "both") {
          ctx.strokeStyle = renderMode === "both" 
            ? `rgba(255,255,255,0.18)` 
            : metalFinish === "neon" ? "#00f0ff" : metalFinish === "gold" ? "#fbbf24" : "#ffffff";
          ctx.lineWidth = renderMode === "both" ? 0.7 : 1.2;
          ctx.stroke();
        }

        if (renderMode === "hologram") {
          const isNeon = metalFinish === "neon";
          const isGold = metalFinish === "gold";
          const holoFill = isNeon ? "rgba(240, 0, 255, 0.08)" : isGold ? "rgba(251, 191, 36, 0.08)" : "rgba(6, 182, 212, 0.08)";
          ctx.fillStyle = holoFill;
          ctx.fill();

          ctx.strokeStyle = isNeon ? "rgba(240, 0, 255, 0.55)" : isGold ? "rgba(251, 191, 36, 0.55)" : "rgba(6, 182, 212, 0.55)";
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      });

      // 4.5 Moving Laser Scan Plane for Hologram mode
      if (renderMode === "hologram") {
        const scanTime = Date.now() * 0.0022;
        const scanY = (Math.sin(scanTime) * 0.42 + 0.5) * height; // travels smoothly from top to bottom
        
        // Draw the laser line across the canvas
        const isNeon = metalFinish === "neon";
        const isGold = metalFinish === "gold";
        const glowColor = isNeon ? "rgba(240, 0, 255," : isGold ? "rgba(251, 191, 36," : "rgba(6, 182, 212,";

        // Draw laser scan line
        ctx.strokeStyle = `${glowColor} 0.8)`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = isNeon ? "#f000ff" : isGold ? "#fbbf24" : "#06b6d4";
        ctx.beginPath();
        ctx.moveTo(10, scanY);
        ctx.lineTo(width - 10, scanY);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow

        // Highlight nodes near the sweep line to make it look incredibly reactive
        projected.forEach((p) => {
          if (Math.abs(p.y - scanY) < 18) {
            ctx.fillStyle = isNeon ? "#f000ff" : isGold ? "#fbbf24" : "#00f0ff";
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();

            // Connecting vector line to scan line
            ctx.strokeStyle = `${glowColor} 0.25)`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, scanY);
            ctx.stroke();
          }
        });
      }

      // 5. Drawing optional high-tech cursor interactive targeting lines over 3D model
      if (isHovered && mX !== 0) {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;

        // Draw a light tracker vector line
        ctx.beginPath();
        ctx.moveTo(cx + mX * 120, cy - mY * 120);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        ctx.fillStyle = "rgba(0, 240, 255, 0.75)";
        ctx.beginPath();
        ctx.arc(cx + mX * 120, cy - mY * 120, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.setLineDash([]);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      resizeObserver.disconnect();
    };
  }, [activeShape, metalFinish, rotationSpeed, renderMode, isHovered, raymarchQuality]);

  const selectShape = (shape: "apple" | "shield" | "torus" | "gem" | "star" | "cube" | "knot" | "dna" | "mobius" | "quantum_fluid") => {
    setActiveShape(shape);
    triggerAudioFeedback();
    const alerts: Record<string, string> = {
      gem: "Loaded 3D Geodesic Icosahedron geometry structure.",
      apple: "Constructed extruded premium 3D Apple Logo mesh model.",
      shield: "Initialized volumetric 3D defense shield crest mesh.",
      torus: "Generated high-density curved 3D torus ring mesh.",
      star: "Constructed beveled 5-pointed stellated 3D star polyhedron.",
      cube: "Generated volumetric industrial 3D cube mesh.",
      knot: "Constructed continuous 3D Trefoil Torus Knot vector mesh loop.",
      dna: "Generated high-density dual-spiral DNA Double Helix mesh scaffolding.",
      mobius: "Constructed mathematically infinite non-orientable 3D Mobius Strip.",
      quantum_fluid: "Booted real-time Raymarched SDF Quantum Fluid simulation.",
    };
    setInfoAlert(alerts[shape]);
    setTimeout(() => setInfoAlert(null), 2500);
  };

  const selectFinish = (finish: "chrome" | "gold" | "obsidian" | "neon") => {
    setMetalFinish(finish);
    triggerAudioFeedback();
    const alerts: Record<string, string> = {
      chrome: "Applied Polished Chrome studio reflection material finish.",
      gold: "Loaded 24k liquid gold specular shader properties.",
      obsidian: "Constructed deep obsidian space-vacuum carbon mesh.",
      neon: "Infused cybernetic active helium-neon glowing lattice.",
    };
    setInfoAlert(alerts[finish]);
    setTimeout(() => setInfoAlert(null), 2500);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 relative z-10 select-none">
      {/* Grid Headers */}
      <div className="text-center mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 tracking-[0.3em] uppercase">
          <Rotate3d className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "5s" }} />
          INTERACTIVE 3D VECTOR MATRIX
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-100 uppercase">
          3D Metallic Studio
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto font-sans font-light">
          Real-time, client-side volumetric 3D engine with dynamic light tracing specular highlights, phong metallic luster, and cursor-sensitive vectors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
        {/* Left Side: 3D Studio Canvas Frame (7 Cols) */}
        <div 
          ref={containerRef}
          className="lg:col-span-7 flex flex-col justify-between glass-panel rounded-xl border border-gray-800/60 p-6 relative bg-cyber-dark/10 shadow-2xl overflow-hidden min-h-[440px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle grid mesh background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Canvas Headers */}
          <div className="flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">
                VECTOR_ENGINE_RENDER_STABLE
              </span>
            </div>
            
            <span className="text-[8.5px] font-mono text-slate-500 border border-slate-800 px-2 py-0.5 rounded bg-gray-950/40 uppercase">
              Drag Model to Rotate
            </span>
          </div>

          {/* Actual 3D Canvas element */}
          <div className="relative h-64 my-4 rounded-lg bg-gray-950/40 border border-gray-900/60 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Float notification alerts inside studio */}
            <AnimatePresence>
              {infoAlert && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-4 left-4 right-4 bg-gray-950 border border-cyan-500/30 px-3 py-1.5 rounded-md flex items-center gap-2"
                >
                  <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-mono text-[9.5px] text-slate-300 leading-normal">
                    {infoAlert}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Live telemetry details below canvas */}
          <div className="grid grid-cols-3 gap-3 font-mono text-[8.5px] text-slate-500 z-10">
            <div className="bg-gray-950 p-2 rounded border border-gray-900 flex flex-col">
              <span className="text-slate-600">ACTIVE GEOMETRY</span>
              <span className="text-cyan-400 font-bold uppercase">{activeShape} MODEL</span>
            </div>
            <div className="bg-gray-950 p-2 rounded border border-gray-900 flex flex-col">
              <span className="text-slate-600">MATERIAL SHADER</span>
              <span className="text-purple-400 font-bold uppercase">{metalFinish}</span>
            </div>
            <div className="bg-gray-950 p-2 rounded border border-gray-900 flex flex-col">
              <span className="text-slate-600">RENDER COMPLEXITY</span>
              <span className="text-amber-500 font-bold uppercase">
                {activeShape === "gem" ? "20 POLYGONS" : 
                 activeShape === "shield" ? "24 POLYGONS" : 
                 activeShape === "star" ? "20 FACETS" : 
                 activeShape === "cube" ? "12 FACETS" : 
                 activeShape === "knot" ? "1,280 POLYGONS" : 
                 activeShape === "dna" ? "1,168 POLYGONS" : 
                 activeShape === "mobius" ? "840 FACETS" : 
                 activeShape === "quantum_fluid" ? `${raymarchQuality === "low" ? "19.2K" : raymarchQuality === "medium" ? "43.2K" : "76.8K"} RAY-STEPS` : 
                 "324 FACETS"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Shader Console Controls (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-panel rounded-xl border border-gray-800/60 p-6 space-y-6 bg-cyber-dark/10 shadow-2xl">
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <h3 className="text-xs font-mono text-purple-400 tracking-wider uppercase">
                  METAL FINISH MATRIX
                </h3>
              </div>
              <Cpu className="w-3.5 h-3.5 text-slate-600 animate-pulse" />
            </div>

            {/* Model Selection Row */}
            <div className="space-y-2">
              <label className="block text-[9.5px] font-mono text-slate-500 tracking-widest uppercase">
                SELECT 3D MODEL
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "gem", label: "Geodesic Crystal", icon: Sparkles },
                  { id: "apple", label: "Apple Logo", icon: Apple },
                  { id: "shield", label: "Defender Shield", icon: Shield },
                  { id: "torus", label: "Torus Ring", icon: Rotate3d },
                  { id: "star", label: "Volumetric Star", icon: Star },
                  { id: "cube", label: "Industrial Cube", icon: Box },
                  { id: "knot", label: "Quantum Knot 🧬", icon: Infinity },
                  { id: "dna", label: "Double Helix 🧬", icon: Dna },
                  { id: "mobius", label: "Mobius Strip ♾️", icon: Layers },
                  { id: "quantum_fluid", label: "Quantum Fluid 🧬", icon: Cpu },
                ].map((shape) => {
                  const IconComp = shape.icon;
                  const isActive = activeShape === shape.id;
                  return (
                    <button
                      key={shape.id}
                      onClick={() => selectShape(shape.id as any)}
                      className={`py-2 px-3 rounded border text-left font-mono text-[10px] flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                          : "bg-gray-950/40 border-gray-900 text-slate-400 hover:border-gray-700/60 hover:text-slate-200"
                      }`}
                    >
                      <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                      {shape.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Metallic Finish Selection Row */}
            <div className="space-y-2">
              <label className="block text-[9.5px] font-mono text-slate-500 tracking-widest uppercase">
                METALLIC SURFACE LUSTER
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "chrome", label: "Liquid Chrome", color: "from-slate-300 to-slate-500" },
                  { id: "gold", label: "Liquid Gold", color: "from-amber-400 to-yellow-600" },
                  { id: "obsidian", label: "Dark Obsidian", color: "from-gray-800 to-slate-950" },
                  { id: "neon", label: "Cyber Neon", color: "from-fuchsia-500 to-cyan-400" },
                ].map((finish) => {
                  const isActive = metalFinish === finish.id;
                  return (
                    <button
                      key={finish.id}
                      onClick={() => selectFinish(finish.id as any)}
                      className={`py-2 px-3 rounded border text-left font-mono text-[10px] flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-purple-500/10 border-purple-500/60 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                          : "bg-gray-950/40 border-gray-900 text-slate-400 hover:border-gray-700/60 hover:text-slate-200"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${finish.color} border border-white/10`} />
                      {finish.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Render Mode Selectors */}
            <div className="space-y-2">
              <label className="block text-[9.5px] font-mono text-slate-500 tracking-widest uppercase">
                SURFACE RENDERING POLICIES
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "shaded", label: "Solid Shaded" },
                  { id: "wireframe", label: "Wireframe" },
                  { id: "both", label: "Combo Overlay" },
                  { id: "hologram", label: "Laser Hologram 📡" },
                ].map((mode) => {
                  const isActive = renderMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setRenderMode(mode.id as any);
                        triggerAudioFeedback();
                      }}
                      className={`py-1.5 px-2 rounded border text-center font-mono text-[8.5px] uppercase transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-amber-500/10 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                          : "bg-gray-950/40 border-gray-900 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Speed Control Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between font-mono text-[9.5px]">
                <span className="text-slate-500 uppercase tracking-widest">AUTO_SPIN_VELOCITY</span>
                <span className="text-cyan-400 font-bold">{rotationSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={rotationSpeed}
                onChange={(e) => {
                  setRotationSpeed(parseFloat(e.target.value));
                  triggerAudioFeedback();
                }}
                className="w-full h-1 bg-gray-800 rounded appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Quantum Fluid Resolution Quality (Contextual) */}
            <AnimatePresence>
              {activeShape === "quantum_fluid" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2.5 pt-3 border-t border-gray-900/40 overflow-hidden"
                >
                  <div className="flex justify-between items-center">
                    <label className="block text-[9.5px] font-mono text-cyan-400 tracking-widest uppercase">
                      QUANTUM RAYMARCH RESOLUTION
                    </label>
                    <span className="text-[8.5px] font-mono text-slate-500 bg-gray-950 px-1.5 py-0.5 rounded border border-gray-900">
                      CPU-bound SDF
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "low", label: "Low (160x120)", desc: "Fluid 60FPS" },
                      { id: "medium", label: "Med (240x180)", desc: "Crisp detail" },
                      { id: "high", label: "High (320x240)", desc: "Ultra-sharp" },
                    ].map((q) => {
                      const isActive = raymarchQuality === q.id;
                      return (
                        <button
                          key={q.id}
                          onClick={() => {
                            setRaymarchQuality(q.id as any);
                            triggerAudioFeedback();
                          }}
                          className={`py-1.5 px-1 rounded border text-center transition-all duration-300 cursor-pointer ${
                            isActive
                              ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.1)]"
                              : "bg-gray-950/40 border-gray-900 text-slate-500 hover:text-slate-300 hover:border-gray-800"
                          }`}
                        >
                          <div className="font-mono text-[8.5px] font-bold">{q.label}</div>
                          <div className="text-[7.5px] text-slate-600 font-sans mt-0.5">{q.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[8px] font-mono text-slate-500 leading-normal bg-gray-950/60 p-2 rounded border border-gray-900/40">
                    <span className="text-amber-500">Why starting low?</span> Standard Raymarching requires intensive parallel computing. Running it on the CPU (to maintain 100% WebGL-free portability) means we limit default pixels to maintain a smooth 60 FPS. Bump it up to Medium or High to unlock pristine vector grids if your system permits!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Explanatory telemetry terminal block */}
          <div className="pt-4 border-t border-gray-900/60 flex flex-col justify-end">
            <div className="bg-gray-950 p-3 rounded border border-gray-900 font-mono text-[9px] text-slate-400 leading-relaxed flex items-start gap-2.5">
              <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="text-slate-100 font-medium">Specular Phong Lighting Algorithm:</span>
                {" "}Renders dynamic specular highlights by calculating reflection vectors pointing towards camera viewport coordinate matrices. Drag model to lock orientation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
