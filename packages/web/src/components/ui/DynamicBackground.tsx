"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function DynamicBackground() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-50] overflow-hidden pointer-events-none select-none">
      {/* Background Base - Automatically adapts based on globals.css --color-navy-950 */}
      <div className="absolute inset-0 bg-navy-950 transition-colors duration-700" />
      
      {/* Glowing Orbs */}
      <div className="absolute inset-0 opacity-40 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen transition-opacity duration-700">
        
        {/* Orb 1: Toffee Blue (Top Right) */}
        <motion.div
          animate={{
            x: [0, -100, 50, 0],
            y: [0, 50, -100, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-toffee-500/50 blur-[100px] lg:blur-[140px]"
        />
        
        {/* Orb 2: Electric Violet (Bottom Left) */}
        <motion.div
          animate={{
            x: [0, 150, -50, 0],
            y: [0, -150, 50, 0],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-accent-violet/40 blur-[120px] lg:blur-[160px]"
        />

        {/* Orb 3: Teal Accent (Center/Right) */}
        <motion.div
          animate={{
            x: [0, -50, 100, 0],
            y: [0, 100, -50, 0],
            scale: [0.8, 1, 1.2, 0.8],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-accent-teal/30 blur-[100px] lg:blur-[150px]"
        />
      </div>

      {/* A subtle grid overlay for a "futuristic protocol" aesthetic */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-navy-500) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-navy-500) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      />
    </div>
  );
}
