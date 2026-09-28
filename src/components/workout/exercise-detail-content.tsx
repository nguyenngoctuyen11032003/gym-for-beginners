"use client";

import { Check, X } from "lucide-react";
import { MuscleBadge } from "@/src/components/shared/muscle-badge";
import { Button } from "@/src/components/ui/button";
import { DialogDescription, DialogTitle } from "@/src/components/ui/dialog";
import { DrawerDescription, DrawerTitle } from "@/src/components/ui/drawer";
import { ExerciseVideo } from "@/src/components/workout/exercise-video";
import { cn } from "@/src/lib/cn";
import type { Exercise } from "@/src/types/workout";

interface ExerciseDetailContentProps {
  exercise: Exercise;
  variant: "drawer" | "dialog";
  onClose: () => void;
}

export function ExerciseDetailContent({ exercise, variant, onClose }: ExerciseDetailContentProps) {
  const Title = variant === "dialog" ? DialogTitle : DrawerTitle;
  const Description = variant === "dialog" ? DialogDescription : DrawerDescription;
  const canSplit = variant === "dialog" && Boolean(exercise.video.embedUrl);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3.5 sm:px-6 sm:py-4">
        <div className="min-w-0 py-0.5">
          <Title className="truncate text-lg font-semibold tracking-[-0.02em] text-foreground sm:text-xl">
            {exercise.name}
          </Title>
          <Description className="mt-1 truncate text-sm text-muted-foreground">
            {exercise.vietnameseName ?? exercise.muscleGroups.join(", ")}
          </Description>
        </div>
        <Button
          aria-label="Đóng chi tiết bài tập"
          className="size-11 shrink-0 rounded-xl border border-border bg-transparent p-0 text-foreground shadow-none transition-[background-color,border-color,transform] duration-200 hover:border-border-strong hover:bg-muted hover:text-foreground active:scale-[0.96]"
          onClick={onClose}
          type="button"
          variant="ghost"
        >
          <X aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </Button>
      </div>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto p-4 sm:p-6",
          canSplit && "md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-8",
        )}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1.5">
            {exercise.muscleGroups.map((group) => <MuscleBadge key={group} label={group} />)}
          </div>

          <dl className="mt-5 grid grid-cols-2 divide-x divide-border rounded-2xl border border-border bg-card">
            <div className="px-4 py-3.5">
              <dt className="text-xs text-muted-foreground">Số set</dt>
              <dd className="tabular mt-1 text-2xl font-semibold tracking-[-0.02em] text-foreground">{exercise.sets}</dd>
            </div>
            <div className="min-w-0 px-4 py-3.5">
              <dt className="text-xs text-muted-foreground">Số rep</dt>
              <dd className="tabular mt-1 text-lg font-semibold leading-8 tracking-[-0.01em] text-foreground">{exercise.reps}</dd>
            </div>
          </dl>

          {exercise.description && <p className="mt-5 text-sm leading-6 text-muted-foreground">{exercise.description}</p>}

          {exercise.note && (
            <div className="mt-5 border-l-2 border-accent pl-4">
              <p className="text-xs font-semibold text-accent">Ghi chú</p>
              <p className="mt-1 text-sm leading-6 text-foreground/90">{exercise.note}</p>
            </div>
          )}

          {exercise.instructions && exercise.instructions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">Lưu ý kỹ thuật</h3>
              <ul className="mt-3 space-y-2.5">
                {exercise.instructions.map((instruction) => (
                  <li key={instruction} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                    <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent" strokeWidth={2} />
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <section className={cn("mt-8 min-w-0 border-t border-border pt-6", canSplit && "md:mt-0 md:border-t-0 md:pt-0")}>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Video hướng dẫn</h3>
          <ExerciseVideo video={exercise.video} />
        </section>
      </div>
    </div>
  );
}
