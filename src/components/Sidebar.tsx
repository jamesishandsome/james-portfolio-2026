import { useLocation, useNavigate } from "react-router-dom";
import { Award, Briefcase, Code2, Home, Mail, PlusSquare, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { skills } from "../data/resume";

const navItems = [
  { id: "hero", label: "Home", icon: Home },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "playground", label: "Playground", icon: Code2 },
  { id: "skills", label: "Skills", icon: Award },
  { id: "contact", label: "Contact", icon: PlusSquare },
];

const Sidebar = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("hero");
  const navigate = useNavigate();
  const location = useLocation();

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

      <div className="sidebar-brand relative z-10 mb-6 rounded-[1.6rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <button
          onClick={() => handleNavigation("hero")}
          className="flex w-full items-center gap-3 text-left"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white text-lg font-black text-black shadow-[0_0_24px_rgba(255,255,255,0.25)]">
            JH
          </div>
          <div className="min-w-0">
            <div className="text-[0.68rem] uppercase tracking-[0.4em] text-cyan-300/80">James workroom</div>
            <div className="mt-1 text-xl font-black tracking-tight text-white">James Hu</div>
          </div>
        </button>
        <p className="mt-3 max-w-[14rem] text-sm leading-6 text-white/62">
          Notes from production UI work, backend glue, and the browser experiments I keep around.
        </p>
      </div>

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
                <span className="text-xs uppercase tracking-[0.32em] text-white/35">{item.id}</span>
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
          {[...skills.frontend, ...skills.backend].slice(0, 8).map((skill) => (
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
          Best conversations usually start with a rough product edge, a slow workflow, or an interface nobody wants to maintain.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
