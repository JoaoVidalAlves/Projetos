import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  dark?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, dark, placeholder, className = "", id, children, ...rest }, ref) => {
    const selectId = id ?? rest.name;
    return (
      <div>
        {label && (
          <label htmlFor={selectId} className={`block text-xs font-medium mb-1.5 ${dark ? "text-white/70" : "text-ink"}`}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={
            dark
              ? `w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2.5 text-sm text-white outline-none focus:border-accent transition-colors appearance-none ${className}`
              : `field ${className}`
          }
          {...rest}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {children}
        </select>
        {error && <p className={`mt-1 text-xs ${dark ? "text-red-400" : "text-danger"}`}>{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
