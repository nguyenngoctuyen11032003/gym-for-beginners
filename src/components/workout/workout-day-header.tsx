import { CalendarDays } from "lucide-react";
import type { WorkoutDay } from "@/src/types/workout";

export function WorkoutDayHeader({ day }: { day: WorkoutDay }) {
  return (
    <header className="reveal-in mt-9 flex flex-col gap-4 border-b border-white/[0.07] pb-6 sm:mt-11 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-accent">
          <CalendarDays aria-hidden="true" className="size-4" strokeWidth={1.8} />
          {day.fullLabel}
        </p>
        <h2 className="max-w-[24ch] text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl">{day.title}</h2>
        {day.description && <p className="mt-2 max-w-[60ch] text-sm leading-6 text-muted-foreground">{day.description}</p>}
      </div>
      <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-2 text-sm text-muted-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.035)]">
        <span className="font-mono text-base font-semibold text-foreground">{String(day.exercises.length).padStart(2, "0")}</span>
        <span>{day.isRestDay ? "bài tập" : "bài tập hôm nay"}</span>
      </div>
    </header>
  );
}
