import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Stars, Float } from "@react-three/drei";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

const AnimatedSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere
      args={[1, 100, 200]}
      scale={2}
      ref={meshRef}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <MeshDistortMaterial
        color={hovered ? "#1DB954" : "#4A90E2"}
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

const ThreeDemo = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-[#121212] relative overflow-hidden">
      <div className="absolute top-0 left-0 p-8 z-10 w-full pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#B3B3B3] hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">Three.js Experience</h1>
          <p className="text-[#B3B3B3] max-w-xl">
            Interactive 3D rendering in the browser using WebGL. Demonstrating custom shaders,
            physics simulations, and reactive 3D environments.
          </p>
        </motion.div>
      </div>

      <Canvas className="absolute inset-0">
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
          <AnimatedSphere />
        </Float>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      <div className="absolute bottom-8 right-8 z-10 text-right pointer-events-none hidden md:block">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <p className="text-xs text-[#535353] font-mono">RENDERER: WEBGL2</p>
          <p className="text-xs text-[#535353] font-mono">FPS: 60</p>
          <p className="text-xs text-[#535353] font-mono">VERTICES: 12,402</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ThreeDemo;
