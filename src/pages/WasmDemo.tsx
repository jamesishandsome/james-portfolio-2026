import { motion } from "framer-motion";
import { ArrowLeft, Play, RefreshCw, Zap, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

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
    <div className="min-h-screen bg-[#0D0D0D] text-white font-sans p-4 sm:p-6 lg:p-8 relative overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#B3B3B3] hover:text-white mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg w-fit">
              <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                WASM vs JS Benchmark
              </h1>
              <p className="text-[#B3B3B3] text-sm sm:text-base">
                Real-time performance comparison: Fibonacci Sequence
              </p>
            </div>
          </div>
        </header>

        <div className="bg-[#1E1E1E] p-4 sm:p-6 rounded-xl border border-[#333] mb-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-6 sm:gap-8">
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label className="text-sm text-[#B3B3B3] font-mono">INPUT (N)</label>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <input
                type="range"
                min="10"
                max="45"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="flex-1 sm:flex-none sm:w-64 h-2 bg-[#333] rounded-lg appearance-none cursor-pointer accent-purple-500"
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
                  ? "bg-[#333] text-[#666] cursor-not-allowed"
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
                Run Benchmark
              </>
            )}
          </button>

          {results.wasm && results.js && (
            <div className="w-full sm:w-auto sm:ml-auto flex items-center">
              <div className="text-left sm:text-right">
                <div className="text-sm text-[#B3B3B3]">Performance Boost</div>
                <div className="text-2xl font-bold text-green-400">
                  {results.js.time > 0 ? (results.js.time / results.wasm.time).toFixed(2) : 0}x
                  FASTER
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <h3 className="font-mono font-bold text-yellow-400">JavaScript (V8)</h3>
              </div>
              {results.js && (
                <div className="font-mono text-sm text-right">
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

            <div className="bg-[#1E1E1E] rounded-xl border border-[#333] overflow-hidden">
              <div className="p-4 bg-[#111] border-b border-[#333] flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                </div>
                <span className="text-xs text-[#666] font-mono">fib.js</span>
              </div>
              <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-[#A7A7A7] overflow-x-auto">
                {JS_CODE}
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <h3 className="font-mono font-bold text-orange-500">Rust (WASM)</h3>
              </div>
              {results.wasm && (
                <div className="font-mono text-sm text-right">
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

            <div className="bg-[#1E1E1E] rounded-xl border border-[#333] overflow-hidden relative">
              <div className="p-4 bg-[#111] border-b border-[#333] flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                </div>
                <span className="text-xs text-[#666] font-mono">lib.rs</span>
              </div>
              <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-[#A7A7A7] overflow-x-auto">
                {RUST_CODE}
              </pre>

              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-mono border border-green-500/20">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  COMPILED: wasm32
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 sm:mt-12 p-4 sm:p-6 bg-[#1E1E1E] rounded-xl border border-[#333]"
        >
          <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-500" />
            How it works
          </h3>
          <p className="text-[#B3B3B3] leading-relaxed">
            This demo runs a recursive Fibonacci calculation in both JavaScript and Rust (compiled
            to WebAssembly). The calculations are performed in{" "}
            <strong>two separate Web Workers</strong> running in parallel.
            <br />
            <br />
            This means the JavaScript and WASM calculations happen <strong>
              simultaneously
            </strong>{" "}
            on different threads, truly utilizing your CPU's multi-core capabilities (if available)
            and keeping the UI completely responsive.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default WasmDemo;
