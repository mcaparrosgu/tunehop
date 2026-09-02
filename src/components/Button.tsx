import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Si se pasa, el botón se renderiza como un enlace a esa ruta. */
  href?: string;
  /** Variante visual: "primary" (azul) o "outline" (borde gris). */
  variant?: "primary" | "outline";
};

const primaryClasses =
  "inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:pointer-events-none disabled:bg-zinc-300 disabled:text-zinc-500";

const outlineClasses =
  "inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:pointer-events-none disabled:bg-zinc-50 disabled:text-zinc-300 disabled:border-zinc-200";

export default function Button({ href, variant = "primary", className = "", children, ...props }: ButtonProps) {
  const baseClasses = variant === "outline" ? outlineClasses : primaryClasses;
  // Mientras está desactivado, ignoramos el href: el botón no debe navegar.
  if (href && !props.disabled) {
    return (
      <Link href={href} className={`${baseClasses} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}