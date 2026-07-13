"use client";

import { useState, useSyncExternalStore } from "react";
import { ExerciseGrid } from "@/src/components/workout/exercise-grid";
import { WeeklyDaySelector } from "@/src/components/workout/weekly-day-selector";
import { WorkoutDayHeader } from "@/src/components/workout/workout-day-header";
import { getCurrentWorkoutDay } from "@/src/lib/day-utils";
import type { WorkoutDay } from "@/src/types/workout";

interface WorkoutPlannerProps {
  plan: WorkoutDay[];
  initialDayId: string;
  initialTodayId: string;
}

const subscribeToNothing = () => () => {};

export function WorkoutPlanner({ plan, initialDayId, initialTodayId }: WorkoutPlannerProps) {
  const hydrated = useSyncExternalStore(subscribeToNothing, () => true, () => false);
  const localTodayId = useSyncExternalStore(
    subscribeToNothing,
    () => getCurrentWorkoutDay(plan)?.id ?? initialTodayId,
    () => initialTodayId,
  );
  const [manualDayId, setManualDayId] = useState<string | null>(null);
  const [, setSelectedExerciseId] = useState<string | null>(null);
  const selectedDayId = manualDayId ?? (hydrated ? localTodayId : initialDayId);
  const selectedDay = plan.find((day) => day.id === selectedDayId) ?? plan[0];

  if (!hydrated) {
    return (
      <section aria-busy="true" aria-label="Đang xác định lịch hôm nay" className="py-8">
        <div className="h-[118px] animate-pulse rounded-2xl border border-white/[0.06] bg-card" />
        <div className="mt-9 h-24 animate-pulse rounded-2xl bg-white/[0.035]" />
      </section>
    );
  }

  return (
    <section className="pt-7 sm:pt-9">
      <WeeklyDaySelector onSelectDay={setManualDayId} plan={plan} selectedDayId={selectedDay.id} todayId={localTodayId} />
      <WorkoutDayHeader day={selectedDay} />
      {!selectedDay.isRestDay && (
        <ExerciseGrid exercises={selectedDay.exercises} onSelectExercise={setSelectedExerciseId} />
      )}
    </section>
  );
}
