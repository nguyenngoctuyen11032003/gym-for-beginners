"use client";

import { ArrowRight, CirclePlay, VideoOff } from "lucide-react";
import { MuscleBadge } from "@/src/components/shared/muscle-badge";
import { cn } from "@/src/lib/cn";
import { isValidYouTubeEmbedUrl } from "@/src/lib/video-utils";
import type { Exercise } from "@/src/types/workout";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  onSelect: (exerciseId: string) => void;
}

export function ExerciseCard({ exercise, index, onSelect }: ExerciseCardProps) {
  const hasVideo = Boolean(exercise.video.embedUrl && isValidYouTubeEmbedUrl(exercise.video.embedUrl));

  return (
    <button
      aria-label={`Xem hướng dẫn ${exercise.name}`}
      className="group flex h-full w-full flex-col rounded-2xl border border-border bg-card p-4 text-left transition-[border-color,background-color,transform] duration-200 ease-out hover:border-border-strong hover:bg-card-elevated active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-5"
      onClick={() => onSelect(exercise.id)}
      type="button"
    >
      <div className="flex w-full items-start gap-3.5">
        <span className="tabular flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-semibold text-muted-foreground">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.02em] text-foreground sm:text-lg">{exercise.name}</h3>
          {exercise.vietnameseName && <p className="mt-0.5 text-sm text-muted-foreground">{exercise.vietnameseName}</p>}
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 pt-0.5 text-xs font-medium",
            hasVideo ? "text-accent" : "text-muted-foreground",
          )}
        >
          {hasVideo ? (
            <CirclePlay aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
          ) : (
            <VideoOff aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
          )}
          {hasVideo ? "Có video" : "Chưa có video"}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 pl-[46px]">
        {exercise.muscleGroups.map((group) => <MuscleBadge key={group} label={group} />)}
      </div>

      <dl className="mt-4 grid w-full grid-cols-[auto_minmax(0,1fr)] gap-x-6 border-t border-border pt-4">
        <div>
          <dt className="text-xs text-muted-foreground">Số set</dt>
          <dd className="tabular mt-1 text-xl font-semibold tracking-[-0.02em] text-foreground">{exercise.sets} set</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Số rep</dt>
          <dd className="tabular mt-1 text-xl font-semibold tracking-[-0.02em] text-foreground">{exercise.reps}</dd>
        </div>
      </dl>

      {exercise.note && <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{exercise.note}</p>}

      <span className="mt-auto flex w-full items-center justify-between pt-4 text-sm font-medium text-foreground">
        Xem hướng dẫn
        <ArrowRight
          aria-hidden="true"
          className="size-4 text-muted-foreground transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
          strokeWidth={1.75}
        />
      </span>
    </button>
  );
}
