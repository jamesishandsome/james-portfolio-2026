import { ArrowLeft, Play, RefreshCw, Zap, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";

const JS_CODE = `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`;

const RUST_CODE = `#[no_mangle]
pub extern "C" fn fib(n: i32) -> i32 {
    if n <= 1 {
        return n;
    }
    fib(n - 1) + fib(n - 2)
}`;

const WasmDemo = () => {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const jsWorkerRef = useRef<Worker | null>(null);
  const wasmWorkerRef = useRef<Worker | null>(null);
  const activeTasks = useRef(0);

  const [isWasmReady, setIsWasmReady] = useState(false);
  const [n, setN] = useState(35);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    js: { time: number; result: number } | null;
    wasm: { time: number; result: number } | null;
  }>({ js: null, wasm: null });

  useGSAP(
    () => {
      gsap.fromTo(
        ".wasm-reveal",
        { autoAlpha: 0, y: 28, filter: "blur(12px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.78, stagger: 0.08 },
      );
      gsap.to(".wasm-aurora-a", {
        xPercent: 8,
        yPercent: -4,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".wasm-aurora-b", {
        xPercent: -6,
        yPercent: 6,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (!results.js || !results.wasm) return;
      gsap.fromTo(
        ".result-chip, .boost-readout",
        { autoAlpha: 0, y: 14, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.58, stagger: 0.08, ease: "back.out(1.7)" },
      );
    },
    { dependencies: [results.js, results.wasm], scope: rootRef },
  );

  useEffect(() => {
    // Initialize Web Workers
    jsWorkerRef.current = new Worker(new URL("../workers/fib.worker.ts", import.meta.url), {
      type: "module",
    });

    wasmWorkerRef.current = new Worker(new URL("../workers/fib.worker.ts", import.meta.url), {
      type: "module",
    });

    // JS Worker Handler
    jsWorkerRef.current.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === "JS_RESULT") {
        setResults((prev) => ({ ...prev, js: payload }));
        activeTasks.current = Math.max(0, activeTasks.current - 1);
        if (activeTasks.current === 0) setIsRunning(false);
      }
    };

    // WASM Worker Handler
    wasmWorkerRef.current.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === "WASM_LOADED") {
        setIsWasmReady(true);
      } else if (type === "WASM_RESULT") {
        setResults((prev) => ({ ...prev, wasm: payload }));
        activeTasks.current = Math.max(0, activeTasks.current - 1);
        if (activeTasks.current === 0) setIsRunning(false);
      } else if (type === "ERROR") {
        console.error("WASM Worker error:", payload);
        activeTasks.current = Math.max(0, activeTasks.current - 1);
        if (activeTasks.current === 0) setIsRunning(false);
      }
    };

    // Trigger WASM initialization only in WASM worker
    wasmWorkerRef.current.postMessage({ type: "INIT" });

    return () => {
      jsWorkerRef.current?.terminate();
      wasmWorkerRef.current?.terminate();
    };
  }, []);

  const runBenchmark = () => {
    if (!isWasmReady || !jsWorkerRef.current || !wasmWorkerRef.current) return;

    setIsRunning(true);
    setResults({ js: null, wasm: null });
    activeTasks.current = 2;

    // Launch both tasks in parallel (separate workers)
    jsWorkerRef.current.postMessage({ type: "RUN_JS", payload: n });
    wasmWorkerRef.current.postMessage({ type: "RUN_WASM", payload: n });
  };

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-y-auto bg-[#04070d] p-4 text-white sm:p-6 lg:p-8">
      <div className="wasm-aurora-a pointer-events-none absolute -left-36 top-14 h-[30rem] w-[30rem] rounded-full bg-orange-500/14 blur-3xl" />
      <div className="wasm-aurora-b pointer-events-none absolute -bottom-44 right-0 h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/12 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <button
          onClick={() => navigate("/")}
          className="wasm-reveal mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/62 backdrop-blur-xl transition-colors hover:border-orange-300/35 hover:text-white sm:mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back home
        </button>

        <header className="wasm-reveal mb-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:mb-12 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="w-fit rounded-2xl border border-orange-300/20 bg-orange-400/10 p-3 text-orange-200">
              <Zap className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.34em] text-orange-200/80">
                browser compute bench
              </div>
              <h1 className="mt-2 bg-gradient-to-r from-orange-200 via-white to-pink-300 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl lg:text-6xl">
                WASM versus JS, measured here
              </h1>
              <p className="mt-2 text-sm text-white/62 sm:text-base">
                Same Fibonacci input, two workers, measured in this tab.
              </p>
            </div>
          </div>
        </header>

        <div className="wasm-reveal mb-8 flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-[#0b0f18]/86 p-4 backdrop-blur-xl sm:flex-row sm:flex-wrap sm:items-center sm:gap-8 sm:p-6">
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label className="text-sm text-[#B3B3B3] font-mono">FIB INPUT</label>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <input
                type="range"
                min="10"
                max="45"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-white/10 accent-orange-400 sm:w-64 sm:flex-none"
              />
              <span className="text-2xl font-mono font-bold w-12 text-center">{n}</span>
            </div>
          </div>

          <button
            onClick={runBenchmark}
            disabled={isRunning || !isWasmReady}
            className={`
              w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-full font-bold transition-all
              ${
                isRunning || !isWasmReady
                  ? "bg-white/10 text-white/35 cursor-not-allowed"
                  : "bg-white text-black hover:scale-105 active:scale-95"
              }
            `}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run it
              </>
            )}
          </button>

          {results.wasm && results.js && (
            <div className="boost-readout flex w-full items-center sm:ml-auto sm:w-auto">
              <div className="text-left sm:text-right">
                <div className="text-sm text-[#B3B3B3]">WASM over JS</div>
                <div className="text-2xl font-black text-lime-300">
                  {results.js.time > 0 ? (results.js.time / results.wasm.time).toFixed(2) : 0}x
                  FASTER
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="wasm-reveal space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <h3 className="font-mono font-bold text-yellow-400">JavaScript (V8)</h3>
              </div>
              {results.js && (
                <div className="result-chip text-right font-mono text-sm">
                  <div className="text-[#B3B3B3] text-xs">
                    Result: <span className="text-white">{results.js.result.toLocaleString()}</span>
                  </div>
                  <div>
                    Time:{" "}
                    <span className="text-white font-bold">{results.js.time.toFixed(2)}ms</span>
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0f18]/86 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <div className="flex items-center justify-between border-b border-white/10 bg-black/30 p-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                </div>
                <span className="text-xs text-[#666] font-mono">fib.js</span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs text-white/62 sm:p-6 sm:text-sm">
                {JS_CODE}
              </pre>
            </div>
          </div>

          <div className="wasm-reveal space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <h3 className="font-mono font-bold text-orange-500">Rust (WASM)</h3>
              </div>
              {results.wasm && (
                <div className="result-chip text-right font-mono text-sm">
                  <div className="text-[#B3B3B3] text-xs">
                    Result:{" "}
                    <span className="text-white">{results.wasm.result.toLocaleString()}</span>
                  </div>
                  <div>
                    Time:{" "}
                    <span className="text-white font-bold">{results.wasm.time.toFixed(2)}ms</span>
                  </div>
                </div>
              )}
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0f18]/86 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <div className="flex items-center justify-between border-b border-white/10 bg-black/30 p-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                </div>
                <span className="text-xs text-[#666] font-mono">lib.rs</span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs text-white/62 sm:p-6 sm:text-sm">
                {RUST_CODE}
              </pre>

              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <div className="flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 font-mono text-xs text-lime-300">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-lime-300"></div>
                  COMPILED: wasm32
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="wasm-reveal mt-10 rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl sm:mt-12 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-500" />
            What is actually happening
          </h3>
          <p className="text-[#B3B3B3] leading-relaxed">
            The page sends the same recursive Fibonacci job to JavaScript and to Rust compiled to
            WebAssembly. Each one runs in its own <strong>Web Worker</strong>, so the UI stays
            usable while the numbers grind away.
            <br />
            <br />
            The point is not to crown a permanent winner. It is a quick way to see how browser
            compute behaves on the machine in front of you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WasmDemo;
