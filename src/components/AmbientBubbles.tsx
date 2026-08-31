"use client";

import React, { useMemo } from "react";

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
}

export const AmbientBubbles: React.FC = () => {
  const bubbles = useMemo<Bubble[]>(() => {
    return Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 80) + 16, // 16px to 96px
      left: (i * 2.7) + (Math.random() * 2 - 1), // distributed across 0% - 100%
      duration: Math.floor(Math.random() * 14) + 8, // 8s to 22s
      delay: -(Math.random() * 15), // negative delay so screen is immediately filled with floating bubbles!
      opacity: Math.random() * 0.25 + 0.1,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="animate-bubble absolute rounded-full border border-zinc-700/40 bg-gradient-to-tr from-zinc-800/30 via-zinc-900/15 to-transparent backdrop-blur-[1px] shadow-lg shadow-black/50"
          style={
            {
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: `${b.left}%`,
              "--bubble-duration": `${b.duration}s`,
              "--bubble-delay": `${b.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};
