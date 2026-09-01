import type { InputHTMLAttributes } from "react";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export default function Checkbox({ className = "", ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={`mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-blue-600 ${className}`}
      {...props}
    />
  );
}