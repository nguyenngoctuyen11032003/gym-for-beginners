import { cn } from "@/src/lib/cn";

export function MuscleBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-muted-foreground", className)}>
      {label}
    </span>
  );
}
