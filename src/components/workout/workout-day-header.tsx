import type { WorkoutDay } from "@/src/types/workout";

export function WorkoutDayHeader({ day }: { day: WorkoutDay }) {
  const totalSets = day.exercises.reduce((sum, exercise) => sum + exercise.sets, 0);

  return (
    <header className="reveal-in mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{day.fullLabel}</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-[2rem] sm:leading-tight">
          {day.title}
        </h2>
        {day.description && <p className="mt-2 max-w-[60ch] text-sm leading-6 text-muted-foreground">{day.description}</p>}
      </div>
      {!day.isRestDay && (
        <p className="tabular shrink-0 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{day.exercises.length}</span> bài tập,{" "}
          <span className="font-semibold text-foreground">{totalSets}</span> set
        </p>
      )}
    </header>
  );
}
