import type { InputHTMLAttributes, ChangeEvent } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "checked"> & {
  checked: boolean;
  onChange?: (checked: boolean) => void;
};

export default function Checkbox({
  className = "",
  checked,
  onChange,
  ...props
}: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={`mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-blue-600 ${className}`}
      checked={checked}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.checked)}
      {...props}
    />
  );
}