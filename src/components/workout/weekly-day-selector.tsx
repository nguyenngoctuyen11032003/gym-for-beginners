"use client";

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
    <div
      aria-label="Chọn ngày tập luyện"
      className="scrollbar-none -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-0"
      role="tablist"
    >
      {plan.map((day) => {
        const isSelected = day.id === selectedDayId;
        const isToday = day.id === todayId;

        return (
          <button
            key={day.id}
            aria-selected={isSelected}
            className={cn(
              "flex min-h-[104px] min-w-[128px] snap-start flex-col gap-0 rounded-2xl border px-3.5 py-3 text-left transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-[0.98] lg:min-w-0",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isSelected
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-card text-foreground hover:border-border-strong hover:bg-card-elevated",
              day.isRestDay && !isSelected && "bg-transparent",
            )}
            onClick={() => onSelectDay(day.id)}
            role="tab"
            type="button"
          >
            <span className="whitespace-nowrap text-[15px] font-semibold">{day.shortLabel}</span>
            <span
              className={cn(
                "mt-1.5 line-clamp-2 text-xs leading-[1.45]",
                isSelected ? "text-accent-foreground/75" : "text-muted-foreground",
              )}
            >
              {day.isRestDay ? "Ngày nghỉ" : day.muscleGroups.join(", ")}
            </span>
            {isToday && (
              <span
                className={cn(
                  "mt-auto w-fit whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  isSelected ? "bg-accent-foreground/10 text-accent-foreground" : "bg-accent/15 text-accent",
                )}
              >
                Hôm nay
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
