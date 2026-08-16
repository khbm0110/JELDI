"use client";

import { useEffect, useState } from "react";

export default function StitchRail() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function update() {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(100, (scrolled / max) * 100) : 0);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed right-[18px] top-0 z-50 hidden h-screen w-[2px] md:block"
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: "linear-gradient(#D9C7A8 60%, transparent 0)",
          backgroundSize: "2px 10px"
        }}
      />
      <div
        className="absolute left-0 top-0 w-[2px] transition-[height] duration-100 ease-linear"
        style={{
          height: `${pct}%`,
          backgroundImage: "linear-gradient(#8B5A2B 60%, transparent 0)",
          backgroundSize: "2px 10px"
        }}
      />
    </div>
  );
}
