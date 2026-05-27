import { type CSSProperties, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  Award,
  Braces,
  Cloud,
  Cpu,
  Database,
  Github,
  Mail,
  MapPin,
  Network,
  Radio,
  Sparkles,
  Zap,
} from "lucide-react";
import Card from "../components/Card";
import { experience, profile, projects, skills } from "../data/resume";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";

const marqueeItems = [
  "React screens that survive Monday",
  "Python data pipelines",
  "Rust in the browser",
  "Trading UI edge cases",
  "Small WebGL sketches",
  "D3 maps of messy systems",
  "AWS chores made boring",
  "Motion with a reason",
];

const heroStats = [
  { value: "7+", label: "years shipping production software" },
  { value: "Finance", label: "current focus: trading, data, and pipeline UI" },
  { value: "8 cases", label: "financial frontend evidence" },
];

const targetRoles = [
  "Frontend Engineer - Trading UI",
  "Full-stack Engineer - Internal Platforms",
  "React / TypeScript Engineer - Data Tools",
  "Full-stack Engineer - Python Data Tools",
];

const hiringBrief = [
  {
    label: "Financial UI judgment",
    copy: "Blotters, replay lanes, risk matrices, audit trails, pipeline monitors, and dependency maps - not generic portfolio widgets.",
  },
  {
    label: "Data-to-screen thinking",
    copy: "Python pipelines, reconciliation, and API concerns are shown beside the React screens that operations and risk users actually trust.",
  },
  {
    label: "Production communication",
    copy: "The copy explains constraints, tradeoffs, and what each case proves in an interview.",
  },
];

const skillGroups = [
  { label: "Frontend", icon: Braces, items: skills.frontend, accent: "#67e8f9" },
  { label: "Backend", icon: Cpu, items: skills.backend, accent: "#f7d45a" },
  { label: "Data", icon: Network, items: skills.data, accent: "#8fffd2" },
  { label: "Cloud", icon: Cloud, items: skills.cloud, accent: "#7cff70" },
  { label: "Database", icon: Database, items: skills.database, accent: "#ff67d8" },
];

const splitName = profile.name.split("");
type LabProject = (typeof projects)[number];

const financeSignals = [
  "Latency matters more than decoration.",
  "Dense layouts need hierarchy, not more color.",
  "Pipelines need freshness and reason codes.",
  "Data changes faster than the page can breathe.",
  "Bad states should still look deliberate.",
];

const marketStats = [
  { value: "Realtime", label: "UI states that update without stalls" },
  { value: "Dense", label: "Tables, timelines, graphs, and overlays" },
  { value: "Pipeline", label: "Freshness, validation, and reconciliation states" },
  { value: "Defensive", label: "Designed for error, delay, and edge cases" },
];

const LabCase = ({ project, index }: { project: LabProject; index: number }) => {
  const body = (
    <article
      className="lab-case group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0f18]/90 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      style={{ "--accent": project.accent } as CSSProperties}
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(circle at 18% 0%, ${project.accent}24, transparent 42%)` }} />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[0.66rem] uppercase tracking-[0.34em] text-white/35">
            Case 0{index + 1} / {project.metric}
          </div>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-white">{project.title}</h3>
          <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[var(--accent)]">{project.domain}</p>
        </div>
        <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_18px_var(--accent)]" />
      </div>

      <p className="relative z-10 mt-5 text-sm leading-7 text-white/66">{project.description}</p>

      <div className="relative z-10 mt-5 rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
        <div className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-white/35">Why it matters in finance</div>
        <p className="mt-2 text-sm leading-7 text-white/72">{project.financeUse}</p>
      </div>

      <div className="relative z-10 mt-4 flex flex-wrap gap-2">
        {project.frontendProof.map((item) => (
          <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/68">
            {item}
          </span>
        ))}
      </div>

      <div className="relative z-10 mt-5 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span key={item} className="rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/8 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/78">
            {item}
          </span>
        ))}
      </div>

      <p className="relative z-10 mt-auto pt-5 text-sm leading-6 text-white/55">{project.signal}</p>

      <div className="relative z-10 mt-5 inline-flex items-center gap-2 self-start rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/80">
        {project.link ? "Open case" : "Concept note"}
        {project.link ? <ArrowUpRight className="h-4 w-4" /> : null}
      </div>
    </article>
  );

  return project.link ? (
    <Link to={project.link} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
};

function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { targetId?: string } | null;
    if (!state?.targetId) return;

    const timeoutId = window.setTimeout(() => {
      const main = document.querySelector<HTMLElement>(".site-main");
      const target = document.getElementById(state.targetId ?? "");
      if (main && target) {
        const top = target.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 24;
        main.scrollTo({ top, behavior: "smooth" });
      }
      window.history.replaceState({}, document.title);
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [location]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const scroller = root?.closest(".site-main") as HTMLElement | null;
      if (!root || !scroller) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          canHover: "(hover: hover) and (pointer: fine)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, canHover, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            canHover: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set(".hero-kicker, .title-char, .hero-copy, .hero-cta, .hero-panel, .reveal-up", {
              autoAlpha: 1,
              clearProps: "transform,filter,visibility,opacity",
            });
            return;
          }

          gsap.set(".title-char", { yPercent: 120, rotateX: -70, autoAlpha: 0, transformOrigin: "50% 50% -60" });
          gsap.set(".hero-kicker, .hero-copy, .hero-cta, .hero-panel", { autoAlpha: 0 });
          gsap.set(".reveal-up", { autoAlpha: 0, y: 66, rotationX: 12, transformOrigin: "50% 100%" });
          gsap.set(".scroll-progress-bar", { scaleX: 0, transformOrigin: "0% 50%" });

          const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
          intro
            .fromTo(".hero-shell", { clipPath: "inset(7% 7% 7% 7% round 36px)" }, { clipPath: "inset(0% 0% 0% 0% round 36px)", duration: 1.05 })
            .to(".hero-kicker", { autoAlpha: 1, y: 0, duration: 0.58 }, "<0.12")
            .to(".title-char", { autoAlpha: 1, yPercent: 0, rotateX: 0, duration: 1.05, stagger: { each: 0.045, from: "start" } }, "<0.05")
            .fromTo(".hero-copy", { y: 24, filter: "blur(10px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.78 }, "-=0.62")
            .fromTo(".hero-cta", { y: 18, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.58 }, "-=0.48")
            .fromTo(".hero-panel", { x: 42, y: 18, rotationY: -12, filter: "blur(14px)" }, { autoAlpha: 1, x: 0, y: 0, rotationY: 0, filter: "blur(0px)", duration: 0.92 }, "-=0.68");

          gsap.to(".hero-planet", { y: -18, x: 8, rotation: 3, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
          gsap.to(".orbit-ring", { rotation: 360, duration: 18, repeat: -1, ease: "none", stagger: 2 });
          gsap.to(".orbital-node", { scale: 1.35, autoAlpha: 0.35, duration: 1.3, repeat: -1, yoyo: true, stagger: 0.28, ease: "sine.inOut" });
          gsap.to(".background-orb-a", {
            yPercent: -18,
            xPercent: 7,
            ease: "none",
            scrollTrigger: { trigger: root, scroller, start: "top top", end: "bottom bottom", scrub: 1 },
          });
          gsap.to(".background-orb-b", {
            yPercent: 24,
            xPercent: -9,
            ease: "none",
            scrollTrigger: { trigger: root, scroller, start: "top top", end: "bottom bottom", scrub: 1 },
          });
          gsap.to(".data-marquee-track", { xPercent: -50, duration: 28, repeat: -1, ease: "none" });
          gsap.to(".scroll-progress-bar", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: root, scroller, start: "top top", end: "bottom bottom", scrub: 0.25 },
          });

          ScrollTrigger.batch(".reveal-up", {
            scroller,
            start: "top 86%",
            once: true,
            interval: 0.08,
            batchMax: 6,
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                rotationX: 0,
                duration: 0.9,
                stagger: { each: 0.09, from: "start" },
                overwrite: true,
              }),
          });

          gsap.utils.toArray<HTMLElement>(".section-heading").forEach((heading) => {
            gsap.fromTo(
              heading,
              { autoAlpha: 0, x: -34, filter: "blur(10px)" },
              {
                autoAlpha: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.75,
                scrollTrigger: { trigger: heading, scroller, start: "top 88%", once: true },
              },
            );
          });

          gsap.utils.toArray<HTMLElement>(".timeline-beam").forEach((beam) => {
            gsap.fromTo(
              beam,
              { scaleY: 0, transformOrigin: "50% 0%" },
              {
                scaleY: 1,
                ease: "none",
                scrollTrigger: { trigger: beam, scroller, start: "top 76%", end: "bottom 30%", scrub: 1 },
              },
            );
          });

          if (isDesktop) {
            const track = root.querySelector<HTMLElement>(".lab-track");
            const section = root.querySelector<HTMLElement>(".lab-track-section");
            if (track && section) {
              const distance = () => Math.max(0, track.scrollWidth - scroller.clientWidth + 72);
              if (distance() > 120) {
                gsap.to(track, {
                  x: () => -distance(),
                  ease: "none",
                  scrollTrigger: {
                    trigger: section,
                    scroller,
                    start: "top 10%",
                    end: () => `+=${distance() + 520}`,
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                  },
                });
              }
            }
          }

          let removePointer: (() => void) | undefined;
          if (canHover) {
            const cursor = root.querySelector<HTMLElement>(".cursor-core");
            const ring = root.querySelector<HTMLElement>(".cursor-ring");
            if (cursor && ring) {
              gsap.set([cursor, ring], { xPercent: -50, yPercent: -50, autoAlpha: 1 });
              const cursorX = gsap.quickTo(cursor, "x", { duration: 0.18, ease: "power3" });
              const cursorY = gsap.quickTo(cursor, "y", { duration: 0.18, ease: "power3" });
              const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
              const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
              const onMove = (event: PointerEvent) => {
                cursorX(event.clientX);
                cursorY(event.clientY);
                ringX(event.clientX);
                ringY(event.clientY);
              };
              const onEnterInteractive = () => gsap.to(ring, { scale: 1.8, borderColor: "rgba(103,232,249,0.75)", duration: 0.28 });
              const onLeaveInteractive = () => gsap.to(ring, { scale: 1, borderColor: "rgba(255,255,255,0.26)", duration: 0.28 });

              root.addEventListener("pointermove", onMove);
              root.querySelectorAll("a, button, .orbital-card").forEach((el) => {
                el.addEventListener("pointerenter", onEnterInteractive);
                el.addEventListener("pointerleave", onLeaveInteractive);
              });
              removePointer = () => {
                root.removeEventListener("pointermove", onMove);
                root.querySelectorAll("a, button, .orbital-card").forEach((el) => {
                  el.removeEventListener("pointerenter", onEnterInteractive);
                  el.removeEventListener("pointerleave", onLeaveInteractive);
                });
              };
            }
          }

          ScrollTrigger.refresh();
          return () => removePointer?.();
        },
        root,
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="portfolio-page relative min-h-screen overflow-hidden">
      <div className="cursor-core" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />
      <div className="scroll-progress fixed left-[19.5rem] right-2 top-2 z-50 h-px overflow-hidden rounded-full bg-white/8">
        <div className="scroll-progress-bar h-full w-full origin-left bg-gradient-to-r from-cyan-300 via-lime-300 to-amber-300" />
      </div>
      <div className="background-orb-a pointer-events-none absolute -left-32 top-14 h-[30rem] w-[30rem] rounded-full bg-cyan-400/14 blur-3xl" />
      <div className="background-orb-b pointer-events-none absolute right-[-12rem] top-[42rem] h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/12 blur-3xl" />

      <section id="hero" className="hero-shell relative min-h-[calc(100vh-3.5rem)] overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#080b12]/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-8 lg:p-10">
        <div className="hero-mesh" aria-hidden="true" />
        <div className="relative z-10 grid min-h-[calc(100vh-8rem)] items-center gap-10 lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <div className="hero-kicker inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.42em] text-cyan-100">
              <Radio className="h-4 w-4 text-cyan-300" />
              Hong Kong / financial frontend candidate
            </div>
            <h1 className="mt-7 max-w-5xl text-[clamp(3.6rem,9.5vw,8.6rem)] font-black leading-[0.86] tracking-[-0.075em] text-white">
              {splitName.map((char, index) => (
                <span key={`${char}-${index}`} className="title-char inline-block will-change-transform">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>
            <div className="hero-copy mt-7 max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
              <span className="text-white">{profile.title}</span> building trading screens, risk workflows, and Python-backed data tools. I focus on latency, dense state, and audit-ready UI for finance teams.
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/labs"
                className="hero-cta inline-flex items-center gap-2 rounded-full bg-cyan-200 px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-black transition-transform duration-300 hover:-translate-y-1"
              >
                View finance cases
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cta inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-black transition-transform duration-300 hover:-translate-y-1"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="hero-cta inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-white transition-colors duration-300 hover:border-cyan-300/45 hover:bg-cyan-300/10"
              >
                <Mail className="h-4 w-4" />
                Contact
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {targetRoles.map((role) => (
                <span key={role} className="hero-cta rounded-full border border-cyan-300/18 bg-cyan-300/8 px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-cyan-100/82">
                  {role}
                </span>
              ))}
            </div>
            <div className="mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="hero-cta rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
                  <div className="font-mono text-3xl font-black text-cyan-200">{stat.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.25em] text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel relative mx-auto w-full max-w-[31rem] [perspective:1200px]">
            <div className="hero-planet relative aspect-square overflow-hidden rounded-[3rem] border border-white/12 bg-gradient-to-br from-[#0b1020] via-[#11182a] to-[#07080b] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)] will-change-transform">
              <div className="absolute inset-8 rounded-full border border-cyan-300/20" />
              <div className="orbit-ring absolute inset-10 rounded-full border border-dashed border-white/12" />
              <div className="orbit-ring absolute inset-20 rounded-full border border-dashed border-lime-300/20" />
              <span className="orbital-node absolute left-10 top-24 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(103,232,249,0.9)]" />
              <span className="orbital-node absolute bottom-20 right-14 h-4 w-4 rounded-full bg-lime-300 shadow-[0_0_22px_rgba(190,242,100,0.9)]" />
              <span className="orbital-node absolute right-24 top-14 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_22px_rgba(252,211,77,0.9)]" />
              <div className="absolute inset-0 hero-terminal-grid" aria-hidden="true" />
              <div className="relative z-10 flex h-full flex-col justify-between rounded-[2.2rem] border border-white/10 bg-black/28 p-6 backdrop-blur-md">
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.24em] text-white/45">
                  <span>profile card</span>
                  <span className="text-lime-300">awake</span>
                </div>
                <div>
                  <img
                    src="/james-hu-logo.svg"
                    alt="James Hu logo"
                    className="h-40 w-40 rounded-[2rem] border border-cyan-300/18 bg-[#05070d] object-cover shadow-[0_0_46px_rgba(103,232,249,0.18)] sm:h-52 sm:w-52"
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-cyan-100">{profile.location}</span>
                    <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-amber-100">build notes</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs text-white/55">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="text-white/35">now</div>
                    <div className="mt-1 text-white">Morgan Stanley</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="text-white/35">keepsake</div>
                    <div className="mt-1 text-white">browser labs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="reveal-up my-5 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] py-3">
        <div className="data-marquee-track flex w-max gap-4 whitespace-nowrap will-change-transform">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={`${item}-${index}`} className="mx-3 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.35em] text-white/45">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="reveal-up mb-16 rounded-[2.25rem] border border-white/10 bg-[#080c14]/78 p-5 sm:p-7 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <div className="section-eyebrow">Recruiter shortcut</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-5xl">
              If you are hiring for finance frontend, start here.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/58">
              The strongest part of this site is the Browser Labs section: eight case studies designed around the front-end and data-platform problems I expect in trading, risk, operations, market data, pipelines, and controls teams.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {hiringBrief.map((item) => (
              <div key={item.label} className="rounded-[1.55rem] border border-white/10 bg-white/[0.035] p-4">
                <h3 className="font-black text-white">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/labs" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition-transform hover:-translate-y-1">
            Open the case-study path
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <a href={`mailto:${profile.email}?subject=Frontend%20role%20conversation`} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/72 transition-colors hover:border-cyan-300/45 hover:text-white">
            Email about a role
          </a>
        </div>
      </section>

      <div className="space-y-16 pb-10">
        <section id="experience" className="section-panel relative rounded-[2.25rem] border border-white/10 bg-white/[0.025] p-5 sm:p-7 lg:p-8">
          <div className="section-heading mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="section-eyebrow">Work notes</div>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-white md:text-6xl">Where I have shipped</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/55">
              Finance, cloud tooling, client platforms, and a lot of UI code that people had to use every day.
            </p>
          </div>
          <div className="relative">
            <div className="timeline-beam absolute left-4 top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-cyan-300 via-fuchsia-300 to-transparent md:block" />
            <div className="grid grid-cols-1 gap-5 md:pl-10 lg:grid-cols-2 xl:grid-cols-3">
              {experience.map((job) => (
                <Card
                  key={job.id}
                  title={job.role}
                  subtitle={job.company}
                  period={job.period}
                  description={job.description}
                  type="work"
                  imageColor={job.color}
                  logo={job.logo}
                  accent={job.accent}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="playground" className="lab-track-section section-panel relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#090d16]/80 p-5 sm:p-7 lg:p-8">
          <div className="section-heading mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="section-eyebrow">Finance frontend cases</div>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-white md:text-6xl">Browser labs for market screens</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/55">
              These are not startup landing-page demos. They are small case studies around the kind of UI problems finance teams actually hit: dense data, fast updates, audit trails, latency, Python-backed pipelines, and risk context.
            </p>
          </div>

          <div className="reveal-up mb-5 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-[2rem] border border-cyan-300/15 bg-cyan-300/[0.055] p-5">
              <div className="font-mono text-xs uppercase tracking-[0.34em] text-cyan-200/80">Hiring signal</div>
              <p className="mt-3 text-lg leading-8 text-white/72">
                I use this section to show how I think about financial frontends: correctness first, speed second, visual polish only when it helps the user make a decision.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              {marketStats.map((stat) => (
                <div key={stat.value} className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
                  <div className="font-mono text-sm font-black uppercase tracking-[0.24em] text-lime-200">{stat.value}</div>
                  <p className="mt-2 text-sm leading-6 text-white/55">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-up mb-6 grid grid-cols-1 gap-2 md:grid-cols-5">
            {financeSignals.map((signal) => (
              <div key={signal} className="rounded-full border border-white/10 bg-black/20 px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/50">
                {signal}
              </div>
            ))}
          </div>

          <div className="lab-track flex gap-5 will-change-transform lg:w-max">
            {projects.map((project) => (
              <div key={project.id} className="reveal-up min-h-[34rem] w-full shrink-0 lg:w-[34rem]">
                <LabCase project={project} index={project.id - 1} />
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="section-panel rounded-[2.25rem] border border-white/10 bg-white/[0.025] p-5 sm:p-7 lg:p-8">
          <div className="section-heading mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="section-eyebrow">How I tend to work</div>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-white md:text-6xl">Tools, grouped by where they show up</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/55">
              Not a keyword wall. These are the parts of a system I usually end up touching: surface, service layer, runtime, and data.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {skillGroups.map((group) => {
                const Icon = group.icon;
                return (
                  <div key={group.label} className="reveal-up skill-module rounded-[2rem] border border-white/10 bg-[#0b0f18]/86 p-5" style={{ "--accent": group.accent } as CSSProperties}>
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-[var(--accent)]/10 text-[var(--accent)]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="font-black text-white">{group.label}</h3>
                          <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/35">where it lands</p>
                        </div>
                      </div>
                      <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_16px_var(--accent)]" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <span key={skill} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/70 transition-colors duration-300 hover:border-[var(--accent)]/40 hover:text-white">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="reveal-up relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.025] p-6">
              <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-lime-300/12 blur-3xl" />
              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
                    <Award className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-black text-white">Paper trail</h3>
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/35">certs and school</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {skills.certifications.map((cert) => (
                    <div key={cert} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/18 p-4">
                      <Zap className="mt-0.5 h-4 w-4 shrink-0 text-lime-300" />
                      <span className="text-sm leading-6 text-white/72">{cert}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4">
                  <div className="font-mono text-xs uppercase tracking-[0.28em] text-white/35">Education</div>
                  <p className="mt-2 text-white/78">{profile.education}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section-panel rounded-[2.25rem] border border-white/10 bg-[#070a11] p-5 sm:p-7 lg:p-8">
          <div className="reveal-up relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-300/12 via-white/[0.045] to-fuchsia-400/10 p-7 sm:p-9">
            <div className="absolute inset-0 contact-grid" aria-hidden="true" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="section-eyebrow">Contact</div>
                <h2 className="mt-2 max-w-3xl text-4xl font-black tracking-tight text-white md:text-7xl">Send the rough version.</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/62">
                  If you are working on a product with sharp edges - trading tools, internal platforms, data-heavy UI - I am happy to compare notes.
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/55">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    <MapPin className="h-4 w-4 text-cyan-200" />
                    {profile.location}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    <Network className="h-4 w-4 text-lime-200" />
                    Async friendly
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a href={`mailto:${profile.email}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.24em] text-black transition-transform duration-300 hover:-translate-y-1">
                  <Mail className="h-4 w-4" />
                  Email Me
                </a>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/6 px-6 py-4 text-sm font-black uppercase tracking-[0.24em] text-white transition-colors duration-300 hover:border-cyan-300/50 hover:bg-cyan-300/10">
                  <Github className="h-4 w-4" />
                  GitHub
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
