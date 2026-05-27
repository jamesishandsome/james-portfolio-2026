import { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { skills } from "../data/resume";
import { gsap, useGSAP } from "../lib/gsap";

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
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<Node, undefined> | null>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".demo-chrome > *",
        { autoAlpha: 0, y: -22, filter: "blur(10px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.78, stagger: 0.08 },
      );
      gsap.fromTo(
        ".reset-button",
        { autoAlpha: 0, scale: 0.72, rotate: -90 },
        { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.8, ease: "back.out(1.8)", delay: 0.45 },
      );
      gsap.to(".demo-aurora", {
        xPercent: 8,
        yPercent: -5,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: rootRef },
  );

  const initGraph = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    simulationRef.current?.stop();
    d3.select(svgRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const nodes: Node[] = [
      { id: "James Hu", group: 0, radius: 42 },
      ...skills.frontend.map((s) => ({ id: s, group: 1, radius: 20 })),
      ...skills.backend.map((s) => ({ id: s, group: 2, radius: 20 })),
      ...skills.database.map((s) => ({ id: s, group: 3, radius: 16 })),
      ...skills.cloud.map((s) => ({ id: s, group: 4, radius: 16 })),
      ...skills.data.map((s) => ({ id: s, group: 5, radius: 17 })),
    ];

    const links: Link[] = [
      ...skills.frontend.map((s) => ({ source: "James Hu", target: s, value: 1 })),
      ...skills.backend.map((s) => ({ source: "James Hu", target: s, value: 1 })),
      ...skills.database.map((s) => ({ source: "James Hu", target: s, value: 1 })),
      ...skills.cloud.map((s) => ({ source: "James Hu", target: s, value: 1 })),
      ...skills.data.map((s) => ({ source: "James Hu", target: s, value: 1 })),
      { source: "React", target: "TypeScript", value: 2 },
      { source: "Node.js", target: "TypeScript", value: 2 },
      { source: "Node.js", target: "MongoDB", value: 2 },
      { source: "Python (FastAPI, Django, Flask)", target: "PostgreSQL", value: 2 },
      { source: "Python (FastAPI, Django, Flask)", target: "Pandas / Polars", value: 2 },
      { source: "Pandas / Polars", target: "ETL pipelines", value: 2 },
      { source: "ETL pipelines", target: "PostgreSQL", value: 2 },
      { source: "Reconciliation jobs", target: "Redis", value: 1.6 },
      { source: "AWS", target: "Docker", value: 2 },
      { source: "Kubernetes", target: "Docker", value: 2 },
    ];

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("background", "transparent");

    const defs = svg.append("defs");
    const glow = defs.append("filter").attr("id", "node-glow").attr("x", "-80%").attr("y", "-80%").attr("width", "260%").attr("height", "260%");
    glow.append("feGaussianBlur").attr("stdDeviation", "5").attr("result", "coloredBlur");
    const merge = glow.append("feMerge");
    merge.append("feMergeNode").attr("in", "coloredBlur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(links)
          .id((d) => d.id)
          .distance(112),
      )
      .force("charge", d3.forceManyBody().strength(-330))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide<Node>().radius((d) => d.radius + 12),
      );
    simulationRef.current = simulation;

    const link = svg
      .append("g")
      .attr("stroke", "#7dd3fc")
      .attr("stroke-opacity", 0.42)
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
        const colors = ["#ffffff", "#67e8f9", "#f7d45a", "#7cff70", "#ff67d8", "#8fffd2"];
        return colors[d.group] || "#67e8f9";
      })
      .attr("stroke", "rgba(255,255,255,0.8)")
      .attr("stroke-width", 1.5)
      .attr("filter", "url(#node-glow)")
      .call(drag(simulation));

    const label = svg
      .append("g")
      .selectAll<SVGTextElement, Node>("text")
      .data(nodes)
      .join("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => d.radius + 18)
      .attr("fill", "rgba(255,255,255,0.68)")
      .style("font-size", "12px")
      .style("font-family", "JetBrains Mono, monospace")
      .style("pointer-events", "none");

    gsap.fromTo(
      link.nodes(),
      { autoAlpha: 0, scaleX: 0, transformOrigin: "50% 50%" },
      { autoAlpha: 1, scaleX: 1, duration: 0.8, stagger: 0.015, ease: "power2.out" },
    );
    gsap.fromTo(
      node.nodes(),
      { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" },
      { autoAlpha: 1, scale: 1, duration: 1.1, stagger: { amount: 0.8, from: "center" }, ease: "elastic.out(1, 0.55)" },
    );
    gsap.fromTo(
      label.nodes(),
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.6, stagger: { amount: 0.55, from: "center" }, delay: 0.25 },
    );

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as Node).x ?? 0)
        .attr("y1", (d) => (d.source as Node).y ?? 0)
        .attr("x2", (d) => (d.target as Node).x ?? 0)
        .attr("y2", (d) => (d.target as Node).y ?? 0);

      node.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);
      label.attr("x", (d) => d.x ?? 0).attr("y", (d) => d.y ?? 0);
    });

    function drag(activeSimulation: d3.Simulation<Node, undefined>) {
      function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        if (!event.active) activeSimulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        if (!event.active) activeSimulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag<SVGCircleElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  }, []);

  useEffect(() => {
    initGraph();
    window.addEventListener("resize", initGraph);
    return () => {
      window.removeEventListener("resize", initGraph);
      simulationRef.current?.stop();
    };
  }, [initGraph]);

  return (
    <div ref={rootRef} className="relative flex h-screen w-full flex-col overflow-hidden bg-[#04070d] text-white">
      <div className="demo-aurora pointer-events-none absolute -left-40 top-12 h-[32rem] w-[32rem] rounded-full bg-cyan-400/18 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-44 right-0 h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/14 blur-3xl" />
      <div className="demo-chrome pointer-events-none absolute left-0 top-0 z-10 w-full p-6 sm:p-8">
        <button
          onClick={() => navigate("/")}
          className="pointer-events-auto mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/62 backdrop-blur-xl transition-colors hover:border-cyan-300/35 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Back home
        </button>

        <div className="max-w-3xl rounded-[2rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
          <div className="font-mono text-xs uppercase tracking-[0.34em] text-cyan-200/80">risk topology sketch</div>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white md:text-6xl">Risk relationships as a graph</h1>
          <p className="mt-3 max-w-xl text-white/62">
            A small D3 prototype for dependency, lineage, Python pipeline, and counterparty-style relationships that are hard to read in a static table.
          </p>
          <button
            onClick={() => navigate("/labs#risk-graph")}
            className="pointer-events-auto mt-4 rounded-full border border-cyan-200/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition-colors hover:border-cyan-200/45"
          >
            Read the finance case study
          </button>
        </div>

        <div className="mt-6 grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-3">
          {[
            ["Hiring signal", "I can turn relationship data into an investigative UI."],
            ["Finance fit", "Useful for risk topology, service lineage, data pipeline maps, and exposure views."],
            ["Frontend proof", "D3 simulation, drag interaction, labels, and resize handling."],
          ].map(([label, copy]) => (
            <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/28 p-4 backdrop-blur-xl">
              <div className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/70">{label}</div>
              <p className="mt-2 text-sm leading-6 text-white/58">{copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div ref={containerRef} className="relative z-0 h-full w-full">
        <svg ref={svgRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
      </div>

      <button
        onClick={initGraph}
        className="reset-button absolute bottom-8 right-8 z-10 rounded-full border border-lime-300/30 bg-lime-300 px-5 py-4 font-black text-black shadow-[0_18px_50px_rgba(190,242,100,0.25)] transition-transform hover:scale-110"
        title="Reset Simulation"
      >
        <RefreshCw className="h-6 w-6" />
      </button>
    </div>
  );
};

export default D3Demo;
