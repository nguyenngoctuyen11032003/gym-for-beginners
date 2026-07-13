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
  const canSplit = variant === "dialog" && exercise.video.aspectRatio === "16:9" && exercise.video.embedUrl;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="sticky top-0 z-[1] flex items-start justify-between gap-4 border-b border-white/[0.08] bg-card-elevated/88 px-4 py-3.5 shadow-[0_10px_32px_rgb(0_0_0/0.22)] backdrop-blur-xl sm:px-6">
        <div className="min-w-0 py-1">
          <Title className="truncate text-lg font-semibold tracking-[-0.035em] text-foreground sm:text-xl">
            {exercise.name}
          </Title>
          <Description className="mt-1 truncate text-xs text-muted-foreground">
            {exercise.vietnameseName ?? exercise.muscleGroups.join(", ")}
          </Description>
        </div>
        <Button
          aria-label="Đóng chi tiết bài tập"
          className="size-11 shrink-0 rounded-2xl border border-white/[0.1] bg-white/[0.04] p-0 text-foreground shadow-none transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-foreground active:translate-y-0 active:scale-[0.96]"
          onClick={onClose}
          type="button"
          variant="ghost"
        >
          <X aria-hidden="true" className="size-4" strokeWidth={1.8} />
        </Button>
      </div>

      <div className={cn("min-h-0 flex-1 overflow-y-auto p-4 sm:p-6", canSplit && "md:grid md:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)] md:gap-6")}>
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1.5">
            {exercise.muscleGroups.map((group) => <MuscleBadge key={group} label={group} />)}
          </div>

          {exercise.description && <p className="mt-4 text-sm leading-6 text-muted-foreground">{exercise.description}</p>}

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.035)]">
              <p className="text-xs text-muted-foreground">Số set</p>
              <p className="mt-1 font-mono text-xl font-semibold text-foreground">{exercise.sets}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.035)]">
              <p className="text-xs text-muted-foreground">Số rep</p>
              <p className="mt-1 font-mono text-sm font-semibold leading-6 text-foreground">{exercise.reps}</p>
            </div>
          </div>

          {exercise.note && (
            <div className="mt-4 rounded-2xl border border-accent/15 bg-accent/[0.055] p-4 shadow-[0_0_26px_rgb(197_244_103/0.045),inset_0_1px_0_rgb(255_255_255/0.035)]">
              <p className="text-xs font-semibold text-accent">Ghi chú</p>
              <p className="mt-1.5 text-sm leading-6 text-foreground/85">{exercise.note}</p>
            </div>
          )}

          {exercise.instructions && exercise.instructions.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-foreground">Lưu ý kỹ thuật</h3>
              <ul className="mt-3 space-y-2.5">
                {exercise.instructions.map((instruction) => (
                  <li key={instruction} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                    <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent" strokeWidth={1.8} />
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <section className={cn("mt-7 min-w-0 border-t border-white/[0.08] pt-6", canSplit && "md:mt-0 md:border-l md:border-t-0 md:pl-6 md:pt-0")}>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Video hướng dẫn</h3>
          <ExerciseVideo video={exercise.video} />
        </section>
      </div>
    </div>
  );
}
