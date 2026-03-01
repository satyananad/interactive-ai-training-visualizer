"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { memo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

function Cube() {
  const meshRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.22;
    meshRef.current.rotation.y += delta * 0.36;
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[0.4, 0.75, 0.15]}
      scale={isHovered ? 1.08 : 1}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <boxGeometry args={[1.4, 1.4, 1.4]} />
      <meshStandardMaterial
        color="#06b6d4"
        emissive={isHovered ? "#67e8f9" : "#22d3ee"}
        emissiveIntensity={isHovered ? 1.1 : 0.75}
        metalness={0.5}
        roughness={0.22}
      />
    </mesh>
  );
}

function ThreeDModelComponent() {
  return (
    <motion.div
      className="glass-panel neon-border h-80 p-3"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
        <span className="font-semibold">3D Model</span>
        <span className="text-slate-400">Drag to rotate</span>
      </div>
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [3, 2.8, 4], fov: 52 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.46} />
        <pointLight position={[5, 5, 5]} intensity={1.05} color="#a855f7" />
        <pointLight position={[-4, -2, 3]} intensity={0.4} color="#22d3ee" />
        <Cube />
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={2.5}
          maxDistance={8}
        />
      </Canvas>
    </motion.div>
  );
}

export const ThreeDModel = memo(ThreeDModelComponent);
