"use client";

import { useRef, ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  disableTilt?: boolean;
}

export function GlassCard({ children, className, disableTilt = false }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Mouse position for Glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Mouse position for Tilt (normalized between -1 and 1)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for the tilt
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Transform constraints (max rotation 8deg)
  const rotateX = useTransform(mouseYSpring, [-1, 1], [8, -8]);
  const rotateY = useTransform(mouseXSpring, [-1, 1], [-8, 8]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // For glow
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    
    // For tilt
    if (!disableTilt) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) / (rect.width / 2));
      y.set((e.clientY - centerY) / (rect.height / 2));
    }
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: disableTilt ? 0 : rotateX,
        rotateY: disableTilt ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative rounded-2xl border border-navy-800/50 bg-navy-900/50 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-navy-700/80 hover:shadow-toffee-500/10",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 overflow-hidden"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              450px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 overflow-hidden"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              800px circle at ${mouseX}px ${mouseY}px,
              rgba(20, 184, 166, 0.08),
              transparent 80%
            )
          `,
        }}
      />
      <div 
        className="relative z-10"
        style={{ transform: disableTilt ? "none" : "translateZ(30px)" }}
      >
        {children}
      </div>
    </motion.div>
  );
}
