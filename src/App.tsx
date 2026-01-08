import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import WasmDemo from "./pages/WasmDemo";
import ThreeDemo from "./pages/ThreeDemo";
import D3Demo from "./pages/D3Demo";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="/wasm" element={<WasmDemo />} />
        <Route path="/three" element={<ThreeDemo />} />
        <Route path="/d3" element={<D3Demo />} />
      </Routes>
    </Router>
  );
}

export default App;
