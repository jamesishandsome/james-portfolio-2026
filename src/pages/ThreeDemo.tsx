import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls, Sphere, Stars } from "@react-three/drei";
import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { gsap, useGSAP } from "../lib/gsap";

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
        color={hovered ? "#baff4f" : "#5ee9ff"}
        attach="material"
        distort={hovered ? 0.78 : 0.5}
        speed={hovered ? 3 : 2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

const ThreeDemo = () => {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(".three-copy > *", { autoAlpha: 0, y: -24, filter: "blur(10px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.09, duration: 0.78 })
        .fromTo(".hud-card", { autoAlpha: 0, x: 24, filter: "blur(8px)" }, { autoAlpha: 1, x: 0, filter: "blur(0px)", stagger: 0.08, duration: 0.7 }, "-=0.42");

      gsap.to(".three-aurora-a", { xPercent: 8, yPercent: -6, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".three-aurora-b", { xPercent: -7, yPercent: 5, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".hud-line", { scaleX: 1, transformOrigin: "0% 50%", duration: 1.6, stagger: 0.16, ease: "power2.inOut", repeat: -1, yoyo: true });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="relative h-screen w-full overflow-hidden bg-[#03060d] text-white">
      <div className="three-aurora-a pointer-events-none absolute -left-36 top-20 z-0 h-[30rem] w-[30rem] rounded-full bg-cyan-400/18 blur-3xl" />
      <div className="three-aurora-b pointer-events-none absolute -bottom-44 right-10 z-0 h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/14 blur-3xl" />
      <div className="three-copy pointer-events-none absolute left-0 top-0 z-10 w-full p-6 sm:p-8">
        <button
          onClick={() => navigate("/")}
          className="pointer-events-auto mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/62 backdrop-blur-xl transition-colors hover:border-cyan-300/35 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Back home
        </button>

        <div className="max-w-3xl rounded-[2rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
          <div className="font-mono text-xs uppercase tracking-[0.34em] text-cyan-200/80">webgl sketch</div>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white md:text-6xl">A market surface, not a toy scene</h1>
          <p className="mt-3 max-w-xl text-white/62">
            This is the kind of 3D layer that can help explain curves, depth, and shape in a finance product without overwhelming the user.
          </p>
          <button
            onClick={() => navigate("/labs#liquidity-surface")}
            className="pointer-events-auto mt-4 rounded-full border border-cyan-200/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition-colors hover:border-cyan-200/45"
          >
            Read the finance case study
          </button>
        </div>

        <div className="mt-6 grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-3">
          {[
            ["Hiring signal", "I know how to keep 3D readable instead of decorative."],
            ["Finance fit", "Useful for market surfaces, depth maps, and analytical overlays."],
            ["Frontend proof", "Camera control, responsive rendering, and motion discipline."],
          ].map(([label, copy]) => (
            <div key={label} className="hud-card rounded-[1.5rem] border border-white/10 bg-black/28 p-4 backdrop-blur-xl">
              <div className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/70">{label}</div>
              <p className="mt-2 text-sm leading-6 text-white/58">{copy}</p>
            </div>
          ))}
        </div>
      </div>

      <Canvas className="absolute inset-0">
        <ambientLight intensity={0.55} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-6, -4, 6]} intensity={1.5} color="#67e8f9" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
          <AnimatedSphere />
        </Float>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      <div className="absolute bottom-8 right-8 z-10 hidden w-72 space-y-3 text-right md:block">
        {[
          ["RENDERER", "WEBGL2"],
          ["TARGET", "60 FPS"],
          ["VERTICES", "12,402"],
        ].map(([label, value]) => (
          <div key={label} className="hud-card rounded-2xl border border-white/10 bg-black/28 p-3 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-[0.22em] text-white/42">
              <span>{label}</span>
              <span className="text-cyan-200">{value}</span>
            </div>
            <div className="mt-2 h-px overflow-hidden rounded-full bg-white/10">
              <div className="hud-line h-full w-full scale-x-0 bg-gradient-to-r from-cyan-300 to-lime-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreeDemo;
