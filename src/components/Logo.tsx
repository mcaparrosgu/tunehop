/**
 * Logo / Glifo de TuneHop
 * El glifo nace de la 'h' de "hop": la pierna derecha se alarga, curva y aterriza en un punto preciso.
 * Variante wordmark: "TuneHop" + glifo a la derecha.
 * Variante compacta: solo glifo (favicon, avatar).
 */
import type { SVGProps } from "react";

interface LogoProps extends SVGProps<SVGSVGElement> {
  /** Variante: "wordmark" (nombre + glifo) | "glyph" (solo glifo) */
  variant?: "wordmark" | "glyph";
  /** Tamaño del glifo en px (para variante glyph) */
  size?: number;
  /** Color del glifo (hereda currentColor por defecto) */
  color?: "current" | "accent" | "fg" | "fg-inverse";
}

const GLIFO_PATH = (
  <path
    d="M12 24 C12 24 16 20 16 16 C16 12 12 8 8 8 C4 8 2 12 2 16 C2 20 6 24 12 24 Z"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const GLIFO_DOT = (
  <circle cx="12" cy="8" r="2.5" fill="currentColor" />
);

export default function Logo({
  variant = "wordmark",
  size = 24,
  color = "current",
  className = "",
  "aria-hidden": ariaHidden = "true",
  ...props
}: LogoProps) {
  const colorClass =
    color === "accent"
      ? "text-[var(--color-accent)]"
      : color === "fg"
      ? "text-[var(--color-fg)]"
      : color === "fg-inverse"
      ? "text-[var(--color-fg-inverse)]"
      : "";

  const glyphSize = `${size}px`;

  if (variant === "glyph") {
    return (
      <svg
        width={glyphSize}
        height={glyphSize}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden={ariaHidden}
        className={`flex-shrink-0 ${colorClass} ${className}`}
        {...props}
      >
        {GLIFO_PATH}
        {GLIFO_DOT}
      </svg>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} {...(props as React.HTMLAttributes<HTMLSpanElement>)}>
      <span className="text-display font-bold tracking-[0.02em]" aria-hidden="true">
        TuneHop
      </span>
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden={ariaHidden}
        className={`${colorClass} animate-hop`}
      >
        {GLIFO_PATH}
        {GLIFO_DOT}
      </svg>
    </span>
  );
}