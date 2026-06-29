import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const BrowserLabs = lazy(() => import("./pages/BrowserLabs"));
const WasmDemo = lazy(() => import("./pages/WasmDemo"));
const ThreeDemo = lazy(() => import("./pages/ThreeDemo"));
const D3Demo = lazy(() => import("./pages/D3Demo"));

const pageMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "James Hu - Financial Frontend & Full-stack Developer",
    description:
      "James Hu is a full-stack developer in Hong Kong working on React, TypeScript, Python, financial frontends, and data-heavy internal tools.",
  },
  "/labs": {
    title: "Browser Labs - Finance Frontend Case Studies",
    description:
      "Small browser case studies around market screens, risk views, Python data pipeline monitors, replay tools, and audit flows.",
  },
  "/wasm": {
    title: "WASM Pricing Worker - James Hu",
    description:
      "A browser compute demo for pricing and scenario checks without blocking the UI.",
  },
  "/three": {
    title: "3D Liquidity Surface - James Hu",
    description:
      "A WebGL demo for market surfaces, liquidity views, and readable 3D financial charts.",
  },
  "/d3": {
    title: "Risk Dependency Graph - James Hu",
    description:
      "A D3 visualization for dependency mapping, risk topology, and line-of-business data relationships.",
  },
};

const AppShell = () => {
  const location = useLocation();

  useEffect(() => {
    const meta = pageMeta[location.pathname] ?? pageMeta["/"];
    document.title = meta.title;

    const descriptionEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (descriptionEl) descriptionEl.content = meta.description;

    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = meta.title;

    const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = meta.description;
  }, [location.pathname]);

  return (
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
  );
};

const PageLoader = () => (
  <div className="grid h-screen w-full place-items-center bg-[#030406] text-white">
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-5 text-center shadow-[0_0_80px_rgba(103,232,249,0.12)] backdrop-blur-xl">
      <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-cyan-200/20 border-t-cyan-200 animate-spin" />
      <div className="font-mono text-xs uppercase tracking-[0.34em] text-white/55">Loading site</div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
