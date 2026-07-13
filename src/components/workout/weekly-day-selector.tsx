"use client";

import { BedDouble, Dumbbell } from "lucide-react";
import { cn } from "@/src/lib/cn";
import type { WorkoutDay } from "@/src/types/workout";

interface WeeklyDaySelectorProps {
  plan: WorkoutDay[];
  selectedDayId: string;
  todayId: string;
  onSelectDay: (dayId: string) => void;
}

export function WeeklyDaySelector({ plan, selectedDayId, todayId, onSelectDay }: WeeklyDaySelectorProps) {
  return (
    <div aria-label="Chọn ngày tập luyện" className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-0" role="tablist">
      {plan.map((day) => {
        const isSelected = day.id === selectedDayId;
        const isToday = day.id === todayId;
        const StatusIcon = day.isRestDay ? BedDouble : Dumbbell;

        return (
          <button
            key={day.id}
            aria-selected={isSelected}
            className={cn(
              "premium-card group relative min-h-[118px] min-w-[148px] snap-start overflow-hidden rounded-2xl border bg-card px-3.5 py-3 text-left transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out active:scale-[0.98] lg:min-w-0",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isSelected ? "selected-orbit border-accent/70 bg-card-elevated shadow-[0_0_22px_rgb(197_244_103/0.075),0_14px_42px_rgb(0_0_0/0.22),inset_0_1px_0_rgb(255_255_255/0.06)]" : "border-white/[0.08] hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-card-elevated",
              day.isRestDay && !isSelected && "bg-white/[0.025] text-muted-foreground",
            )}
            onClick={() => onSelectDay(day.id)}
            role="tab"
            type="button"
          >
            <div className="flex items-start justify-between gap-2">
              <span className={cn("text-sm font-semibold", isSelected ? "text-accent" : "text-foreground")}>
                {day.shortLabel}
              </span>
              <span className={cn("orbit-dot flex size-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035]", isSelected && "border-accent/30 bg-accent/[0.09]")}>
                <StatusIcon aria-hidden="true" className={cn("size-4", isSelected ? "text-accent" : "text-muted-foreground")} strokeWidth={1.8} />
              </span>
            </div>
            <p className="mt-4 line-clamp-2 text-xs leading-[1.45] text-muted-foreground">
              {day.isRestDay ? "Phục hồi" : day.muscleGroups.join(" · ")}
            </p>
            <div className="mt-3 flex min-h-5 items-center gap-1.5">
              {isToday && <span className="rounded-full border border-white/[0.1] bg-white/[0.055] px-2 py-0.5 text-[11px] font-semibold text-foreground">Hôm nay</span>}
              {isSelected && <span className="text-[11px] font-semibold text-accent">Đang chọn</span>}
              {day.isRestDay && !isToday && !isSelected && <span className="text-[11px] font-medium text-muted-foreground">Ngày nghỉ</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
