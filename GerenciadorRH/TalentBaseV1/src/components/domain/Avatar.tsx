const PALETTE = [
  "bg-accent-soft text-accent-dark",
  "bg-violet-soft text-violet",
  "bg-amber-soft text-amber",
  "bg-info-soft text-info",
  "bg-teal-soft text-teal",
];

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const colorClass = PALETTE[name.charCodeAt(0) % PALETTE.length];
  const sizeClass = size === "lg" ? "w-14 h-14 text-base" : size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-semibold flex-shrink-0 ${sizeClass} ${colorClass}`}>
      {initials}
    </span>
  );
}
