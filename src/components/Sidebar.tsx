import { useLocation, useNavigate } from "react-router-dom";
import { Award, Briefcase, Code2, Home, Mail, PlusSquare, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { projects, skills } from "../data/resume";

const navItems = [
  { id: "hero", label: "Home", icon: Home, kicker: "Start" },
  { id: "experience", label: "Experience", icon: Briefcase, kicker: "Work" },
  { id: "playground", label: "Case Studies", icon: Code2, kicker: "Labs" },
  { id: "skills", label: "Skills", icon: Award, kicker: "Stack" },
  { id: "contact", label: "Contact", icon: PlusSquare, kicker: "Email" },
];

const Sidebar = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("hero");
  const [activeLabSlug, setActiveLabSlug] = useState("top");
  const navigate = useNavigate();
  const location = useLocation();
  const isLabsPage = location.pathname === "/labs";

  const handleNavigation = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { targetId: id } });
      return;
    }

    const main = document.querySelector<HTMLElement>(".site-main");
    const target = document.getElementById(id);
    if (!main || !target) return;

    const top = target.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 24;
    setActiveId(id);
    main.scrollTo({ top, behavior: "smooth" });
  };

  const handleLabNavigation = (slug: string) => {
    if (!isLabsPage) {
      navigate(slug === "top" ? "/labs" : `/labs#${slug}`);
      return;
    }

    const main = document.querySelector<HTMLElement>(".site-main");
    const target = slug === "top" ? document.getElementById("top") : document.getElementById(slug);
    if (!main || !target) return;

    const top = slug === "top" ? 0 : target.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 20;
    setActiveLabSlug(slug);
    window.history.replaceState({}, document.title, slug === "top" ? "/labs" : `/labs#${slug}`);
    main.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    if (location.pathname !== "/") return;

    const main = document.querySelector<HTMLElement>(".site-main");
    if (!main) return;

    let frameId = 0;
    const sectionIds = navItems.map((item) => item.id);

    const updateActiveSection = () => {
      const mainRect = main.getBoundingClientRect();
      const activationLine = mainRect.top + mainRect.height * 0.38;
      let current = "hero";

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;
        if (section.getBoundingClientRect().top <= activationLine) {
          current = id;
        }
      });

      setActiveId(current);
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    const timeoutIds = [80, 350, 900].map((delay) => window.setTimeout(updateActiveSection, delay));
    scheduleUpdate();
    main.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      timeoutIds.forEach((id) => window.clearTimeout(id));
      main.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!isLabsPage) return;

    const main = document.querySelector<HTMLElement>(".site-main");
    if (!main) return;

    let frameId = 0;

    const updateActiveLab = () => {
      const mainRect = main.getBoundingClientRect();
      const activationLine = mainRect.top + mainRect.height * 0.42;
      let current = "top";

      projects.forEach((project) => {
        const section = document.getElementById(project.slug);
        if (!section) return;
        if (section.getBoundingClientRect().top <= activationLine) {
          current = project.slug;
        }
      });

      setActiveLabSlug(current);
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveLab);
    };

    const timeoutIds = [120, 480, 1000].map((delay) => window.setTimeout(updateActiveLab, delay));
    scheduleUpdate();
    main.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      timeoutIds.forEach((id) => window.clearTimeout(id));
      main.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [isLabsPage, location.hash]);

  useGSAP(
    () => {
      const scope = sidebarRef.current;
      if (!scope) return;

      gsap.fromTo(
        ".sidebar-brand",
        { autoAlpha: 0, y: -18, scale: 0.94 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
      );

      gsap.fromTo(
        ".sidebar-item",
        { autoAlpha: 0, x: -20 },
        { autoAlpha: 1, x: 0, duration: 0.65, stagger: 0.08, delay: 0.08 },
      );

      gsap.fromTo(
        ".stack-chip",
        { autoAlpha: 0, x: -14 },
        { autoAlpha: 1, x: 0, duration: 0.55, stagger: 0.04, delay: 0.2 },
      );

      gsap.to(".sidebar-radar", {
        rotation: 360,
        duration: 24,
        repeat: -1,
        ease: "none",
      });

      const xTo = gsap.quickTo(glowRef.current, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(glowRef.current, "y", { duration: 0.6, ease: "power3" });
      const scaleTo = gsap.quickTo(glowRef.current, "scale", { duration: 0.35, ease: "power3" });
      const onMove = (event: PointerEvent) => {
        if (!glowRef.current) return;
        const rect = scope.getBoundingClientRect();
        xTo(event.clientX - rect.left - 80);
        yTo(event.clientY - rect.top - 80);
        scaleTo(1);
      };
      const onLeave = () => scaleTo(0.7);

      scope.addEventListener("pointermove", onMove);
      scope.addEventListener("pointerleave", onLeave);
      scaleTo(0.7);

      return () => {
        scope.removeEventListener("pointermove", onMove);
        scope.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: sidebarRef },
  );

  return (
    <aside
      ref={sidebarRef}
      className="relative flex h-full w-[19rem] flex-col overflow-hidden border-r border-white/10 bg-[#04050a] px-4 py-5 shadow-[inset_-1px_0_0_rgba(255,255,255,0.03)]"
    >
      <div ref={glowRef} className="pointer-events-none absolute left-0 top-0 h-40 w-40 rounded-full bg-cyan-400/12 blur-3xl will-change-transform" />
      <div className="absolute inset-0 sidebar-grid opacity-30" aria-hidden="true" />
      <div className="absolute left-4 right-4 top-4 sidebar-radar rounded-[1.6rem] border border-cyan-400/15 bg-cyan-400/5" aria-hidden="true" />

      <div className={`sidebar-brand relative z-10 rounded-[1.6rem] border border-white/10 bg-white/5 backdrop-blur-xl ${isLabsPage ? "mb-4 p-3" : "mb-6 p-4"}`}>
        <button
          onClick={() => handleNavigation("hero")}
          className="flex w-full items-center gap-3 text-left"
        >
          <img
            src="/james-hu-logo.svg"
            alt="James Hu logo"
            className="h-12 w-12 rounded-2xl border border-cyan-300/20 bg-[#05070d] object-cover shadow-[0_0_24px_rgba(103,232,249,0.22)]"
          />
          <div className="min-w-0">
            <div className="text-[0.68rem] uppercase tracking-[0.4em] text-cyan-300/80">James Hu</div>
            <div className="mt-1 text-xl font-black tracking-tight text-white">James Hu</div>
          </div>
        </button>
        <p className="mt-3 max-w-[14rem] text-sm leading-6 text-white/62">
          {isLabsPage
            ? "Finance UI case-study map for quick scanning."
            : "Finance UI, Python data workflows, and browser prototypes for data-heavy product work."}
        </p>
      </div>

      {isLabsPage ? (
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="mb-2 rounded-[1.4rem] border border-cyan-300/20 bg-cyan-300/[0.055] p-3">
            <div className="font-mono text-[0.66rem] uppercase tracking-[0.32em] text-cyan-200/80">Lab map</div>
            <p className="mt-1 text-xs leading-5 text-white/56">8 finance-oriented cases, grouped by topic.</p>
          </div>

          <button
            onClick={() => handleNavigation("hero")}
            className="sidebar-item mb-2 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2 text-left transition-colors duration-300 hover:border-white/18 hover:bg-white/[0.06]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-cyan-200">
              <Home className="h-4 w-4" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-white">Back Home</span>
              <span className="text-[0.62rem] uppercase tracking-[0.24em] text-white/35">overview</span>
            </span>
          </button>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-hide">
            <button
              onClick={() => handleLabNavigation("top")}
              className={`sidebar-item mb-1.5 flex w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left transition-colors duration-300 ${
                activeLabSlug === "top"
                  ? "border-cyan-300/35 bg-cyan-300/10"
                  : "border-white/8 bg-white/[0.025] hover:border-cyan-400/25 hover:bg-cyan-400/8"
              }`}
            >
              <span className="grid h-7 w-7 place-items-center rounded-xl border border-white/8 bg-white/5 font-mono text-[0.6rem] text-cyan-100">
                00
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-white">Case Index</span>
                <span className="text-[0.58rem] uppercase tracking-[0.2em] text-white/35">overview</span>
              </span>
              <span className={`h-2 w-2 rounded-full ${activeLabSlug === "top" ? "bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" : "bg-white/15"}`} />
            </button>

            {projects.map((project, index) => {
              const active = activeLabSlug === project.slug;
              return (
                <button
                  key={project.slug}
                  onClick={() => handleLabNavigation(project.slug)}
                  className={`sidebar-item mb-1.5 flex w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left transition-colors duration-300 ${
                    active
                      ? "border-cyan-300/35 bg-cyan-300/10"
                      : "border-white/8 bg-white/[0.025] hover:border-cyan-400/25 hover:bg-cyan-400/8"
                  }`}
                >
                  <span
                    className="grid h-7 w-7 place-items-center rounded-xl border border-white/8 bg-white/5 font-mono text-[0.6rem] font-black"
                    style={{ color: project.accent }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.82rem] font-semibold text-white">{project.title}</span>
                    <span className="block truncate text-[0.58rem] uppercase tracking-[0.18em] text-white/35">{project.domain}</span>
                  </span>
                  <span className={`h-2 w-2 rounded-full ${active ? "bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" : "bg-white/15"}`} />
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={() => navigate("/labs")}
            className="sidebar-item relative z-10 mb-3 flex items-center gap-3 rounded-2xl border border-white/8 bg-cyan-300/[0.045] px-4 py-3 text-left transition-colors duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/8"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-cyan-200">
              <Code2 className="h-4 w-4" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-white">Finance Cases</span>
              <span className="text-xs uppercase tracking-[0.24em] text-white/35">case notes</span>
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </button>

          <nav className="relative z-10 flex flex-col gap-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className="sidebar-item group relative flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 text-left transition-colors duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/8"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-cyan-200 transition-transform duration-300 group-hover:scale-110 group-hover:bg-cyan-400/15">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-white">{item.label}</span>
                    <span className="text-xs uppercase tracking-[0.32em] text-white/35">{item.kicker}</span>
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${active ? "bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" : "bg-white/15 group-hover:bg-cyan-400"}`} />
                </button>
              );
            })}
          </nav>

          <div className="relative z-10 mt-5 rounded-[1.6rem] border border-white/10 bg-[#090c14]/90 p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.35em] text-white/45">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Usual tools
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[...skills.frontend, ...skills.backend, ...skills.data].slice(0, 8).map((skill) => (
                <span
                  key={skill}
                  className="stack-chip truncate rounded-full border border-white/8 bg-white/[0.04] px-3 py-2 text-xs text-white/72 transition-all duration-300 hover:border-cyan-400/25 hover:bg-cyan-400/10 hover:text-white"
                  title={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-auto rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.02] p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.35em] text-white/45">
              <Mail className="h-4 w-4 text-emerald-300" />
              Notes
            </div>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Good conversations usually start with a rough product edge, a slow workflow, or a screen that needs clearer states.
            </p>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
