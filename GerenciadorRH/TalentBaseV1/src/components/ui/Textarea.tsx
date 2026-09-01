import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...rest }, ref) => {
    const areaId = id ?? rest.name;
    return (
      <div>
        {label && (
          <label htmlFor={areaId} className="block text-xs font-medium mb-1.5 text-ink">
            {label}
          </label>
        )}
        <textarea ref={ref} id={areaId} className={`field resize-none ${className}`} {...rest} />
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
