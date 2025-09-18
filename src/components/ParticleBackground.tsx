"use client";

import { useEffect, useMemo, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

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

  useEffect(() => {
    if (!isClient || particles.length === 0) return;

    const animateParticles = () => {
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x > 100) particle.x = 0;
        if (particle.x < 0) particle.x = 100;
        if (particle.y > 100) particle.y = 0;
        if (particle.y < 0) particle.y = 100;
      });
    };

    const interval = setInterval(animateParticles, 100);
    return () => clearInterval(interval);
  }, [particles, isClient]);

  if (intensity === 0 || !isClient) return null;

  return (
    <animated.div
      style={containerSpring}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {particles.map((particle) => (
        <ParticleComponent key={particle.id} particle={particle} />
      ))}
    </animated.div>
  );
}

function ParticleComponent({ particle }: { particle: Particle }) {
  const spring = useSpring({
    from: { x: particle.x, y: particle.y },
    to: { x: particle.x, y: particle.y },
    config: { tension: 280, friction: 60 },
    loop: true,
  });

  return (
    <animated.div
      style={{
        position: "absolute",
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        backgroundColor: particle.color,
        borderRadius: "50%",
        opacity: particle.opacity,
        transform: spring.x.to((x) => `translate3d(${x * 0.1}px, 0, 0)`),
      }}
    />
  );
}
