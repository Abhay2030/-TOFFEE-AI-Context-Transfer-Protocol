"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function MemoryNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { mouse, viewport } = useThree();

  const particleCount = 150;
  
  // Generate deterministic pseudo-random particles and connections
  const [positions, lines, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const lineIndices: number[] = [];

    const toffeeColor = new THREE.Color("#0ea5e9"); 
    const tealColor = new THREE.Color("#14b8a6");

    // Pseudo-random generator using sine
    const prng = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < particleCount; i++) {
      const theta = prng(i * 1.1) * Math.PI * 2;
      const phi = Math.acos(prng(i * 1.2) * 2 - 1);
      const r = 8 + prng(i * 1.3) * 4;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const mixedColor = toffeeColor.clone().lerp(tealColor, prng(i * 1.4));
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 25) { 
          lineIndices.push(i, j);
        }
      }
    }

    return [pos, new Uint16Array(lineIndices), col];
  }, [particleCount]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Gentle continuous rotation
    if (pointsRef.current && linesRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
      linesRef.current.rotation.y = time * 0.05;
      
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
      linesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    }

    // Mouse parallax
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, (mouse.x * viewport.width) / 10, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, (mouse.y * viewport.height) / 10, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  // We don't need a null check since useMemo calculates synchronously

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[lines, 1]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
