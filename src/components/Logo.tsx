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
  <>
    {/* Palos de la H */}
    <path d="M4 3 V21" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M20 3 V21" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    {/* Barra de la H saliendo volando por encima */}
    <path d="M4 12 Q12 2 20 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </>
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
      </svg>
    </span>
  );
}