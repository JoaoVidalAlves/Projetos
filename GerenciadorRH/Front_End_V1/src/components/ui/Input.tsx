import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  dark?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, dark, className = "", id, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div>
        {label && (
          <label htmlFor={inputId} className={`block text-xs font-medium mb-1.5 ${dark ? "text-white/70" : "text-ink"}`}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={
            dark
              ? `w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-accent transition-colors ${className}`
              : `field ${className}`
          }
          {...rest}
        />
        {error && <p className={`mt-1 text-xs ${dark ? "text-red-400" : "text-danger"}`}>{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
