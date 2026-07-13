"use client";

import { ArrowRight, Footprints, HeartPulse } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { findNextWorkoutDay } from "@/src/lib/day-utils";
import type { WorkoutDay } from "@/src/types/workout";

interface RestDayCardProps {
  day: WorkoutDay;
  plan: WorkoutDay[];
  onSelectDay: (dayId: string) => void;
}

export function RestDayCard({ day, plan, onSelectDay }: RestDayCardProps) {
  const nextWorkoutDay = findNextWorkoutDay(day.id, plan);
  const actionLabel = day.id === "sunday" ? "Xem trước lịch Thứ 2" : "Xem lịch ngày tập tiếp theo";

  return (
    <section className="premium-card reveal-in mt-5 overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.025] p-5 shadow-[0_18px_52px_rgb(0_0_0/0.22),inset_0_1px_0_rgb(255_255_255/0.035)] sm:p-7">
      <div className="flex max-w-2xl flex-col items-start">
        <span className="flex size-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] text-muted-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
          <HeartPulse aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </span>
        <h3 className="mt-5 text-xl font-semibold tracking-[-0.035em] text-foreground">Phục hồi để tập tốt hơn</h3>
        <p className="mt-2 max-w-[56ch] text-sm leading-6 text-muted-foreground">
          Nghỉ ngơi, giãn cơ nhẹ hoặc đi bộ. Ưu tiên ngủ đủ và bổ sung nước để cơ thể sẵn sàng cho buổi tập tiếp theo.
        </p>
        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Footprints aria-hidden="true" className="size-4" strokeWidth={1.8} />
          Vận động nhẹ, không cần tập nặng
        </div>
        <Button
          className="mt-6 min-h-11 rounded-2xl bg-accent px-4 font-semibold text-accent-foreground shadow-[0_12px_28px_rgb(197_244_103/0.12)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-[0_16px_36px_rgb(197_244_103/0.16)] active:translate-y-0 active:scale-[0.985]"
          disabled={!nextWorkoutDay}
          onClick={() => nextWorkoutDay && onSelectDay(nextWorkoutDay.id)}
          type="button"
        >
          {actionLabel}
          <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.8} />
        </Button>
      </div>
    </section>
  );
}
