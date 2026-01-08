import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { skills } from "../data/resume";

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  radius: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number;
}

const D3Demo = () => {
  const navigate = useNavigate();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const initGraph = () => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Prepare data
    const nodes: Node[] = [
      { id: "James Hu", group: 0, radius: 40 },
      ...skills.frontend.map((s) => ({ id: s, group: 1, radius: 20 })),
      ...skills.backend.map((s) => ({ id: s, group: 2, radius: 20 })),
      ...skills.database.map((s) => ({ id: s, group: 3, radius: 15 })),
      ...skills.cloud.map((s) => ({ id: s, group: 4, radius: 15 })),
    ];

    const links: Link[] = [
      ...skills.frontend.map((s) => ({ source: "James Hu", target: s, value: 1 })),
      ...skills.backend.map((s) => ({ source: "James Hu", target: s, value: 1 })),
      ...skills.database.map((s) => ({ source: "James Hu", target: s, value: 1 })),
      ...skills.cloud.map((s) => ({ source: "James Hu", target: s, value: 1 })),
      // Add some inter-connections for fun
      { source: "React", target: "TypeScript", value: 2 },
      { source: "Node.js", target: "TypeScript", value: 2 },
      { source: "Node.js", target: "MongoDB", value: 2 },
      { source: "Python (Django, Flask, FastAPI)", target: "PostgreSQL", value: 2 },
      { source: "AWS", target: "Docker", value: 2 },
      { source: "Kubernetes", target: "Docker", value: 2 },
    ];

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("background-color", "#121212");

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(links)
          .id((d) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide<Node>().radius((d) => d.radius + 10),
      );

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll<SVGLineElement, Link>("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value) * 2);

    const node = svg
      .append("g")
      .selectAll<SVGCircleElement, Node>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => {
        const colors = ["#ffffff", "#61dafb", "#3C873A", "#4DB33D", "#FF9900"];
        return colors[d.group] || "#1DB954";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .call(drag(simulation));

    const label = svg
      .append("g")
      .selectAll<SVGTextElement, Node>("text")
      .data(nodes)
      .join("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => d.radius + 15)
      .attr("fill", "#B3B3B3")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as Node).x ?? 0)
        .attr("y1", (d) => (d.source as Node).y ?? 0)
        .attr("x2", (d) => (d.target as Node).x ?? 0)
        .attr("y2", (d) => (d.target as Node).y ?? 0);

      node.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);

      label.attr("x", (d) => d.x ?? 0).attr("y", (d) => d.y ?? 0);
    });

    function drag(simulation: d3.Simulation<Node, undefined>) {
      function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag<SVGCircleElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  };

  useEffect(() => {
    initGraph();
    window.addEventListener("resize", initGraph);
    return () => window.removeEventListener("resize", initGraph);
  }, []);

  return (
    <div className="h-screen w-full bg-[#121212] flex flex-col relative overflow-hidden">
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

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">D3.js Visualization</h1>
          <p className="text-[#B3B3B3] max-w-xl">
            Interactive force-directed graph visualizing my technical skill network. Nodes represent
            technologies and links represent proficiency relationships.
          </p>
        </motion.div>
      </div>

      <div ref={containerRef} className="flex-1 w-full h-full">
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>
      </div>

      <button
        onClick={initGraph}
        className="absolute bottom-8 right-8 bg-[#1DB954] text-black p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-10"
        title="Reset Simulation"
      >
        <RefreshCw className="w-6 h-6" />
      </button>
    </div>
  );
};

export default D3Demo;
