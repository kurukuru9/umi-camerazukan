import React, { useEffect, useRef, useState } from "react";
import { Species } from "../types";
import { speciesList } from "../speciesData";

interface SeaCanvasProps {
  creatures: Species[];
  animationType?: string; // e.g. "clownfish_anemone", "neutral_swim", etc.
  isResultMode?: boolean;  // Whether it's playing a specific ecology story or just general tank floating
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  type: "bubble" | "star" | "ink" | "clean_sparkle" | "sunray";
  life?: number;
  maxLife?: number;
}

interface AnimatedCreature {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  illustrationType: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  width: number;
  height: number;
  angle: number;
  flipX: boolean;
  wiggle: number;
  customTimer: number;
  state: string; // e.g., "wandering", "hiding", "cleaning", "chasing", "escaping", "riding"
}

export default function SeaCanvas({ creatures, animationType = "neutral_swim", isResultMode = false }: SeaCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  // Handle ResizeObserver to resize canvas responsibly without layout break
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // set dimensions (with some defaults if 0)
        setDimensions({
          width: Math.max(width, 300),
          height: Math.max(height, 280),
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Adjust canvas resolution for high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // Initial State of Creatures
    const animCreatures: AnimatedCreature[] = creatures.map((sp, idx) => {
      // Stagger start positions across the tank
      const segmentWidth = dimensions.width / (creatures.length + 1);
      const x = segmentWidth * (idx + 1) + (Math.random() - 0.5) * 50;
      const y = dimensions.height / 2 + (Math.random() - 0.5) * 100;

      return {
        id: sp.id,
        name: sp.name,
        color: sp.color,
        bgColor: sp.bgColor,
        illustrationType: sp.illustrationType,
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1,
        targetX: x,
        targetY: y,
        width: 80, // bounding box width
        height: 80, // bounding box height
        angle: 0,
        flipX: Math.random() > 0.5,
        wiggle: Math.random() * Math.PI,
        customTimer: 0,
        state: "wandering"
      };
    });

    // Particle array for bubbles/ink/sparkles
    let particles: Particle[] = [];
    
    // Generate initial bubbles
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height + 50,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.4 - Math.random() * 0.8,
        size: 2 + Math.random() * 4,
        opacity: 0.2 + Math.random() * 0.4,
        color: "rgba(255, 255, 255, 0.4)",
        type: "bubble"
      });
    }

    let animationId: number;
    let frameCount = 0;

    // RENDER LOOP
    const tick = () => {
      frameCount++;
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // 1. Draw Water Background Gradient
      let bgGrad;
      if (isResultMode && animationType === "niche_mismatch") {
        // Double niche background (Cold ice blue vs. Warm coral aqua)
        bgGrad = ctx.createLinearGradient(0, 0, dimensions.width, 0);
        bgGrad.addColorStop(0, "#E0F2FE"); // Very light cold blue
        bgGrad.addColorStop(0.48, "#BAE6FD");
        bgGrad.addColorStop(0.5, "#E0F2FE"); // border division
        bgGrad.addColorStop(0.52, "#E0F2FE");
        bgGrad.addColorStop(1, "#E0F7FA"); // warm coral cyan
      } else {
        bgGrad = ctx.createLinearGradient(0, 0, 0, dimensions.height);
        bgGrad.addColorStop(0, "#E0F2FE"); // Light surface blue
        bgGrad.addColorStop(1, "#7DD3FC"); // Deep pastel blue
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // 2. Draw Sunrays (Shining down light beams)
      if (frameCount % 40 === 0 && Math.random() > 0.5) {
        particles.push({
          x: Math.random() * dimensions.width,
          y: 0,
          vx: 0.1 + Math.random() * 0.2,
          vy: 1 + Math.random() * 1.5,
          size: 20 + Math.random() * 40,
          opacity: 0.05,
          color: "rgba(255, 255, 255, 0.08)",
          type: "sunray",
          life: 0,
          maxLife: 200 + Math.random() * 100
        });
      }

      // Draw bottom sand bed
      ctx.fillStyle = "#FEF08A"; // Pastel warm yellow
      ctx.beginPath();
      ctx.ellipse(dimensions.width / 2, dimensions.height + 20, dimensions.width * 0.6, 50, 0, 0, Math.PI, true);
      ctx.fill();

      // Draw some sea weeds on the sand
      ctx.strokeStyle = "#10B981"; // Emerald green
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      for (let i = 0; i < dimensions.width; i += 120) {
        ctx.beginPath();
        ctx.moveTo(i + 20, dimensions.height - 10);
        ctx.quadraticCurveTo(
          i + 20 + Math.sin(frameCount / 30 + i) * 15,
          dimensions.height - 40,
          i + 15 + Math.sin(frameCount / 30 + i) * 20,
          dimensions.height - 80
        );
        ctx.stroke();
      }

      // 3. Process Particles (Bubbles / Ink / Sparkles)
      particles = particles.filter(p => {
        // Update positions
        p.x += p.vx;
        p.y += p.vy;

        // Render based on type
        if (p.type === "bubble") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
          ctx.fill();

          // Bubble glint
          ctx.beginPath();
          ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          ctx.fill();

          // Float back to bottom if out of bounds
          if (p.y < -10) {
            p.y = dimensions.height + 10;
            p.x = Math.random() * dimensions.width;
          }
          return true;
        } else if (p.type === "ink") {
          p.size += 0.4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(15, 23, 42, ${p.opacity * 0.7})`;
          ctx.fill();
          p.opacity -= 0.01;
          return p.opacity > 0;
        } else if (p.type === "clean_sparkle") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            ctx.lineTo(0, -p.size);
            ctx.lineTo(p.size * 0.3, -p.size * 0.3);
            ctx.rotate(Math.PI / 2);
          }
          ctx.closePath();
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.restore();
          p.size -= 0.1;
          return p.size > 0;
        } else if (p.type === "sunray") {
          p.life!++;
          ctx.beginPath();
          ctx.moveTo(p.x - p.size, 0);
          ctx.lineTo(p.x + p.size, 0);
          ctx.lineTo(p.x + p.size * 1.5 + p.vx * 100, dimensions.height);
          ctx.lineTo(p.x - p.size * 1.5 + p.vx * 100, dimensions.height);
          ctx.closePath();
          ctx.fillStyle = p.color;
          ctx.fill();
          return p.life! < p.maxLife!;
        }
        return false;
      });

      // Spawn extra interactive bubbles sometimes
      if (frameCount % 10 === 0 && Math.random() > 0.7) {
        particles.push({
          x: Math.random() * dimensions.width,
          y: dimensions.height + 5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.5 - Math.random() * 0.6,
          size: 1 + Math.random() * 3,
          opacity: 0.1 + Math.random() * 0.3,
          color: "rgba(255, 255, 255, 0.3)",
          type: "bubble"
        });
      }

      // 4. ANIMATE & DRAW EACH CREATURE based on Interaction Script
      animCreatures.forEach((c) => {
        c.wiggle += 0.05;
        c.customTimer++;

        // Apply interaction physics based on result anim
        if (isResultMode) {
          applyEcologyPhysics(c, animCreatures, particles, dimensions, animationType, frameCount);
        } else {
          // Standard peaceful wandering tank physics
          applyPeacefulPhysics(c, dimensions, frameCount);
        }

        // Draw Creature Body
        ctx.save();
        ctx.translate(c.x, c.y);

        // Gentle rotate wiggle depending on velocity or body type
        let tilt = c.vy * 0.08 + Math.sin(c.wiggle) * 0.03;
        ctx.rotate(tilt);

        // Handle Horizontal Flip based on direction
        const scaleX = c.flipX ? -1 : 1;
        ctx.scale(scaleX, 1);

        // Draw the exact stylized cute vector illustration
        drawStylizedCreature(ctx, c.id, c.color, c.bgColor, frameCount, c);

        ctx.restore();

        // 5. Render Bubble text or name tags in very clean Japanese font for kids
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        
        // Draw cute floating name label
        ctx.fillStyle = "#0284C7"; // Ocean blue label
        ctx.font = "bold 10px sans-serif";
        ctx.fillText(c.name, 0, -42);
        ctx.restore();
      });

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [creatures, dimensions, animationType, isResultMode]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#E0F2FE]">
      {/* Background bubble count decorative header */}
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

// -----------------------------------------------------------------
// PHYSIC PATTERNS & BEHAVIOR MODELS FOR REALTIONAL INTERACTIONS
// -----------------------------------------------------------------

// Peaceful float and gentle wander
function applyPeacefulPhysics(c: AnimatedCreature, dims: { width: number; height: number }, frame: number) {
  // Occasional random target changes
  if (Math.random() > 0.985 || Math.abs(c.x - c.targetX) < 10) {
    c.targetX = 40 + Math.random() * (dims.width - 80);
    c.targetY = 40 + Math.random() * (dims.height - 100);
  }

  // Float towards target
  const dx = c.targetX - c.x;
  const dy = c.targetY - c.y;
  c.vx += dx * 0.001;
  c.vy += dy * 0.001;

  // Damp velocity
  c.vx *= 0.98;
  c.vy *= 0.98;

  // Limit speed
  const speed = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
  const maxSpeed = 1.0;
  if (speed > maxSpeed) {
    c.vx = (c.vx / speed) * maxSpeed;
    c.vy = (c.vy / speed) * maxSpeed;
  }

  // Update position
  c.x += c.vx;
  c.y += c.vy;

  // Direction flip
  if (c.vx > 0.05) c.flipX = true;
  if (c.vx < -0.05) c.flipX = false;

  // Edge safety bounds
  if (c.x < 30) { c.x = 30; c.vx *= -1; }
  if (c.x > dims.width - 30) { c.x = dims.width - 30; c.vx *= -1; }
  if (c.y < 30) { c.y = 30; c.vy *= -1; }
  if (c.y > dims.height - 40) { c.y = dims.height - 40; c.vy *= -1; }
}

// Complex relationship logic involving 2, 3, or more creatures
function applyEcologyPhysics(
  c: AnimatedCreature,
  all: AnimatedCreature[],
  particles: Particle[],
  dims: { width: number; height: number },
  animType: string,
  frame: number
) {
  // Find key actor reference types in this relationship animation
  const anemone = all.find(a => a.id === "anemone");
  const clownfish = all.find(a => a.id === "clownfish");
  const shark = all.find(a => a.id === "shark");
  const remora = all.find(a => a.id === "remora");
  const whale_shark = all.find(a => a.id === "whale_shark");
  const eel = all.find(a => a.id === "eel");
  const shrimp = all.find(a => a.id === "shrimp");
  const hermit = all.find(a => a.id === "hermit_crab");
  const whale = all.find(a => a.id === "whale");
  const plankton = all.filter(a => a.id === "plankton");
  const anchovies = all.find(a => a.id === "anchovies");
  const octopus = all.find(a => a.id === "octopus");
  const crab = all.find(a => a.id === "crab");
  const sea_turtle = all.find(a => a.id === "sea_turtle");
  const jellyfish = all.find(a => a.id === "jellyfish");
  const sea_otter = all.find(a => a.id === "sea_otter");
  const penguin = all.find(a => a.id === "penguin");
  const orca = all.find(a => a.id === "orca");

  // 1. CLOWNFISH & ANEMONE: Clownfish swims around, then hides in anemone tentacles
  if (animType === "clownfish_anemone") {
    if (c.id === "anemone") {
      // Anchored to sea floor
      c.x = dims.width / 2;
      c.y = dims.height - 45;
      c.vx = 0; c.vy = 0;
    } else if (c.id === "clownfish") {
      // Periodically hide
      const phase = Math.floor(frame / 200) % 2;
      if (phase === 0 && anemone) {
        // Swim into anemone
        const dx = anemone.x - c.x;
        const dy = (anemone.y - 10) - c.y;
        c.vx = dx * 0.05;
        c.vy = dy * 0.05;
        c.flipX = dx > 0;
        if (Math.abs(dx) < 15 && frame % 15 === 0) {
          // emit clean sparkles
          particles.push({
            x: c.x, y: c.y, vx: (Math.random() - 0.5) * 1, vy: -0.5 - Math.random() * 0.5,
            size: 3 + Math.random() * 3, opacity: 0.8, color: "#F472B6", type: "clean_sparkle"
          });
        }
      } else {
        // Wandering around happily near anemone
        c.targetX = dims.width / 2 + Math.sin(frame / 40) * 80;
        c.targetY = dims.height / 2 + Math.cos(frame / 30) * 40;
        const dx = c.targetX - c.x;
        const dy = c.targetY - c.y;
        c.vx = dx * 0.02;
        c.vy = dy * 0.02;
        c.flipX = c.vx > 0;
      }
      c.x += c.vx; c.y += c.vy;
    } else {
      // Third/additional species wanders peacefully
      applyPeacefulPhysics(c, dims, frame);
    }
  }

  // 2. SHARK / WHALE SHARK & REMORA: Remora rides on the belly or alongside
  else if (animType === "shark_remora" || animType === "whale_shark_remora") {
    const host = animType === "shark_remora" ? shark : whale_shark;
    if (c === host && host) {
      // Slow back and forth cruise
      c.vx = c.flipX ? 1.5 : -1.5;
      c.vy = Math.sin(frame / 50) * 0.3;
      c.x += c.vx; c.y += c.vy;
      if (c.x > dims.width - 50) c.flipX = false;
      if (c.x < 50) c.flipX = true;
    } else if (c.id === "remora" && host) {
      // Cling to Host belly or swim close behind
      c.flipX = host.flipX;
      c.x = host.x + (host.flipX ? -25 : 25);
      c.y = host.y + 22;
    } else {
      applyPeacefulPhysics(c, dims, frame);
    }
  }

  // 3. EEL & SHRIMP: Cleaning service
  else if (animType === "eel_shrimp") {
    if (c.id === "eel") {
      // Stay near rock wall (right bottom corner)
      c.x = dims.width - 60;
      c.y = dims.height - 45;
      c.vx = 0; c.vy = 0;
      c.flipX = false; // face left
    } else if (c.id === "shrimp" && eel) {
      // Jump on Eel's back to clean
      c.x = eel.x - 25 + Math.sin(frame / 10) * 2;
      c.y = eel.y - 12 + Math.cos(frame / 15) * 2;
      c.flipX = true; // face right
      if (frame % 20 === 0) {
        // Emit cleanup sparkles
        particles.push({
          x: c.x + 10, y: c.y, vx: (Math.random() - 0.5) * 1, vy: -0.5,
          size: 4 + Math.random() * 4, opacity: 0.9, color: "#60A5FA", type: "clean_sparkle"
        });
      }
    } else {
      applyPeacefulPhysics(c, dims, frame);
    }
  }

  // 4. ANEMONE & HERMIT CRAB: Hermit Crab carries Anemone
  else if (animType === "anemone_hermit_crab") {
    if (c.id === "hermit_crab") {
      // Walk left and right on the seabed
      c.vx = c.flipX ? 0.6 : -0.6;
      c.y = dims.height - 42;
      c.x += c.vx;
      if (c.x > dims.width - 60) c.flipX = false;
      if (c.x < 60) c.flipX = true;
    } else if (c.id === "anemone" && hermit) {
      // Sits on top of hermit shell
      c.x = hermit.x + (hermit.flipX ? -5 : 5);
      c.y = hermit.y - 22;
      c.flipX = hermit.flipX;
    } else {
      applyPeacefulPhysics(c, dims, frame);
    }
  }

  // 5. SHARK & ANCHOVIES: Schooling ball scatter
  else if (animType === "shark_anchovies") {
    if (c.id === "shark") {
      // Chase anchor point
      if (frame % 150 === 0) {
        c.targetX = 60 + Math.random() * (dims.width - 120);
        c.targetY = 60 + Math.random() * (dims.height - 120);
      }
      const dx = c.targetX - c.x;
      const dy = c.targetY - c.y;
      c.vx = dx * 0.015;
      c.vy = dy * 0.015;
      c.x += c.vx; c.y += c.vy;
      c.flipX = c.vx > 0;
    } else if (c.id === "anchovies" && shark) {
      // Swim away in fear if shark is close
      const dx = c.x - shark.x;
      const dy = c.y - shark.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        // Scatter fast!
        c.vx = (dx / dist) * 3;
        c.vy = (dy / dist) * 3;
        // emit bubbles
        if (frame % 8 === 0) {
          particles.push({
            x: c.x, y: c.y, vx: -c.vx * 0.5, vy: -0.5,
            size: 2 + Math.random() * 3, opacity: 0.6, color: "white", type: "bubble"
          });
        }
      } else {
        // Swim peacefully in spiral circle
        c.targetX = dims.width / 2 + Math.cos(frame / 40) * 100;
        c.targetY = dims.height / 2 + Math.sin(frame / 40) * 60;
        const sDx = c.targetX - c.x;
        const sDy = c.targetY - c.y;
        c.vx = sDx * 0.02;
        c.vy = sDy * 0.02;
      }
      c.x += c.vx; c.y += c.vy;
      c.flipX = c.vx > 0;
    } else {
      applyPeacefulPhysics(c, dims, frame);
    }
  }

  // 6. WHALE / WHALE SHARK & PLANKTON: Feeding gulp
  else if (animType === "whale_plankton" || animType === "whale_shark_plankton") {
    const host = animType === "whale_plankton" ? whale : whale_shark;
    if (c === host && host) {
      // Swims slowly across, opening mouth
      c.vx = c.flipX ? 1.0 : -1.0;
      c.vy = Math.sin(frame / 60) * 0.2;
      c.x += c.vx; c.y += c.vy;
      if (c.x > dims.width + 120) { c.x = -100; c.flipX = true; }
      if (c.x < -120) { c.x = dims.width + 100; c.flipX = false; }
    } else if (c.id === "plankton" && host) {
      // Sucked towards mouth
      const mouthX = host.x + (host.flipX ? 40 : -40);
      const mouthY = host.y;
      const dx = mouthX - c.x;
      const dy = mouthY - c.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        // Gravity vacuum pull!
        c.vx = dx * 0.06;
        c.vy = dy * 0.06;
        if (dist < 20) {
          // Re-spawn plankton on opposite side
          c.x = host.flipX ? dims.width + 50 : -50;
          c.y = Math.random() * dims.height;
          c.vx = (Math.random() - 0.5) * 1;
        }
      } else {
        // Wandering drift
        c.vx = (Math.random() - 0.5) * 0.5;
        c.vy = -0.1 - Math.random() * 0.2;
      }
      c.x += c.vx; c.y += c.vy;
    } else {
      applyPeacefulPhysics(c, dims, frame);
    }
  }

  // 7. EEL & OCTOPUS: Predator chase and ink spray
  else if (animType === "eel_octopus") {
    if (c.id === "eel") {
      if (octopus) {
        // Swim directly towards Octopus to hunt
        const dx = octopus.x - c.x;
        const dy = octopus.y - c.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        c.vx = (dx / dist) * 1.8;
        c.vy = (dy / dist) * 1.8;
        c.flipX = c.vx > 0;
      }
      c.x += c.vx; c.y += c.vy;
    } else if (c.id === "octopus" && eel) {
      const dx = c.x - eel.x;
      const dy = c.y - eel.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 110) {
        // Blast away!
        c.vx = (dx / dist) * 2.8;
        c.vy = (dy / dist) * 2.8;
        c.flipX = c.vx > 0;

        // Spray black ink screen block!
        if (frame % 6 === 0) {
          particles.push({
            x: c.x, y: c.y, vx: -c.vx * 0.3, vy: -c.vy * 0.3,
            size: 8, opacity: 1.0, color: "#1E293B", type: "ink"
          });
        }
      } else {
        // Wandering near floor
        c.targetX = dims.width / 4 + Math.sin(frame / 30) * 50;
        c.targetY = dims.height - 60;
        const sDx = c.targetX - c.x;
        const sDy = c.targetY - c.y;
        c.vx = sDx * 0.02;
        c.vy = sDy * 0.02;
        c.flipX = c.vx > 0;
      }
      c.x += c.vx; c.y += c.vy;
    } else {
      applyPeacefulPhysics(c, dims, frame);
    }
  }

  // 8. OCTOPUS & CRAB: Crab defense/click
  else if (animType === "octopus_crab") {
    if (c.id === "octopus") {
      if (crab) {
        const dx = crab.x - c.x;
        const dy = (crab.y - 10) - c.y;
        c.vx = dx * 0.015;
        c.vy = dy * 0.015;
        c.flipX = c.vx > 0;
      }
      c.x += c.vx; c.y += c.vy;
    } else if (c.id === "crab") {
      // Stays on bottom
      c.y = dims.height - 40;
      if (octopus) {
        // Look at octopus
        c.flipX = octopus.x < c.x;
      }
      c.vx = 0; c.vy = 0;
    } else {
      applyPeacefulPhysics(c, dims, frame);
    }
  }

  // 9. TURTLE & JELLYFISH: Gulp munch
  else if (animType === "sea_turtle_jellyfish") {
    if (c.id === "sea_turtle") {
      if (jellyfish) {
        // Hunt jellyfish
        const dx = jellyfish.x - c.x;
        const dy = jellyfish.y - c.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        c.vx = (dx / dist) * 1.5;
        c.vy = (dy / dist) * 1.5;
        c.flipX = c.vx > 0;

        // Munch! If very close
        if (dist < 15 && frame % 15 === 0) {
          // Sparkle munch effect
          particles.push({
            x: jellyfish.x, y: jellyfish.y, vx: (Math.random() - 0.5) * 1, vy: (Math.random() - 0.5) * 1,
            size: 4 + Math.random() * 3, opacity: 0.9, color: "#C084FC", type: "clean_sparkle"
          });
        }
      } else {
        applyPeacefulPhysics(c, dims, frame);
      }
      c.x += c.vx; c.y += c.vy;
    } else if (c.id === "jellyfish") {
      // Drift lazily up and down
      c.vx = Math.sin(frame / 60) * 0.2;
      c.vy = Math.cos(frame / 40) * 0.3;
      c.x += c.vx; c.y += c.vy;
    } else {
      applyPeacefulPhysics(c, dims, frame);
    }
  }

  // 10. SEA OTTER & CRAB: Floating belly click
  else if (animType === "sea_otter_crab") {
    if (c.id === "sea_otter") {
      // Float at surface
      c.x = dims.width / 2 + Math.sin(frame / 50) * 60;
      c.y = 40;
      c.vx = 0; c.vy = 0;
      c.flipX = false;
    } else if (c.id === "crab") {
      // Sits on bottom under otter, looking up
      c.x = dims.width / 2;
      c.y = dims.height - 40;
      c.vx = 0; c.vy = 0;
    } else {
      applyPeacefulPhysics(c, dims, frame);
    }
  }

  // 11. ORCA & PENGUIN: Arctic escape swim
  else if (animType === "orca_penguin") {
    if (c.id === "orca") {
      if (penguin) {
        const dx = penguin.x - c.x;
        const dy = penguin.y - c.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        c.vx = (dx / dist) * 2.2;
        c.vy = (dy / dist) * 2.2;
        c.flipX = c.vx > 0;
      }
      c.x += c.vx; c.y += c.vy;
    } else if (c.id === "penguin" && orca) {
      const dx = c.x - orca.x;
      const dy = c.y - orca.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        // High speed escape! Leap out
        c.vx = (dx / dist) * 3.2;
        c.vy = (dy / dist) * 3.2 + Math.sin(frame / 5) * 1.5;
        if (frame % 6 === 0) {
          particles.push({
            x: c.x, y: c.y, vx: -c.vx * 0.4, vy: -0.5,
            size: 2 + Math.random() * 3, opacity: 0.7, color: "white", type: "bubble"
          });
        }
      } else {
        applyPeacefulPhysics(c, dims, frame);
      }
      c.x += c.vx; c.y += c.vy;
      c.flipX = c.vx > 0;
    } else {
      applyPeacefulPhysics(c, dims, frame);
    }
  }

  // 12. NICHE MISMATCH (生息地ちがい / Thermal divide)
  else if (animType === "niche_mismatch") {
    // Left side (cold species) vs. Right side (warm species)
    // Identify temperature group
    const species = speciesList.find(s => s.id === c.id);
    const tempGroup = species ? species.tempZone : "any";

    if (tempGroup === "cold") {
      // Keep on left half
      c.targetX = 40 + Math.random() * (dims.width * 0.4 - 80);
      c.targetY = 40 + Math.random() * (dims.height - 100);
      applyPeacefulPhysics(c, dims, frame);
      if (c.x > dims.width * 0.45) { c.x = dims.width * 0.45; c.vx *= -1; }
    } else if (tempGroup === "warm") {
      // Keep on right half
      c.targetX = dims.width * 0.55 + Math.random() * (dims.width * 0.4 - 80);
      c.targetY = 40 + Math.random() * (dims.height - 100);
      applyPeacefulPhysics(c, dims, frame);
      if (c.x < dims.width * 0.55) { c.x = dims.width * 0.55; c.vx *= -1; }
    } else {
      // Any species wanders either side
      applyPeacefulPhysics(c, dims, frame);
    }
  }

  // DEFAULT / NEUTRAL / THREE PLUS CREATURES
  else {
    applyPeacefulPhysics(c, dims, frame);
  }
}

// -----------------------------------------------------------------
// STYLIZED CUTE VECTOR DRAWING UTILITY (Match illustrations precisely)
// -----------------------------------------------------------------
function drawStylizedCreature(
  ctx: CanvasRenderingContext2D,
  id: string,
  color: string,
  bgColor: string,
  frame: number,
  c: AnimatedCreature
) {
  ctx.save();

  // Wiggle scale animation (makes swimming feel juicy and organic)
  const stretchX = 1 + Math.sin(frame * 0.1) * 0.05;
  const stretchY = 1 - Math.sin(frame * 0.1) * 0.05;
  ctx.scale(stretchX, stretchY);

  switch (id) {
    case "clownfish":
      // Orange Body
      ctx.fillStyle = "#FF8A3D";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;
      
      // Main body ellipse
      ctx.beginPath();
      ctx.ellipse(0, 0, 36, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // White stripes with outline
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.ellipse(-8, 0, 6, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(14, 0, 5, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Tail fin
      ctx.fillStyle = "#FF8A3D";
      ctx.beginPath();
      ctx.moveTo(-34, 0);
      ctx.lineTo(-50, -18);
      ctx.quadraticCurveTo(-44, 0, -50, 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Big Eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(18, -6, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(20, -6, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(21.5, -7.5, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Smile mouth
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(24, 6, 5, 0.1, Math.PI * 0.8);
      ctx.stroke();
      break;

    case "anemone":
      // Pink pedestal
      ctx.fillStyle = "#F472B6";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-25, 30);
      ctx.lineTo(25, 30);
      ctx.lineTo(20, 10);
      ctx.lineTo(-20, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tentacles
      ctx.lineWidth = 2;
      const tentCount = 5;
      for (let i = 0; i < tentCount; i++) {
        const offset = (i - (tentCount - 1) / 2) * 10;
        const wave = Math.sin(frame * 0.08 + i) * 6;
        ctx.beginPath();
        ctx.moveTo(offset, 10);
        ctx.quadraticCurveTo(offset * 1.5 + wave, -15, offset * 1.8 + wave * 1.2, -35);
        ctx.stroke();
        
        // cute circle tip
        ctx.fillStyle = "#F472B6";
        ctx.beginPath();
        ctx.arc(offset * 1.8 + wave * 1.2, -35, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Blushing Face
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.arc(-8, 20, 1.5, 0, Math.PI * 2);
      ctx.arc(8, 20, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#F43F5E";
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.ellipse(-14, 22, 3, 1.5, 0, 0, Math.PI * 2);
      ctx.ellipse(14, 22, 3, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 22, 3, 0.1, Math.PI * 0.9);
      ctx.stroke();
      break;

    case "shark":
      ctx.fillStyle = "#94A3B8";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;

      // Shark body
      ctx.beginPath();
      ctx.moveTo(-38, 5);
      ctx.quadraticCurveTo(-15, -25, 18, -15);
      ctx.quadraticCurveTo(35, -5, 42, 0);
      ctx.quadraticCurveTo(25, 18, 5, 15);
      ctx.quadraticCurveTo(-18, 13, -38, 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tail
      ctx.beginPath();
      ctx.moveTo(-38, 5);
      ctx.lineTo(-48, -10);
      ctx.lineTo(-44, 4);
      ctx.lineTo(-48, 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Fins
      ctx.beginPath();
      ctx.moveTo(-8, -17);
      ctx.lineTo(2, -38);
      ctx.lineTo(8, -19);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(24, -8, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(25, -8, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Grin teeth
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(26, 4, 6, 0.2, Math.PI * 0.8);
      ctx.stroke();
      break;

    case "anchovies":
      // 3 tiny fishes grouped
      ctx.fillStyle = "#60A5FA";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;

      const drawMiniFish = (tx: number, ty: number, waveIdx: number) => {
        ctx.save();
        ctx.translate(tx, ty);
        const swimWave = Math.sin(frame * 0.15 + waveIdx) * 3;
        ctx.rotate(swimWave * 0.05);

        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-14, 0);
        ctx.lineTo(-22, -7);
        ctx.lineTo(-20, 0);
        ctx.lineTo(-22, 7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(8, -2, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(8.5, -2, 0.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      drawMiniFish(10, -15, 0);
      drawMiniFish(-10, 10, 1);
      drawMiniFish(20, 15, 2);
      break;

    case "whale":
      ctx.fillStyle = "#3B82F6";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 3;

      // Whale body
      ctx.beginPath();
      ctx.moveTo(-40, 15);
      ctx.quadraticCurveTo(-30, -20, 2, -22);
      ctx.quadraticCurveTo(35, -20, 42, 0);
      ctx.quadraticCurveTo(38, 22, 5, 20);
      ctx.quadraticCurveTo(-25, 22, -40, 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Spout
      const spout = Math.sin(frame * 0.2) * 5;
      ctx.strokeStyle = "#38BDF8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(2, -22);
      ctx.quadraticCurveTo(2, -35 + spout, 8, -40 + spout);
      ctx.moveTo(2, -22);
      ctx.quadraticCurveTo(-4, -33 + spout, -12, -35 + spout);
      ctx.stroke();

      // Flipper
      ctx.fillStyle = "#2563EB";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(-2, 10, 12, 6, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Big Eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(28, -8, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(29.5, -8, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Cute Smile
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(35, 2, 5, 0.2, Math.PI * 0.8);
      ctx.stroke();
      break;

    case "whale_shark":
      ctx.fillStyle = "#1E3A8A";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 3;

      // Body shape
      ctx.beginPath();
      ctx.moveTo(-40, 2);
      ctx.quadraticCurveTo(-18, -30, 16, -28);
      ctx.quadraticCurveTo(38, -22, 42, -2);
      ctx.quadraticCurveTo(30, 22, 2, 18);
      ctx.quadraticCurveTo(-22, 15, -40, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tail fin
      ctx.beginPath();
      ctx.moveTo(-40, 2);
      ctx.lineTo(-50, -14);
      ctx.lineTo(-47, 1);
      ctx.lineTo(-50, 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Polka dots details
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(-8, -10, 1.5, 0, Math.PI * 2);
      ctx.arc(2, -12, 1.5, 0, Math.PI * 2);
      ctx.arc(12, -14, 1.5, 0, Math.PI * 2);
      ctx.arc(-2, -2, 2, 0, Math.PI * 2);
      ctx.arc(8, -4, 2, 0, Math.PI * 2);
      ctx.arc(18, -6, 1.5, 0, Math.PI * 2);
      ctx.arc(-12, 0, 1.5, 0, Math.PI * 2);
      ctx.arc(4, 6, 2, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(34, -15, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(35, -15, 2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "plankton":
      ctx.fillStyle = "#10B981";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;

      const drawMicroPlankton = (ox: number, oy: number, size: number) => {
        ctx.save();
        ctx.translate(ox, oy);
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(-size * 0.3, -size * 0.3, size * 0.25, 0, Math.PI * 2);
        ctx.arc(size * 0.3, -size * 0.3, size * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawMicroPlankton(-10, -10, 8);
      drawMicroPlankton(15, 10, 6);
      break;

    case "crab":
      ctx.fillStyle = "#EF4444";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;

      // Legs
      ctx.beginPath();
      ctx.moveTo(-20, 10); ctx.quadraticCurveTo(-28, 20, -34, 16);
      ctx.moveTo(-18, 0); ctx.quadraticCurveTo(-30, 4, -34, -2);
      ctx.moveTo(20, 10); ctx.quadraticCurveTo(28, 20, 34, 16);
      ctx.moveTo(18, 0); ctx.quadraticCurveTo(30, 4, 34, -2);
      ctx.stroke();

      // Shell
      ctx.beginPath();
      ctx.ellipse(0, 8, 26, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Claws
      ctx.beginPath();
      ctx.ellipse(-18, -4, 12, 6, Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(18, -4, 12, 6, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Eyes on stalks
      ctx.beginPath();
      ctx.moveTo(-8, -8); ctx.lineTo(-8, -20);
      ctx.moveTo(8, -8); ctx.lineTo(8, -20);
      ctx.stroke();

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(-8, -24, 5, 0, Math.PI * 2);
      ctx.arc(8, -24, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(-8, -24, 2.5, 0, Math.PI * 2);
      ctx.arc(8, -24, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 10, 5, 0.1, Math.PI * 0.9);
      ctx.stroke();
      break;

    case "octopus":
      ctx.fillStyle = "#EC4899";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;

      // Octopus head
      ctx.beginPath();
      ctx.ellipse(0, -10, 24, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Eyes
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(-10, -10, 5, 0, Math.PI * 2);
      ctx.arc(10, -10, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(-10, -10, 2.5, 0, Math.PI * 2);
      ctx.arc(10, -10, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Blush
      ctx.fillStyle = "#DB2777";
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.ellipse(-16, -4, 3.5, 1.5, 0, 0, Math.PI * 2);
      ctx.ellipse(16, -4, 3.5, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Tentacles wavy
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 4; i++) {
        const xOffset = (i - 1.5) * 12;
        const wave = Math.sin(frame * 0.12 + i) * 8;
        ctx.beginPath();
        ctx.moveTo(xOffset, 12);
        ctx.quadraticCurveTo(xOffset * 1.5 + wave, 25, xOffset * 1.2 + wave * 1.2, 38);
        ctx.stroke();
      }
      break;

    case "squid":
      ctx.fillStyle = "#F59E0B";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;

      // Top Fin
      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.lineTo(18, -32);
      ctx.lineTo(0, -20);
      ctx.lineTo(-18, -32);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Squid head/body
      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.lineTo(20, -12);
      ctx.lineTo(12, 22);
      ctx.lineTo(-12, 22);
      ctx.lineTo(-20, -12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Big eyes
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(-10, 10, 6, 0, Math.PI * 2);
      ctx.arc(10, 10, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(-10, 10, 3, 0, Math.PI * 2);
      ctx.arc(10, 10, 3, 0, Math.PI * 2);
      ctx.fill();

      // Tentacles hanging
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 3; i++) {
        const xOffset = (i - 1) * 8;
        const wave = Math.sin(frame * 0.15 + i) * 6;
        ctx.beginPath();
        ctx.moveTo(xOffset, 22);
        ctx.quadraticCurveTo(xOffset * 1.5 + wave, 35, xOffset * 1.2 + wave * 1.2, 45);
        ctx.stroke();
      }
      break;

    case "jellyfish":
      ctx.fillStyle = "#C084FC";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;

      // Umbrella dome
      ctx.beginPath();
      ctx.moveTo(-28, 0);
      ctx.bezierCurveTo(-28, -25, 28, -25, 28, 0);
      ctx.lineTo(22, 2);
      ctx.bezierCurveTo(15, 2, 12, -2, 0, -2);
      ctx.bezierCurveTo(-12, -2, -15, 2, -22, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // tentacles wavy
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const xOffset = (i - 1.5) * 12;
        const wave = Math.sin(frame * 0.1 + i) * 6;
        ctx.beginPath();
        ctx.moveTo(xOffset, 2);
        ctx.quadraticCurveTo(xOffset * 1.2 + wave, 18, xOffset + wave * 1.3, 35);
        ctx.stroke();
      }

      // Cute tiny face
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.arc(-6, -10, 1.8, 0, Math.PI * 2);
      ctx.arc(6, -10, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -6, 2, 0.1, Math.PI * 0.9);
      ctx.stroke();
      break;

    case "sea_turtle":
      ctx.fillStyle = "#10B981";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;

      // Flippers
      ctx.beginPath();
      ctx.ellipse(-20, -10, 16, 6, -Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(20, -10, 16, 6, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Turtle Shell
      ctx.fillStyle = "#047857";
      ctx.beginPath();
      ctx.ellipse(0, 2, 24, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Head
      ctx.fillStyle = "#10B981";
      ctx.beginPath();
      ctx.arc(0, -22, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(-3, -25, 1.5, 0, Math.PI * 2);
      ctx.arc(3, -25, 1.5, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "dolphin":
      ctx.fillStyle = "#38BDF8";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;

      // Dolphin curved body
      ctx.beginPath();
      ctx.moveTo(-38, 10);
      ctx.quadraticCurveTo(-18, -25, 18, -15);
      ctx.quadraticCurveTo(38, -5, 42, 0);
      ctx.quadraticCurveTo(25, 10, 5, 8);
      ctx.quadraticCurveTo(-18, 15, -38, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Snout
      ctx.beginPath();
      ctx.ellipse(40, -4, 8, 3, Math.PI / 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(28, -10, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(29, -10, 2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "orca":
      ctx.fillStyle = "#1E293B";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;

      // Body shape
      ctx.beginPath();
      ctx.moveTo(-38, 5);
      ctx.quadraticCurveTo(-15, -25, 18, -15);
      ctx.quadraticCurveTo(35, -5, 42, 0);
      ctx.quadraticCurveTo(25, 15, 5, 12);
      ctx.quadraticCurveTo(-18, 13, -38, 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // White spot near eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.ellipse(24, -14, 6, 3, -Math.PI / 12, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(32, -8, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(33, -8, 1.5, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "starfish":
      ctx.fillStyle = "#F43F5E";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;

      // Draw Star shape
      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.lineTo(11, -12);
      ctx.lineTo(39, -8);
      ctx.lineTo(19, 10);
      ctx.lineTo(24, 38);
      ctx.lineTo(0, 22);
      ctx.lineTo(-24, 38);
      ctx.lineTo(-19, 10);
      ctx.lineTo(-39, -8);
      ctx.lineTo(-11, -12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Smiley eyes
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(-8, -2, 4.5, 0, Math.PI * 2);
      ctx.arc(8, -2, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(-8, -2, 2, 0, Math.PI * 2);
      ctx.arc(8, -2, 2, 0, Math.PI * 2);
      ctx.fill();

      // Blush
      ctx.fillStyle = "#BE123C";
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.ellipse(-14, 3, 2.5, 1.2, 0, 0, Math.PI * 2);
      ctx.ellipse(14, 3, 2.5, 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Smile
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 4, 4, 0.1, Math.PI * 0.9);
      ctx.stroke();
      break;

    case "seahorse":
      ctx.fillStyle = "#F59E0B";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;

      // Curly body
      ctx.beginPath();
      ctx.moveTo(-6, -20);
      ctx.quadraticCurveTo(-8, -28, 0, -30);
      ctx.quadraticCurveTo(8, -30, 10, -22);
      ctx.quadraticCurveTo(4, -18, 6, -14);
      ctx.lineTo(18, -12);
      ctx.lineTo(16, -7);
      ctx.lineTo(6, -9);
      ctx.quadraticCurveTo(0, -1, -2, 10);
      ctx.quadraticCurveTo(6, 18, 4, 30);
      ctx.quadraticCurveTo(0, 38, -8, 42);
      ctx.quadraticCurveTo(-14, 44, -14, 36);
      ctx.quadraticCurveTo(-8, 30, -10, 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(4, -25, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(5, -25, 1.5, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "manta":
      ctx.fillStyle = "#6366F1";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;

      // Diamond body
      ctx.beginPath();
      ctx.moveTo(0, 32);
      ctx.lineTo(42, -2);
      ctx.lineTo(0, -26);
      ctx.lineTo(-42, -2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Horns
      ctx.beginPath();
      ctx.moveTo(-8, -26); ctx.quadraticCurveTo(-10, -38, -6, -36);
      ctx.moveTo(8, -26); ctx.quadraticCurveTo(10, -38, 6, -36);
      ctx.stroke();

      // Tail
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 32);
      ctx.lineTo(0, 48);
      ctx.stroke();
      break;

    case "penguin":
      ctx.fillStyle = "#0F172A";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;

      // Body shape
      ctx.beginPath();
      ctx.ellipse(0, 5, 20, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // White chest
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.ellipse(0, 8, 13, 19, 0, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = "#F59E0B";
      ctx.beginPath();
      ctx.moveTo(-4, -12);
      ctx.lineTo(4, -12);
      ctx.lineTo(0, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Eyes
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(-7, -18, 3, 0, Math.PI * 2);
      ctx.arc(7, -18, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(-7, -18, 1.2, 0, Math.PI * 2);
      ctx.arc(7, -18, 1.2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "sea_otter":
      ctx.fillStyle = "#78350F";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;

      // Body
      ctx.beginPath();
      ctx.ellipse(0, 5, 22, 25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Face
      ctx.fillStyle = "#F5E0C9";
      ctx.beginPath();
      ctx.ellipse(0, -6, 14, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Little clam
      ctx.fillStyle = "#FBBF24";
      ctx.beginPath();
      ctx.moveTo(-6, 15);
      ctx.lineTo(6, 15);
      ctx.lineTo(3, 22);
      ctx.lineTo(-3, 22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case "pufferfish":
      ctx.fillStyle = "#FBBF24";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;

      // Round Puffer
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Big eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(16, -6, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(17, -6, 3, 0, Math.PI * 2);
      ctx.fill();

      // Little tail
      ctx.fillStyle = "#FBBF24";
      ctx.beginPath();
      ctx.moveTo(-26, 0);
      ctx.lineTo(-36, -8);
      ctx.lineTo(-32, 0);
      ctx.lineTo(-36, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case "eel":
      ctx.fillStyle = "#166534";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;

      // Wavy eel shape
      ctx.beginPath();
      ctx.moveTo(-40, 5);
      ctx.quadraticCurveTo(-26, -8, -10, 5);
      ctx.quadraticCurveTo(6, 18, 20, 5);
      ctx.lineTo(36, 0);
      ctx.lineTo(34, 6);
      ctx.lineTo(20, 13);
      ctx.quadraticCurveTo(6, 26, -10, 13);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // head
      ctx.beginPath();
      ctx.moveTo(20, 5);
      ctx.quadraticCurveTo(33, -5, 40, 0);
      ctx.lineTo(36, 14);
      ctx.quadraticCurveTo(20, 13, 20, 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // sharp eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(30, 2, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(31, 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "shrimp":
      ctx.fillStyle = "#F472B6";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;

      // Shrimp curve body segments
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // stripes
      ctx.strokeStyle = "#EF4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, -8); ctx.lineTo(-6, 8);
      ctx.moveTo(6, -8); ctx.lineTo(6, 8);
      ctx.stroke();

      // Tail fan
      ctx.fillStyle = "#F472B6";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-26, -5);
      ctx.lineTo(-22, 1);
      ctx.lineTo(-26, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case "sunfish":
      ctx.fillStyle = "#93C5FD";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;

      // Body plate
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Big high fin
      ctx.beginPath();
      ctx.moveTo(-6, -27);
      ctx.lineTo(-8, -48);
      ctx.lineTo(6, -28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Big low fin
      ctx.beginPath();
      ctx.moveTo(-6, 27);
      ctx.lineTo(-8, 48);
      ctx.lineTo(6, 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(14, -5, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(15.5, -5, 2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "hermit_crab":
      // Beige spiral shell
      ctx.fillStyle = "#F5E0C9";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(10, 2, 18, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Crab peaking out
      ctx.fillStyle = "#D97706";
      ctx.beginPath();
      ctx.ellipse(-10, 4, 12, 6, -Math.PI / 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Claws
      ctx.beginPath();
      ctx.ellipse(-18, -4, 6, 4, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(-14, -10, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(-14, -10, 1.2, 0, Math.PI * 2);
      ctx.fill();
      break;

    default:
      // Fallback simple circle matching color
      ctx.fillStyle = color || "#0EA5E9";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
  }

  ctx.restore();
}
