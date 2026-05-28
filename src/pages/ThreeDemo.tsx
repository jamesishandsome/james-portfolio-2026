import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, Html, MeshTransmissionMaterial, OrbitControls, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { ArrowLeft, Activity, Gauge, Layers3, Radar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { gsap, useGSAP } from "../lib/gsap";

const surfaceVertexShader = `
  uniform float uTime;
  uniform float uShock;
  varying float vHeight;
  varying vec2 vUv;

  float ridge(vec2 p, vec2 center, float width, float power) {
    float d = distance(p, center);
    return exp(-pow(d / width, power));
  }

  void main() {
    vUv = uv;
    vec3 transformed = position;
    vec2 p = uv * 2.0 - 1.0;

    float roll = sin((p.x * 5.2) + uTime * 0.7) * 0.18;
    float term = cos((p.y * 8.0) - uTime * 0.55) * 0.12;
    float skew = sin((p.x + p.y) * 8.0 + uTime * 0.35) * 0.08;
    float liquidityPocket = ridge(p, vec2(-0.34, 0.2), 0.28, 2.0) * 0.72;
    float stressPocket = ridge(p, vec2(0.42, -0.28), 0.22, 2.0) * (0.52 + uShock * 0.18);
    float shockWave = sin(distance(p, vec2(0.18, -0.08)) * 26.0 - uTime * 3.0) * 0.04 * uShock;

    float height = roll + term + skew + liquidityPocket - stressPocket + shockWave;
    transformed.z += height;
    vHeight = height;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const surfaceFragmentShader = `
  uniform vec3 uLowColor;
  uniform vec3 uMidColor;
  uniform vec3 uHighColor;
  varying float vHeight;
  varying vec2 vUv;

  void main() {
    float band = smoothstep(-0.45, 0.78, vHeight);
    vec3 color = mix(uLowColor, uMidColor, smoothstep(0.0, 0.55, band));
    color = mix(color, uHighColor, smoothstep(0.62, 1.0, band));

    float contour = abs(sin((vHeight + vUv.x * 0.18) * 38.0));
    color += (1.0 - smoothstep(0.0, 0.08, contour)) * 0.16;

    float edgeFade = smoothstep(0.0, 0.14, vUv.x) * smoothstep(0.0, 0.14, vUv.y) * smoothstep(0.0, 0.14, 1.0 - vUv.x) * smoothstep(0.0, 0.14, 1.0 - vUv.y);
    gl_FragColor = vec4(color, 0.82 * edgeFade);
  }
`;

const particleVertexShader = `
  uniform float uTime;
  attribute float aSize;
  attribute float aPhase;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.8 + aPhase) * 0.16;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * (220.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = 0.35 + sin(uTime + aPhase) * 0.2;
  }
`;

const particleFragmentShader = `
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    float alpha = smoothstep(0.5, 0.08, d) * vAlpha;
    vec3 color = mix(vec3(0.37, 0.91, 1.0), vec3(0.75, 0.95, 0.32), smoothstep(0.0, 0.5, d));
    gl_FragColor = vec4(color, alpha);
  }
`;

const MARKET_LOOK_AT = new THREE.Vector3(0, -0.35, 0);

const seededNoise = (index: number, salt: number) => {
  const raw = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
};

const CameraRig = () => {
  useFrame((state) => {
    const { camera, pointer } = state;
    const t = state.clock.elapsedTime;
    camera.position.set(
      THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.45 + Math.sin(t * 0.16) * 0.45, 0.035),
      THREE.MathUtils.lerp(camera.position.y, 3.0 + pointer.y * 0.35, 0.035),
      THREE.MathUtils.lerp(camera.position.z, 6.7 + Math.cos(t * 0.12) * 0.45, 0.03),
    );
    camera.lookAt(MARKET_LOOK_AT);
  });

  return null;
};

const VolatilitySurface = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uShock: { value: 1 },
      uLowColor: { value: new THREE.Color("#15203a") },
      uMidColor: { value: new THREE.Color("#5ee9ff") },
      uHighColor: { value: new THREE.Color("#d8ff4f") },
    }),
    [],
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uShock.value = 0.72 + Math.sin(state.clock.elapsedTime * 0.55) * 0.28;
  });

  return (
    <group rotation={[-Math.PI / 2.35, 0, 0.12]} position={[0, -0.75, 0]}>
      <mesh>
        <planeGeometry args={[6.4, 4.2, 168, 112]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={surfaceVertexShader}
          fragmentShader={surfaceFragmentShader}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, -0.045]}>
        <planeGeometry args={[6.5, 4.3, 24, 16]} />
        <meshBasicMaterial color="#0b1220" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
};

const DepthColumns = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const temp = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const columns = useMemo(() => {
    const items: Array<{ x: number; z: number; base: number; phase: number; hot: number }> = [];
    for (let x = -9; x <= 9; x += 1) {
      for (let z = -5; z <= 5; z += 1) {
        const dx = x / 9;
        const dz = z / 5;
        const pocket = Math.exp(-((dx - 0.36) ** 2 + (dz + 0.18) ** 2) * 5.5);
        const base = 0.16 + Math.abs(Math.sin(x * 1.7) * Math.cos(z * 1.1)) * 0.52 + pocket * 0.9;
        items.push({ x: x * 0.34, z: z * 0.32, base, phase: x * 0.47 + z * 0.31, hot: pocket });
      }
    }
    return items;
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const time = state.clock.elapsedTime;

    columns.forEach((column, index) => {
      const height = column.base + Math.sin(time * 1.2 + column.phase) * 0.08;
      temp.position.set(column.x, -1.52 + height / 2, column.z);
      temp.scale.set(1, Math.max(0.05, height), 1);
      temp.rotation.y = Math.sin(time * 0.3 + column.phase) * 0.08;
      temp.updateMatrix();
      mesh.setMatrixAt(index, temp.matrix);

      color.set(column.hot > 0.45 ? "#d8ff4f" : column.base > 0.62 ? "#67e8f9" : "#27415a");
      mesh.setColorAt(index, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, columns.length]}>
      <boxGeometry args={[0.045, 1, 0.045]} />
      <meshStandardMaterial vertexColors roughness={0.28} metalness={0.4} transparent opacity={0.78} />
    </instancedMesh>
  );
};

const FlowRibbon = ({ offset = 0, color = "#67e8f9" }: { offset?: number; color?: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    const points = Array.from({ length: 12 }, (_, index) => {
      const p = index / 11;
      return new THREE.Vector3(
        -3.2 + p * 6.4,
        -0.72 + Math.sin(p * Math.PI * 2 + offset) * 0.34,
        -1.7 + Math.cos(p * Math.PI * 2 + offset) * 0.72,
      );
    });
    return new THREE.CatmullRomCurve3(points);
  }, [offset]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.32 + offset) * 0.05;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7 + offset) * 0.08;
  });

  return (
    <mesh ref={meshRef}>
      <tubeGeometry args={[curve, 96, 0.018, 8, false]} />
      <meshBasicMaterial color={color} transparent opacity={0.62} />
    </mesh>
  );
};

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = 850;
  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      const radius = 1.6 + seededNoise(index, 1) * 4.2;
      const angle = seededNoise(index, 2) * Math.PI * 2;
      pos[index * 3] = Math.cos(angle) * radius;
      pos[index * 3 + 1] = -0.4 + (seededNoise(index, 3) - 0.5) * 2.8;
      pos[index * 3 + 2] = Math.sin(angle) * radius;
      size[index] = 0.85 + seededNoise(index, 4) * 1.8;
      phase[index] = seededNoise(index, 5) * Math.PI * 2;
    }

    return { positions: pos, sizes: size, phases: phase };
  }, []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (pointsRef.current) pointsRef.current.rotation.y = state.clock.elapsedTime * 0.035;
    if (materialRef.current) materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const GlassRiskLens = () => {
  const lensRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!lensRef.current) return;
    lensRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.18;
    lensRef.current.rotation.y = state.clock.elapsedTime * 0.22;
  });

  return (
    <mesh ref={lensRef} position={[2.15, 0.1, -0.95]} scale={[0.74, 0.74, 0.18]}>
      <icosahedronGeometry args={[1, 3]} />
      <MeshTransmissionMaterial
        backside
        samples={6}
        thickness={0.35}
        chromaticAberration={0.08}
        anisotropy={0.18}
        distortion={0.35}
        distortionScale={0.35}
        temporalDistortion={0.16}
        color="#8ff7ff"
        roughness={0.16}
        transmission={0.86}
      />
    </mesh>
  );
};

const SceneLabels = () => (
  <>
    <Html position={[-2.7, 0.95, -1.15]} transform distanceFactor={8} zIndexRange={[2, 0]} className="pointer-events-none">
      <div className="rounded-2xl border border-cyan-200/20 bg-black/45 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_30px_rgba(94,233,255,0.14)] backdrop-blur-xl">
        vol ridge / tenor drift
      </div>
    </Html>
    <Html position={[2.65, 0.85, -1.0]} transform distanceFactor={8} zIndexRange={[2, 0]} className="pointer-events-none">
      <div className="rounded-2xl border border-lime-200/20 bg-black/45 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-lime-100 shadow-[0_0_30px_rgba(216,255,79,0.14)] backdrop-blur-xl">
        stress pocket detected
      </div>
    </Html>
  </>
);

const MarketSurfaceScene = () => (
  <>
    <color attach="background" args={["#02040a"]} />
    <fog attach="fog" args={["#03060d", 5, 13]} />
    <CameraRig />
    <ambientLight intensity={0.28} />
    <directionalLight position={[4, 6, 5]} intensity={1.4} color="#dff9ff" />
    <pointLight position={[-3, 1.8, 2.6]} intensity={3.2} color="#67e8f9" />
    <pointLight position={[2.8, 1.1, -2.2]} intensity={2.2} color="#d8ff4f" />
    <Stars radius={80} depth={42} count={3200} factor={4} saturation={0} fade speed={0.35} />
    <ParticleField />
    <Grid
      position={[0, -1.58, 0]}
      args={[8, 8]}
      cellSize={0.38}
      cellThickness={0.42}
      cellColor="#174051"
      sectionSize={1.52}
      sectionThickness={0.9}
      sectionColor="#4de7ff"
      fadeDistance={7}
      fadeStrength={1.25}
    />
    <DepthColumns />
    <VolatilitySurface />
    <FlowRibbon offset={0} color="#67e8f9" />
    <FlowRibbon offset={1.75} color="#d8ff4f" />
    <FlowRibbon offset={3.3} color="#ff67d8" />
    <GlassRiskLens />
    <SceneLabels />
    <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.08} rotateSpeed={0.35} maxPolarAngle={Math.PI / 2.05} minPolarAngle={Math.PI / 3.2} />
  </>
);

const ThreeDemo = () => {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".three-copy > *",
        { autoAlpha: 0, y: -24, filter: "blur(10px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.09, duration: 0.78 },
      )
        .fromTo(
          ".hud-card",
          { autoAlpha: 0, x: 24, filter: "blur(8px)" },
          { autoAlpha: 1, x: 0, filter: "blur(0px)", stagger: 0.08, duration: 0.7 },
          "-=0.42",
        )
        .fromTo(".metric-strip", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.5 }, "-=0.34");

      gsap.to(".three-aurora-a", { xPercent: 8, yPercent: -6, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".three-aurora-b", { xPercent: -7, yPercent: 5, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".hud-line", { scaleX: 1, transformOrigin: "0% 50%", duration: 1.6, stagger: 0.16, ease: "power2.inOut", repeat: -1, yoyo: true });
      gsap.to(".scanner-dot", { xPercent: 260, duration: 2.2, repeat: -1, ease: "none", stagger: 0.18 });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="relative h-screen w-full overflow-hidden bg-[#02040a] text-white">
      <div className="three-aurora-a pointer-events-none absolute -left-36 top-20 z-0 h-[30rem] w-[30rem] rounded-full bg-cyan-400/18 blur-3xl" />
      <div className="three-aurora-b pointer-events-none absolute -bottom-44 right-10 z-0 h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/14 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_62%_54%,transparent_0_36%,rgba(2,4,10,0.35)_64%,rgba(2,4,10,0.72)_100%)]" />

      <div className="three-copy pointer-events-none absolute left-0 top-0 z-10 w-full p-6 sm:p-8">
        <button
          onClick={() => navigate("/")}
          className="pointer-events-auto mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/62 backdrop-blur-xl transition-colors hover:border-cyan-300/35 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Back home
        </button>

        <div className="max-w-3xl rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="font-mono text-xs uppercase tracking-[0.34em] text-cyan-200/80">react three fiber / market microstructure lab</div>
          <h1 className="mt-2 max-w-3xl text-4xl font-black tracking-tight text-white md:text-6xl">Liquidity surface with live depth, shock pockets, and shader contours.</h1>
          <p className="mt-3 max-w-2xl text-white/62">
            A heavier R3F scene for finance UI interviews: custom shaders, instanced depth bars, point-cloud flow, glass risk lens, and camera rigging around a readable market surface.
          </p>
          <button
            onClick={() => navigate("/labs#liquidity-surface")}
            className="pointer-events-auto mt-4 rounded-full border border-cyan-200/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition-colors hover:border-cyan-200/45"
          >
            Read the finance case study
          </button>
        </div>

        <div className="mt-5 grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-4">
          {[
            [Layers3, "Shader surface", "GLSL displacement, contour bands, and transparent depth composition."],
            [Activity, "Instanced depth", "209 animated columns without 209 React mesh nodes."],
            [Radar, "Signal field", "Point-cloud liquidity particles and moving route ribbons."],
            [Gauge, "Finance fit", "Surface shape, stress pockets, and depth are visible without turning into a toy."],
          ].map(([Icon, label, copy]) => {
            const IconComp = Icon as typeof Layers3;
            return (
              <div key={label as string} className="hud-card rounded-[1.5rem] border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
                <IconComp className="h-4 w-4 text-cyan-200" />
                <div className="mt-3 font-mono text-xs uppercase tracking-[0.24em] text-cyan-200/70">{label as string}</div>
                <p className="mt-2 text-sm leading-6 text-white/58">{copy as string}</p>
              </div>
            );
          })}
        </div>
      </div>

      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 3.1, 6.9], fov: 46, near: 0.1, far: 80 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <MarketSurfaceScene />
      </Canvas>

      <div className="absolute bottom-8 right-8 z-10 hidden w-80 space-y-3 text-right md:block">
        {[
          ["GEOMETRY", "SURFACE 18K VERTS"],
          ["INSTANCING", "209 DEPTH BARS"],
          ["SHADER", "2 GLSL PROGRAMS"],
          ["TARGET", "RESPONSIVE R3F"],
        ].map(([label, value]) => (
          <div key={label} className="metric-strip hud-card overflow-hidden rounded-2xl border border-white/10 bg-black/34 p-3 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-[0.22em] text-white/42">
              <span>{label}</span>
              <span className="text-cyan-200">{value}</span>
            </div>
            <div className="relative mt-2 h-px overflow-hidden rounded-full bg-white/10">
              <div className="hud-line h-full w-full scale-x-0 bg-gradient-to-r from-cyan-300 to-lime-300" />
              <span className="scanner-dot absolute left-0 top-1/2 h-2 w-10 -translate-y-1/2 rounded-full bg-cyan-200/80 blur-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreeDemo;
