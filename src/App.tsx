import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const BrowserLabs = lazy(() => import("./pages/BrowserLabs"));
const WasmDemo = lazy(() => import("./pages/WasmDemo"));
const ThreeDemo = lazy(() => import("./pages/ThreeDemo"));
const D3Demo = lazy(() => import("./pages/D3Demo"));

const PageLoader = () => (
  <div className="grid h-screen w-full place-items-center bg-[#030406] text-white">
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-5 text-center shadow-[0_0_80px_rgba(103,232,249,0.12)] backdrop-blur-xl">
      <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-cyan-200/20 border-t-cyan-200 animate-spin" />
      <div className="font-mono text-xs uppercase tracking-[0.34em] text-white/55">Opening workroom</div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/labs"
            element={
              <Layout>
                <BrowserLabs />
              </Layout>
            }
          />
          <Route path="/wasm" element={<WasmDemo />} />
          <Route path="/three" element={<ThreeDemo />} />
          <Route path="/d3" element={<D3Demo />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
