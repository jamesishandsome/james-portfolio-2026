import { motion } from "framer-motion";
import { ArrowLeft, Cpu, Database, Activity, Server } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const WasmDemo = () => {
  const navigate = useNavigate();
  const [memory, setMemory] = useState<number[]>(new Array(50).fill(0));
  const [cpu, setCpu] = useState<number[]>(new Array(50).fill(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setMemory((prev) => [...prev.slice(1), Math.random() * 100]);
      setCpu((prev) => [...prev.slice(1), Math.random() * 100]);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#00ff00] font-mono p-8 relative overflow-y-auto">
      {/* Matrix background effect overlay */}
      <div className="fixed inset-0 bg-[url('https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif')] opacity-5 pointer-events-none bg-cover"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#00ff00] hover:text-white mb-8 transition-colors border border-[#00ff00] px-4 py-2 rounded hover:bg-[#00ff00]/20"
        >
          <ArrowLeft className="w-5 h-5" />
          SYSTEM_EXIT
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-[#00ff00]/30 pb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-2 glitch-effect">WASM_RUNTIME_ENV</h1>
            <p className="text-[#00cc00] max-w-xl text-sm">
              &gt; INITIALIZING HIGH-PERFORMANCE MODULES...
              <br />
              &gt; OPTIMIZING MEMORY ALLOCATION...
              <br />
              &gt; RUST COMPILER TARGET: WASM32-UNKNOWN-UNKNOWN
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-xs text-[#00ff00]/70">STATUS</div>
            <div className="text-xl font-bold animate-pulse">ONLINE</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card icon={<Cpu />} title="CPU THREADS" value="8" sub="ACTIVE" />
          <Card icon={<Database />} title="HEAP MEMORY" value="4096" sub="MB ALLOCATED" />
          <Card icon={<Activity />} title="OPS/SEC" value="2.4M" sub="BENCHMARK" />
          <Card icon={<Server />} title="LATENCY" value="0.2ms" sub="AVERAGE" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-[#00ff00]/30 p-4 bg-black/50 backdrop-blur-sm rounded">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> MEMORY_HEAP_VISUALIZATION
            </h3>
            <div className="flex items-end gap-1 h-64 w-full">
              {memory.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[#00ff00]/50 hover:bg-[#00ff00] transition-colors"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          <div className="border border-[#00ff00]/30 p-4 bg-black/50 backdrop-blur-sm rounded">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> THREAD_UTILIZATION
            </h3>
            <div className="flex items-end gap-1 h-64 w-full">
              {cpu.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[#00ff00]/50 hover:bg-[#00ff00] transition-colors"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border border-[#00ff00]/30 p-6 bg-black/50 backdrop-blur-sm rounded">
          <h3 className="text-lg font-bold mb-4 border-b border-[#00ff00]/30 pb-2">RUNTIME_LOGS</h3>
          <div className="font-mono text-xs text-[#00cc00] h-32 overflow-hidden flex flex-col justify-end">
            <p>[10:42:01] WASM module instantiated successfully</p>
            <p>[10:42:01] Memory buffer resized to 256 pages</p>
            <p>[10:42:02] SIMD instructions enabled</p>
            <p>[10:42:02] Thread pool initialized with 8 workers</p>
            <p className="animate-pulse">&gt; _</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ icon, title, value, sub }: any) => (
  <div className="border border-[#00ff00]/30 p-6 bg-black/50 backdrop-blur-sm rounded hover:bg-[#00ff00]/10 transition-colors group cursor-crosshair">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-[#00ff00]/10 rounded group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="w-2 h-2 bg-[#00ff00] rounded-full animate-ping"></div>
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-xs text-[#00ff00]/70">{title}</div>
    <div className="text-[10px] text-[#00ff00]/50 mt-1">{sub}</div>
  </div>
);

export default WasmDemo;
