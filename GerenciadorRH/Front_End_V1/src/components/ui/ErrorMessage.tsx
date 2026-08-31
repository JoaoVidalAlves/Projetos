import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

export function ErrorMessage({ title, description, icon }: { title: string; description?: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center px-4">
      {icon ?? <AlertTriangle size={32} className="text-danger opacity-60 mb-1" />}
      <p className="text-sm font-medium text-ink">{title}</p>
      {description && <p className="text-xs text-muted max-w-xs">{description}</p>}
    </div>
  );
}
