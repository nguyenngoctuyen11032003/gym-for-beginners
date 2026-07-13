import type { WorkoutDay } from "@/src/types/workout";

export function getWorkoutDayForJsDay(dayNumber: number, plan: WorkoutDay[]) {
  if (!Number.isInteger(dayNumber) || dayNumber < 0 || dayNumber > 6) {
    return null;
  }

  return plan.find((day) => day.dayNumber === dayNumber) ?? null;
}

export function getCurrentWorkoutDay(plan: WorkoutDay[], date = new Date()) {
  return getWorkoutDayForJsDay(date.getDay(), plan);
}

export function findNextWorkoutDay(currentDayId: string, plan: WorkoutDay[]) {
  const startIndex = plan.findIndex((day) => day.id === currentDayId);

  if (startIndex < 0 || plan.length === 0) {
    return null;
  }

  for (let offset = 1; offset <= plan.length; offset += 1) {
    const candidate = plan[(startIndex + offset) % plan.length];

    if (!candidate.isRestDay && candidate.exercises.length > 0) {
      return candidate;
    }
  }

  return null;
}
