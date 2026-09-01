import type { HTMLAttributes } from "react";

export function Card({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white border border-line rounded-sm ${className}`} {...rest}>
      {children}
    </div>
  );
}
