import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Gauge,
  Keyboard,
  Layers3,
  Play,
  ShieldCheck,
  TerminalSquare,
  TimerReset,
} from "lucide-react";
import { projects } from "../data/resume";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";

type LabCase = (typeof projects)[number];

const hiringStats = [
  { value: "8", label: "finance-facing frontend cases" },
  { value: "5", label: "hard UI modes: realtime, dense, audit, risk, pipeline" },
  { value: "0", label: "generic landing-page screenshots" },
];

const roleTargets = [
  "Trading UI",
  "Risk platforms",
  "Market data tools",
  "Python data pipeline monitoring",
  "Operations consoles",
  "Compliance workflows",
  "Internal developer tools",
];

const PrototypePanel = ({ lab }: { lab: LabCase }) => {
  switch (lab.prototypeKind) {
    case "worker":
      return <WorkerPrototype lab={lab} />;
    case "surface":
      return <SurfacePrototype lab={lab} />;
    case "graph":
      return <GraphPrototype lab={lab} />;
    case "blotter":
      return <BlotterPrototype lab={lab} />;
    case "tape":
      return <TapePrototype lab={lab} />;
    case "matrix":
      return <MatrixPrototype lab={lab} />;
    case "trail":
      return <TrailPrototype lab={lab} />;
    case "pipeline":
      return <PipelinePrototype lab={lab} />;
    default:
      return <WorkerPrototype lab={lab} />;
  }
};

const PrototypeShell = ({ lab, children }: { lab: LabCase; children: React.ReactNode }) => (
  <div className="case-prototype relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#070a11] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.36)]" style={{ "--accent": lab.accent } as CSSProperties}>
    <div className="prototype-grid" aria-hidden="true" />
    <div className="relative z-10 mb-5 flex items-start justify-between gap-4">
      <div>
        <div className="font-mono text-[0.66rem] uppercase tracking-[0.32em] text-white/35">prototype surface</div>
        <h3 className="mt-1 text-2xl font-black tracking-tight text-white">{lab.prototypeTitle}</h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/58">{lab.prototypeCopy}</p>
      </div>
      <span className="prototype-pulse mt-2 h-3 w-3 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_18px_var(--accent)]" />
    </div>
    {children}
    <div className="relative z-10 mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {lab.prototypeBullets.map((bullet) => (
        <div key={bullet} className="rounded-2xl border border-white/8 bg-white/[0.035] px-3 py-2 text-xs leading-5 text-white/62">
          {bullet}
        </div>
      ))}
    </div>
  </div>
);

const WorkerPrototype = ({ lab }: { lab: LabCase }) => (
  <PrototypeShell lab={lab}>
    <div className="relative z-10 grid gap-3">
      {["Trade ticket", "Rust worker", "Risk readout"].map((label, index) => (
        <div key={label} className="rounded-[1.35rem] border border-white/10 bg-black/24 p-4">
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.22em] text-white/38">
            <span>{label}</span>
            <span className="text-[var(--accent)]">{index === 1 ? "running" : index === 2 ? "ready" : "queued"}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${index === 0 ? 62 : index === 1 ? 84 : 44}%` }} />
          </div>
        </div>
      ))}
      <div className="grid grid-cols-3 gap-3 font-mono text-xs text-white/58">
        {[["REQ", "#1842"], ["P95", "18ms"], ["STALE", "0"]].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
            <div className="text-white/32">{k}</div>
            <div className="mt-1 text-lg font-black text-white">{v}</div>
          </div>
        ))}
      </div>
    </div>
  </PrototypeShell>
);

const SurfacePrototype = ({ lab }: { lab: LabCase }) => (
  <PrototypeShell lab={lab}>
    <div className="relative z-10 h-72 rounded-[1.6rem] border border-white/10 bg-black/25 p-5 [perspective:900px]">
      <div className="absolute left-5 top-5 font-mono text-xs uppercase tracking-[0.24em] text-white/40">vol / tenor / depth</div>
      <div className="absolute inset-x-12 bottom-12 h-36 origin-bottom -rotate-x-45 skew-x-6 rounded-3xl border border-cyan-200/20 bg-gradient-to-br from-cyan-300/35 via-blue-400/20 to-fuchsia-300/25 shadow-[0_30px_90px_rgba(94,233,255,0.18)]" />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="absolute left-14 right-14 h-px bg-white/12" style={{ bottom: 58 + i * 27 }} />
      ))}
      {["1M", "3M", "6M", "1Y", "2Y"].map((label, i) => (
        <span key={label} className="absolute bottom-5 font-mono text-[0.65rem] text-white/40" style={{ left: `${18 + i * 16}%` }}>
          {label}
        </span>
      ))}
      <div className="absolute right-5 top-5 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-right font-mono text-xs text-white/58">
        <div>surface delta</div>
        <div className="text-xl font-black text-[var(--accent)]">+3.8%</div>
      </div>
    </div>
  </PrototypeShell>
);

const GraphPrototype = ({ lab }: { lab: LabCase }) => (
  <PrototypeShell lab={lab}>
    <div className="relative z-10 h-72 rounded-[1.6rem] border border-white/10 bg-black/25">
      <svg className="absolute inset-0 h-full w-full opacity-65" viewBox="0 0 420 260" aria-hidden="true">
        <line x1="90" y1="80" x2="210" y2="130" stroke="currentColor" className="text-[var(--accent)]" />
        <line x1="210" y1="130" x2="330" y2="72" stroke="currentColor" className="text-white/30" />
        <line x1="210" y1="130" x2="300" y2="198" stroke="currentColor" className="text-white/30" />
        <line x1="90" y1="80" x2="128" y2="192" stroke="currentColor" className="text-white/30" />
      </svg>
      {[
        ["CPTY", 14, 22, "h-16 w-16"],
        ["RISK", 47, 43, "h-20 w-20"],
        ["BOOK", 76, 20, "h-14 w-14"],
        ["FEED", 68, 72, "h-12 w-12"],
        ["OPS", 26, 70, "h-12 w-12"],
      ].map(([label, left, top, size]) => (
        <div key={label} className={`absolute grid ${size} place-items-center rounded-full border border-white/15 bg-[#0b0f18] font-mono text-xs font-black text-white shadow-[0_0_34px_rgba(255,255,255,0.08)]`} style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -50%)" }}>
          {label}
        </div>
      ))}
    </div>
  </PrototypeShell>
);

const BlotterPrototype = ({ lab }: { lab: LabCase }) => {
  const rows = [
    ["AAPL", "BUY", "12,000", "LIVE", "+0.18"],
    ["NVDA", "SELL", "8,400", "CHECK", "-0.42"],
    ["EURUSD", "BUY", "2.5M", "AMEND", "+0.04"],
    ["UST 10Y", "SELL", "15M", "HELD", "-0.11"],
  ];
  return (
    <PrototypeShell lab={lab}>
      <div className="relative z-10 overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/25">
        <div className="grid grid-cols-[1fr_0.7fr_0.9fr_0.9fr_0.7fr] border-b border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/36">
          <span>Instr</span><span>Side</span><span>Qty</span><span>Status</span><span>PnL</span>
        </div>
        {rows.map((row, index) => (
          <div key={row.join("")} className="grid grid-cols-[1fr_0.7fr_0.9fr_0.9fr_0.7fr] items-center border-b border-white/8 px-4 py-3 text-sm text-white/70 last:border-b-0">
            {row.map((cell, i) => (
              <span key={cell} className={i === 3 ? "font-mono text-[var(--accent)]" : i === 4 && cell.startsWith("-") ? "text-rose-300" : i === 4 ? "text-lime-300" : ""}>{cell}</span>
            ))}
            <span className="absolute left-0 h-9 w-1 rounded-r-full bg-[var(--accent)]" style={{ top: 48 + index * 49 }} />
          </div>
        ))}
      </div>
      <div className="relative z-10 mt-3 flex gap-2 font-mono text-xs text-white/42">
        <span className="rounded-full border border-white/10 px-3 py-1"><Keyboard className="mr-1 inline h-3 w-3" /> J/K rows</span>
        <span className="rounded-full border border-white/10 px-3 py-1">A amend</span>
        <span className="rounded-full border border-white/10 px-3 py-1">C cancel</span>
      </div>
    </PrototypeShell>
  );
};

const TapePrototype = ({ lab }: { lab: LabCase }) => (
  <PrototypeShell lab={lab}>
    <div className="relative z-10 rounded-[1.6rem] border border-white/10 bg-black/25 p-5">
      <div className="mb-5 flex items-center justify-between font-mono text-xs uppercase tracking-[0.22em] text-white/42">
        <span>09:30:00 - 09:36:45</span>
        <span className="text-[var(--accent)]"><Play className="mr-1 inline h-3 w-3" /> replay</span>
      </div>
      <div className="relative h-3 rounded-full bg-white/10">
        <div className="h-full w-[58%] rounded-full bg-[var(--accent)]" />
        {[18, 33, 58, 74, 86].map((left) => (
          <span key={left} className="absolute top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-white" style={{ left: `${left}%` }} />
        ))}
      </div>
      <div className="mt-6 grid gap-3">
        {["Quote burst", "Client order replace", "Venue reject", "Manual review"].map((event, i) => (
          <div key={event} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3 text-sm text-white/66">
            <span>{event}</span>
            <span className="font-mono text-xs text-white/35">+{(i + 1) * 420}ms</span>
          </div>
        ))}
      </div>
    </div>
  </PrototypeShell>
);

const MatrixPrototype = ({ lab }: { lab: LabCase }) => {
  const cells = [1, 2, 3, 4, 2, 3, 5, 4, 2, 1, 2, 4, 5, 3, 2, 1, 3, 4, 5, 4, 1, 2, 3, 4, 5];
  return (
    <PrototypeShell lab={lab}>
      <div className="relative z-10 rounded-[1.6rem] border border-white/10 bg-black/25 p-5">
        <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-[0.22em] text-white/42">
          <span>scenario / asset class</span>
          <span className="text-[var(--accent)]">stress +2.4 stdev</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {cells.map((risk, index) => (
            <div
              key={`${risk}-${index}`}
              className="flex aspect-square items-end rounded-xl border border-white/8 p-2 font-mono text-[0.65rem] text-white/80"
              style={{ background: `rgba(255, 125, 125, ${0.08 + risk * 0.13})` }}
            >
              {risk === 5 ? "HIGH" : risk === 4 ? "WATCH" : ""}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-white/45">
          <span>Low</span>
          <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-white/10 via-orange-300/40 to-red-400" />
          <span>Limit</span>
        </div>
      </div>
    </PrototypeShell>
  );
};

const TrailPrototype = ({ lab }: { lab: LabCase }) => (
  <PrototypeShell lab={lab}>
    <div className="relative z-10 rounded-[1.6rem] border border-white/10 bg-black/25 p-5">
      <div className="absolute left-9 top-8 bottom-8 w-px bg-gradient-to-b from-[var(--accent)] via-white/20 to-transparent" />
      {["Trade amended", "Desk head approved", "Evidence exported", "Surveillance review"].map((event, index) => (
        <div key={event} className="relative mb-4 ml-12 rounded-2xl border border-white/8 bg-white/[0.035] p-4 last:mb-0">
          <span className="absolute -left-[3.05rem] top-5 grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-[#0b0f18]">
            <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
          </span>
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-white">{event}</span>
            <span className="font-mono text-xs text-white/35">T+{index + 1}</span>
          </div>
          <p className="mt-1 text-sm text-white/50">Role, timestamp, rationale, and export reference kept visible.</p>
        </div>
      ))}
    </div>
  </PrototypeShell>
);

const PipelinePrototype = ({ lab }: { lab: LabCase }) => {
  const stages = [
    ["ingest", "source files", "98%", "on time"],
    ["normalize", "schema map", "86%", "running"],
    ["validate", "rules", "72%", "12 breaks"],
    ["reconcile", "books", "64%", "review"],
    ["publish", "risk mart", "41%", "held"],
  ];

  const checks = [
    ["Trades", "124,088", "124,076", "12"],
    ["Prices", "3,842", "3,842", "0"],
    ["Ref data", "18,420", "18,417", "3"],
  ];

  return (
    <PrototypeShell lab={lab}>
      <div className="relative z-10 overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/25 p-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            ["freshness", "38s lag"],
            ["sla", "99.94%"],
            ["quarantine", "15 rows"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
              <div className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/32">{label}</div>
              <div className="mt-1 text-lg font-black text-white">{value}</div>
            </div>
          ))}
        </div>

        <div className="relative mt-5">
          <div className="absolute left-8 right-8 top-[2.3rem] hidden h-px bg-gradient-to-r from-[var(--accent)]/70 via-white/16 to-amber-200/45 md:block" />
          <div className="grid gap-3 md:grid-cols-5">
            {stages.map(([name, label, progress, status], index) => (
              <div key={name} className="pipeline-stage-card relative overflow-hidden rounded-2xl border border-white/10 bg-[#090d15] p-3">
                <span
                  className="pipeline-flow-dot pointer-events-none absolute -left-20 top-0 h-full w-16 opacity-55 blur-sm"
                  style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
                />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center rounded-xl border border-[var(--accent)]/25 bg-[var(--accent)]/10 font-mono text-[0.62rem] font-black text-[var(--accent)]">
                    {index + 1}
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${status === "on time" ? "bg-lime-300" : status === "running" ? "bg-cyan-300" : "bg-amber-300"}`} />
                </div>
                <div className="relative z-10 mt-3 font-black uppercase tracking-[0.08em] text-white">{name}</div>
                <div className="relative z-10 mt-1 text-xs text-white/40">{label}</div>
                <div className="relative z-10 mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: progress }} />
                </div>
                <div className="relative z-10 mt-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/38">{status}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-white/35">reconciliation sample</div>
            <div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.6fr] border-b border-white/10 pb-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/32">
              <span>set</span><span>in</span><span>matched</span><span>breaks</span>
            </div>
            {checks.map(([set, incoming, matched, breaks]) => (
              <div key={set} className="grid grid-cols-[1fr_0.8fr_0.8fr_0.6fr] border-b border-white/8 py-2 text-sm text-white/66 last:border-b-0">
                <span className="font-semibold text-white/80">{set}</span>
                <span>{incoming}</span>
                <span>{matched}</span>
                <span className={breaks === "0" ? "text-lime-300" : "text-amber-300"}>{breaks}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#05070c] p-4 font-mono text-xs leading-6 text-white/55">
            <div className="mb-2 text-[0.65rem] uppercase tracking-[0.28em] text-[var(--accent)]">python job notes</div>
            <div><span className="text-cyan-200">extract</span>(s3_drop)</div>
            <div><span className="text-lime-200">validate</span>(schema, stale_rules)</div>
            <div><span className="text-amber-200">reconcile</span>(trades, books)</div>
            <div><span className="text-rose-200">quarantine</span>(breaks, reason)</div>
            <div className="mt-2 rounded-xl border border-white/8 bg-white/[0.035] px-3 py-2 text-white/45">
              rerun requires reason + audit stamp
            </div>
          </div>
        </div>
      </div>
    </PrototypeShell>
  );
};

const CaseChapter = ({ lab, index }: { lab: LabCase; index: number }) => {
  const reversed = index % 2 === 1;

  return (
    <section id={lab.slug} className="lab-chapter scroll-mt-8 rounded-[2.4rem] border border-white/10 bg-white/[0.025] p-5 sm:p-7 lg:p-8" style={{ "--accent": lab.accent } as CSSProperties}>
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.38em] text-[var(--accent)]">Case {String(index + 1).padStart(2, "0")} / {lab.domain}</div>
          <h2 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">{lab.title}</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-white/45">{lab.metric}</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-start">
        <div className={reversed ? "lg:order-2" : ""}>
          <div className="grid gap-4">
            <div className="rounded-[1.7rem] border border-white/10 bg-[#0b0f18]/80 p-5">
              <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.26em] text-white/35">
                <Gauge className="h-4 w-4 text-[var(--accent)]" /> Why finance teams care
              </div>
              <p className="text-base leading-8 text-white/68">{lab.financeUse}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-white/35">
                  <Activity className="h-4 w-4 text-[var(--accent)]" /> Problem
                </div>
                <p className="text-sm leading-7 text-white/62">{lab.problem}</p>
              </div>
              <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-white/35">
                  <ShieldCheck className="h-4 w-4 text-[var(--accent)]" /> Constraint
                </div>
                <p className="text-sm leading-7 text-white/62">{lab.constraint}</p>
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-white/10 bg-black/20 p-5">
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-white/35">
                <Layers3 className="h-4 w-4 text-[var(--accent)]" /> Frontend moves
              </div>
              <div className="grid gap-2">
                {lab.moves.map((move) => (
                  <div key={move} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/64">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--accent)]" />
                    {move}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={reversed ? "lg:order-1" : ""}>
          <PrototypePanel lab={lab} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-5">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-white/35">What it proves in an interview</div>
          <p className="mt-3 text-base leading-8 text-white/68">{lab.interviewAngle}</p>
        </div>
        <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-5">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-white/35">Stack evidence</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...lab.frontendProof, ...lab.stack].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/62">{item}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {lab.prototypeLink ? (
          <Link to={lab.prototypeLink} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-black transition-transform hover:-translate-y-1">
            Open live prototype
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : null}
        <a href="#top" className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/70 transition-colors hover:border-[var(--accent)]/45 hover:text-white">
          Back to case index
        </a>
      </div>
    </section>
  );
};

const BrowserLabs = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? "");

  useEffect(() => {
    if (!location.hash) return;

    const targetId = location.hash.replace("#", "");
    const timeoutId = window.setTimeout(() => {
      const main = document.querySelector<HTMLElement>(".site-main");
      const target = document.getElementById(targetId);
      if (!main || !target) return;
      const top = target.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 20;
      main.scrollTo({ top, behavior: "smooth" });
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [location.hash]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const scroller = root?.closest(".site-main") as HTMLElement | null;
      if (!root || !scroller) return;

      gsap.fromTo(
        ".labs-hero > *",
        { autoAlpha: 0, y: 26, filter: "blur(10px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.75, stagger: 0.08 },
      );

      gsap.set(".lab-chapter", { autoAlpha: 0, y: 72, rotationX: 8, transformOrigin: "50% 100%" });
      ScrollTrigger.batch(".lab-chapter", {
        scroller,
        start: "top 86%",
        once: true,
        interval: 0.08,
        batchMax: 2,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            rotationX: 0,
            duration: 0.9,
            stagger: 0.12,
            overwrite: true,
          }),
      });

      projects.forEach((lab) => {
        const trigger = document.getElementById(lab.slug);
        if (!trigger) return;
        ScrollTrigger.create({
          trigger,
          scroller,
          start: "top 45%",
          end: "bottom 45%",
          onEnter: () => setActiveSlug(lab.slug),
          onEnterBack: () => setActiveSlug(lab.slug),
        });
      });

      gsap.to(".labs-progress-bar", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: root, scroller, start: "top top", end: "bottom bottom", scrub: 0.25 },
      });

      gsap.to(".prototype-pulse", {
        autoAlpha: 0.45,
        scale: 1.35,
        duration: 1.25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });

      gsap.fromTo(
        ".pipeline-flow-dot",
        { x: -70 },
        { x: 220, duration: 1.65, repeat: -1, ease: "none", stagger: 0.18 },
      );

      gsap.to(".pipeline-stage-card", {
        y: -4,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.11,
      });

      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} id="top" className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-20 h-[28rem] w-[28rem] rounded-full bg-cyan-400/12 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12rem] top-[54rem] h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="sticky top-0 z-40 -mx-4 mb-6 border-b border-white/10 bg-[#07090f]/82 px-4 py-3 backdrop-blur-2xl sm:-mx-7 sm:px-7 lg:-mx-10 lg:px-10">
        <div className="mb-3 h-px overflow-hidden rounded-full bg-white/8">
          <div className="labs-progress-bar h-full w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-300 via-lime-300 to-amber-300" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {projects.map((lab, index) => (
            <a
              key={lab.slug}
              href={`#${lab.slug}`}
              className={`shrink-0 rounded-full border px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] transition-colors ${
                activeSlug === lab.slug
                  ? "border-cyan-300/45 bg-cyan-300/12 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/42 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {String(index + 1).padStart(2, "0")} {lab.domain}
            </a>
          ))}
        </div>
      </div>

      <section className="labs-hero relative z-10 mb-8 rounded-[2.4rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8 lg:p-10">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/62 transition-colors hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <div className="mt-8 max-w-5xl">
          <div className="font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/80">Finance frontend case studies</div>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">Evidence for trading UIs, risk views, market data, Python pipelines, and operations consoles.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/62">
            Each case below is written for a hiring manager who wants evidence: can the frontend stay fast, readable, auditable, and useful when financial data gets dense, late, or urgent?
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {roleTargets.map((role) => (
            <span key={role} className="rounded-full border border-cyan-300/18 bg-cyan-300/8 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-cyan-100/78">
              {role}
            </span>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
          {hiringStats.map((stat) => (
            <div key={stat.value} className="rounded-[1.7rem] border border-white/10 bg-[#0b0f18]/80 p-5">
              <div className="font-mono text-3xl font-black text-cyan-200">{stat.value}</div>
              <p className="mt-2 text-sm leading-6 text-white/55">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mb-8 grid gap-3 md:grid-cols-5">
        {[
          [TimerReset, "Latency", "Do not block trader workflows."],
          [TerminalSquare, "State", "Make streaming and replay states explicit."],
          [Activity, "Pipelines", "Expose source lag and reconciliation breaks."],
          [ShieldCheck, "Controls", "Design for audit and permissions."],
          [Gauge, "Density", "Keep high-volume screens scannable."],
        ].map(([Icon, title, copy]) => {
          const IconComp = Icon as typeof TimerReset;
          return (
            <div key={title as string} className="case-reveal rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-5">
              <IconComp className="h-5 w-5 text-cyan-200" />
              <h3 className="mt-3 font-black text-white">{title as string}</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">{copy as string}</p>
            </div>
          );
        })}
      </section>

      <div className="relative z-10 space-y-8 pb-16">
        {projects.map((lab, index) => (
          <CaseChapter key={lab.slug} lab={lab} index={index} />
        ))}
      </div>
    </div>
  );
};

export default BrowserLabs;
