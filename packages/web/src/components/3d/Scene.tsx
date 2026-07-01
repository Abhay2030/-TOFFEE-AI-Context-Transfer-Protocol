"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, lazy } from "react";
import { Html } from "@react-three/drei";
import { Loader2 } from "lucide-react";

// Lazy load the actual 3D scene to ensure it only runs on the client
const MemoryNetwork = lazy(() => import("./MemoryNetwork"));

export function WebGLScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
      >
        <Suspense
          fallback={
            <Html center>
              <Loader2 className="w-6 h-6 text-toffee-500 animate-spin" />
            </Html>
          }
        >
          <MemoryNetwork />
        </Suspense>
      </Canvas>
    </div>
  );
}
