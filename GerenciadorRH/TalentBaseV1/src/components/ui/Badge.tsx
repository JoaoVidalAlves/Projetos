import type { ReactNode } from "react";

export function Badge({ className = "", dotClassName, children }: { className?: string; dotClassName?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-medium whitespace-nowrap ${className}`}>
      {dotClassName && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClassName}`} />}
      {children}
    </span>
  );
}
