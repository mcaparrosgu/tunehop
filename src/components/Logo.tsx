/**
 * Logo / Wordmark de TuneHop
 * Una sola palabra: "Tune" + H (glifo diseñado, SIEMPRE ámbar, con barra voladora) + "op".
 * La H sustituye a la letra tipográfica: esa es la gracia del logo.
 * Variante wordmark: Tune[H]op en línea tipográfica.
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
    <span
      role="img"
      aria-label="TuneHop"
      className={className}
      {...(props as React.HTMLAttributes<HTMLSpanElement>)}
    >
      <span aria-hidden="true">Tune</span>
      {/* La H sustituye a la letra tipográfica dentro del nombre: SIEMPRE en ámbar.
          Más grande que el resto (~cap-height × 1.3) y apoyada en la línea base.
          Se sale por arriba: la protagonista del nombre. */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="inline-block h-[1em] w-[1em] align-baseline -mb-[0.06em] text-[var(--color-accent)]"
      >
        {GLIFO_PATH}
      </svg>
      <span aria-hidden="true">op</span>
    </span>
  );
}