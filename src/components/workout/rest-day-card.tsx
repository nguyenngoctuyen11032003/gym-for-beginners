"use client";

import { ArrowRight, Footprints, Moon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { findNextWorkoutDay } from "@/src/lib/day-utils";
import type { WorkoutDay } from "@/src/types/workout";

interface RestDayCardProps {
  day: WorkoutDay;
  plan: WorkoutDay[];
  onSelectDay: (dayId: string) => void;
}

const recoveryTips = [
  { icon: Footprints, text: "Đi bộ nhẹ hoặc giãn cơ 15-20 phút" },
  { icon: Moon, text: "Ngủ đủ giấc và uống đủ nước" },
];

export function RestDayCard({ day, plan, onSelectDay }: RestDayCardProps) {
  const nextWorkoutDay = findNextWorkoutDay(day.id, plan);
  const actionLabel = day.id === "sunday" ? "Xem trước lịch Thứ 2" : "Xem lịch ngày tập tiếp theo";

  return (
    <section className="reveal-in mt-6 rounded-2xl border border-border bg-card p-5 sm:p-7">
      <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">Phục hồi để tập tốt hơn</h3>
      <p className="mt-2 max-w-[56ch] text-sm leading-6 text-muted-foreground">
        Cơ bắp phát triển trong lúc nghỉ. Hôm nay không cần tập nặng, hãy để cơ thể sẵn sàng cho buổi tiếp theo.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {recoveryTips.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm text-foreground">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
            </span>
            {text}
          </li>
        ))}
      </ul>
      <Button
        className="mt-6 h-11 rounded-xl bg-accent px-4 font-semibold text-accent-foreground shadow-none transition-[background-color,transform] duration-200 hover:bg-accent/90 active:scale-[0.98]"
        disabled={!nextWorkoutDay}
        onClick={() => nextWorkoutDay && onSelectDay(nextWorkoutDay.id)}
        type="button"
      >
        {actionLabel}
        <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
      </Button>
    </section>
  );
}
