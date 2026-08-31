"use client";

import React, { useMemo } from "react";

interface Node {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
}

export const AmbientBackground: React.FC = () => {
  const nodes = useMemo<Node[]>(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 60) + 30, // 30px to 90px
      left: (i * 12) + (Math.random() * 4),
      duration: Math.floor(Math.random() * 10) + 14, // 14s to 24s
      delay: -(Math.random() * 10),
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden bg-zinc-950">
      {/* 60fps Lightweight GPU-Accelerated Ambient Aurora Gradients */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 15%, rgba(39, 39, 42, 0.4) 0%, transparent 45%),
            radial-gradient(circle at 85% 65%, rgba(24, 24, 27, 0.5) 0%, transparent 50%)
          `
        }}
      />

      {/* Lightweight Floating Nodes with Hardware Acceleration */}
      {nodes.map((n) => (
        <div
          key={n.id}
          className="animate-bubble absolute rounded-full border border-zinc-800/40 bg-zinc-900/20 shadow-lg shadow-black/60 [will-change:transform]"
          style={
            {
              width: `${n.size}px`,
              height: `${n.size}px`,
              left: `${n.left}%`,
              "--bubble-duration": `${n.duration}s`,
              "--bubble-delay": `${n.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};
