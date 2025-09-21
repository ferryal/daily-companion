"use client";

import { useMemo, useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";

interface ParticleBackgroundProps {
  mood?: "calm" | "energetic" | "focused" | "celebratory";
  intensity?: number;
}

export function ParticleBackground({
  mood = "calm",
  intensity = 0.3,
}: ParticleBackgroundProps) {
  const [isClient, setIsClient] = useState(false);

  const moodColors = useMemo(
    () => ({
      calm: ["#E3F2FD", "#BBDEFB", "#90CAF9"],
      energetic: ["#FFE0B2", "#FFCC02", "#FF9800"],
      focused: ["#E8F5E8", "#C8E6C9", "#A5D6A7"],
      celebratory: ["#FCE4EC", "#F8BBD9", "#F48FB1", "#E1BEE7"],
    }),
    []
  );

  const particles = useMemo(() => {
    if (!isClient) return [];

    const count = Math.floor(20 * intensity);
    const colors = moodColors[mood];

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.3 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [mood, intensity, moodColors, isClient]);

  const containerSpring = useSpring({
    opacity: intensity,
    config: { tension: 120, friction: 14 },
  });

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Remove JavaScript animation loop to improve performance
  // CSS animations will handle the movement

  if (intensity === 0 || !isClient) return null;

  return (
    <animated.div
      style={containerSpring}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            animationDelay: `${particle.id * 0.1}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </animated.div>
  );
}

// Removed ParticleComponent - using CSS animations instead

export default ParticleBackground;
