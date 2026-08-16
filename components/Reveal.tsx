"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal — lightweight scroll-triggered fade/slide-up animation.
 *
 * Implements UI/UX Pro Max "Scroll Reveal / Subtle" guidance:
 *   - duration 350ms, ease power1.out (cubic-bezier(0.22,1,0.36,1) approximation)
 *   - small y offset (16px) so it reads as fade, not slide
 *   - prefers-reduced-motion: render final state immediately, no transform
 *   - threshold 0.15 + once-only: does not re-trigger on every scroll
 *
 * Usage:
 *   <Reveal>           // default fade-up
 *   <Reveal variant="fade">   // opacity only
 *   <Reveal variant="left">   // slide-in from left
 *   <Reveal delay={120}>      // ms delay for stagger
 *   <Reveal as="li">          // render as different tag
 */
type Variant = "up" | "fade" | "left" | "right" | "scale";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

const OFFSET: Record<Variant, string> = {
  up: "translate3d(0, 16px, 0)",
  fade: "translate3d(0, 0, 0)",
  left: "translate3d(-24px, 0, 0)",
  right: "translate3d(24px, 0, 0)",
  scale: "scale(0.97)"
};

export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration = 600,
  className = "",
  as = "div"
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced motion: render final state immediately
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setVisible(true);
      return;
    }

    // Fallback: if IntersectionObserver is unavailable, show content
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

  const Tag = as as any;

  const style: React.CSSProperties = {
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDelay: `${delay}ms`,
    willChange: "opacity, transform"
  };

  if (!visible) {
    return (
      <Tag
        ref={ref as any}
        className={className}
        style={{
          ...style,
          opacity: 0,
          transform: OFFSET[variant]
        }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as any}
      className={className}
      style={{
        ...style,
        opacity: 1,
        transform: "translate3d(0, 0, 0) scale(1)"
      }}
    >
      {children}
    </Tag>
  );
}
