import { type ReactNode, useRef } from "react";
import Sidebar from "./Sidebar";
import { gsap, useGSAP } from "../lib/gsap";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const shellRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".site-main",
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.45,
          clearProps: "visibility,opacity",
        },
      );
    },
    { scope: shellRef },
  );

  return (
    <div ref={shellRef} className="site-shell flex h-screen overflow-hidden bg-[#030406] text-white">
      <Sidebar />
      <main className="site-main relative m-2 flex-1 overflow-y-auto overflow-x-hidden rounded-[2rem] border border-white/10 bg-[#07090f] shadow-[0_0_80px_rgba(52,211,255,0.10)] scrollbar-hide">
        <div className="scanline-overlay" aria-hidden="true" />
        <div className="main-aurora" aria-hidden="true" />
        <div className="relative z-10 px-4 py-5 pb-28 sm:px-7 lg:px-10">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
