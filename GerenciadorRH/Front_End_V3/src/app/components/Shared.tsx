import type { Status, JobStatus } from "../types";
import { STATUS_CONFIG, JOB_STATUS_CONFIG } from "../data";

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const colors = ["bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-amber-100 text-amber-700", "bg-emerald-100 text-emerald-700", "bg-rose-100 text-rose-700"];
  const idx = name.charCodeAt(0) % colors.length;
  const sz = size === "lg" ? "w-14 h-14 text-base" : size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-semibold flex-shrink-0 ${sz} ${colors[idx]}`}>
      {initials}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const cfg = JOB_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {status}
    </span>
  );
}

export function ModalityBadge({ modality }: { modality: string }) {
  const colors: Record<string, string> = {
    Presencial: "bg-orange-50 text-orange-700",
    Híbrido: "bg-purple-50 text-purple-700",
    Remoto: "bg-teal-50 text-teal-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-medium ${colors[modality] ?? "bg-muted text-muted-foreground"}`}>
      {modality}
    </span>
  );
}
