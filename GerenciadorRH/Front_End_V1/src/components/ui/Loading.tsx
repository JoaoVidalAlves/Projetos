import { Loader2 } from "lucide-react";

export function Loading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted">
      <Loader2 size={22} className="animate-spin text-accent" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
