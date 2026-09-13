import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  /** Si se pasa, el botón se renderiza como un enlace a esa ruta. */
  href?: string;
  /** Variante visual: "primary" (teal), "secondary" (outline), "destructive" (rojo). */
  variant?: "primary" | "secondary" | "destructive";
  /** Si es true, renderiza un enlace <a> nativo en lugar de <Link> (para OAuth externo). */
  external?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  href,
  variant = "primary",
  external = false,
  className = "",
  children,
  disabled = false,
  onClick,
  type = "button",
}: ButtonProps) {
  const baseClasses =
    variant === "secondary"
      ? "btn-secondary"
      : variant === "destructive"
      ? "btn-destructive"
      : "btn-primary";

  const combinedClass = `${baseClasses} ${className}`;

  // Si tiene href y no está desactivado, renderiza como enlace
  if (href && !disabled) {
    const linkProps: AnchorHTMLAttributes<HTMLAnchorElement> = {
      href,
      className: combinedClass,
      children,
      ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
    };
    if (external) {
      return <a {...linkProps} />;
    }
    return <Link href={href} className={combinedClass}>{children}</Link>;
  }

  // Si no, renderiza como button nativo
  return (
    <button
      className={combinedClass}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}