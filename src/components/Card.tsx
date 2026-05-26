import { ArrowUpRight, Play } from "lucide-react";
import { type CSSProperties, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap, useGSAP } from "../lib/gsap";

type CardProps = {
  title: string;
  subtitle: string;
  type: "work" | "project";
  imageColor: string;
  description?: string;
  link?: string;
  logo?: string;
  accent?: string;
  period?: string;
  metric?: string;
};

const Card = ({
  title,
  subtitle,
  type,
  imageColor,
  description,
  link,
  logo,
  accent = "#67e8f9",
  period,
  metric,
}: CardProps) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);

  useGSAP(
    (_context, contextSafe) => {
      const card = cardRef.current;
      if (!card || !contextSafe) return;

      gsap.set(card, {
        transformPerspective: 900,
        transformOrigin: "center center",
      });
      gsap.to(".card-orbit-dot", {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 160%",
        stagger: { each: 1.2, from: "random" },
      });

      const handlePointerMove = contextSafe((event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 13;
        const rotateX = (0.5 - py) * 11;

        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          y: -10,
          scale: 1.018,
          duration: 0.55,
          overwrite: "auto",
        });
        gsap.to(card, {
          "--mx": `${px * 100}%`,
          "--my": `${py * 100}%`,
          duration: 0.25,
          overwrite: "auto",
        } as gsap.TweenVars);
        gsap.to(card.querySelector(".card-hover-icon"), {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          overwrite: "auto",
        });
      });

      const handlePointerLeave = contextSafe(() => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          y: 0,
          scale: 1,
          duration: 0.75,
          ease: "elastic.out(1, 0.65)",
          overwrite: "auto",
        });
        gsap.to(card.querySelector(".card-hover-icon"), {
          autoAlpha: 0,
          y: 12,
          scale: 0.85,
          duration: 0.28,
          overwrite: "auto",
        });
      });

      card.addEventListener("pointermove", handlePointerMove);
      card.addEventListener("pointerleave", handlePointerLeave);

      return () => {
        card.removeEventListener("pointermove", handlePointerMove);
        card.removeEventListener("pointerleave", handlePointerLeave);
      };
    },
    { scope: cardRef },
  );

  const handleClick = () => {
    if (!link) return;
    if (link.startsWith("http")) {
      window.open(link, "_blank", "noopener,noreferrer");
      return;
    }
    navigate(link);
  };

  const style = {
    "--accent": accent,
    "--mx": "50%",
    "--my": "50%",
  } as CSSProperties;

  return (
    <article
      ref={cardRef}
      style={style}
      onClick={handleClick}
      className={`orbital-card reveal-up group relative flex min-h-[22rem] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c1019]/86 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl will-change-transform ${link ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className="card-glare" aria-hidden="true" />
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[var(--accent)]/20 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative mb-4 h-44 overflow-hidden rounded-[1.45rem] border border-white/10 bg-black/40">
        <div className={`absolute inset-0 ${imageColor} opacity-90`} />
        <div className="absolute inset-0 card-circuit" aria-hidden="true" />
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.32em] text-white/75 backdrop-blur-md">
          {type === "work" ? "Role" : metric ?? "Lab"}
        </div>
        <span className="card-orbit-dot absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-white shadow-[0_0_18px_white]" aria-hidden="true" />
        <span className="card-orbit-dot absolute left-[52%] top-[48%] h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_18px_var(--accent)]" aria-hidden="true" />
        <div className="relative z-10 flex h-full items-center justify-center">
          {logo && !imgError ? (
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/12 bg-white/90 p-4 shadow-[0_16px_44px_rgba(0,0,0,0.28)]">
              <img
                src={logo}
                alt={title}
                className="max-h-full max-w-full object-contain"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="grid h-24 w-24 place-items-center rounded-3xl border border-white/15 bg-black/35 text-4xl shadow-[0_0_36px_rgba(255,255,255,0.15)] backdrop-blur-md">
              {type === "work" ? "▣" : "✦"}
            </div>
          )}
        </div>
        <div className="card-hover-icon invisible absolute bottom-4 right-4 z-20 translate-y-3 rounded-full bg-white p-3 text-black shadow-[0_14px_34px_rgba(0,0,0,0.35)]">
          {type === "project" ? <Play fill="black" className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-pretty text-xl font-black leading-tight tracking-tight text-white">{title}</h3>
            <p className="mt-1 text-sm font-semibold text-[var(--accent)]">{subtitle}</p>
          </div>
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_16px_var(--accent)]" />
        </div>
        {period && <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-white/38">{period}</p>}
        {description && <p className="mt-auto text-sm leading-6 text-white/62">{description}</p>}
      </div>
    </article>
  );
};

export default Card;
