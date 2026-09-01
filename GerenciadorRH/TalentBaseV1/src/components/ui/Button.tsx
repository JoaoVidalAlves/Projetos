import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-dark disabled:opacity-60",
  secondary: "border border-line text-ink hover:bg-paper disabled:opacity-60",
  ghost: "text-muted hover:text-ink hover:bg-paper disabled:opacity-60",
  danger: "text-danger hover:bg-danger-soft disabled:opacity-60",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-sm font-medium transition-colors ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
