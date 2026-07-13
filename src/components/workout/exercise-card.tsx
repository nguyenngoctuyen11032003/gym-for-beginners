"use client";

import { ArrowUpRight, Dumbbell, Video, VideoOff } from "lucide-react";
import { MuscleBadge } from "@/src/components/shared/muscle-badge";
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
      className="group flex min-h-[238px] w-full flex-col rounded-[20px] border border-white/[0.08] bg-card p-4 text-left shadow-[inset_0_1px_0_rgb(255_255_255/0.035)] transition-[transform,border-color,background-color,box-shadow] duration-200 hover:border-white/[0.16] hover:bg-card-elevated hover:shadow-[0_14px_42px_rgb(4_8_3/0.28),inset_0_1px_0_rgb(255_255_255/0.05)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-5"
      onClick={() => onSelect(exercise.id)}
      type="button"
    >
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-medium text-muted-foreground">
            {String(index).padStart(2, "0")}
          </span>
          <span className="flex size-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-muted-foreground transition-colors duration-200 group-hover:text-accent">
            <Dumbbell aria-hidden="true" className="size-4" strokeWidth={1.8} />
          </span>
        </div>
        <span className={hasVideo ? "inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/[0.08] px-2.5 py-1 text-[11px] font-semibold text-accent" : "inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-[11px] font-medium text-muted-foreground"}>
          {hasVideo ? <Video aria-hidden="true" className="size-3" strokeWidth={1.8} /> : <VideoOff aria-hidden="true" className="size-3" strokeWidth={1.8} />}
          {hasVideo ? "Có video" : "Chưa có video"}
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-lg font-semibold tracking-[-0.035em] text-foreground sm:text-xl">{exercise.name}</h3>
        {exercise.vietnameseName && <p className="mt-1 text-sm text-muted-foreground">{exercise.vietnameseName}</p>}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {exercise.muscleGroups.map((group) => <MuscleBadge key={group} label={group} />)}
        </div>
      </div>

      <div className="mt-5 grid w-full grid-cols-[88px_minmax(0,1fr)] gap-2 rounded-2xl border border-white/[0.07] bg-black/15 p-3">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">Số set</p>
          <p className="mt-1 font-mono text-base font-semibold text-foreground">{exercise.sets} set</p>
        </div>
        <div className="border-l border-white/[0.08] pl-3">
          <p className="text-[11px] font-medium text-muted-foreground">Số rep</p>
          <p className="mt-1 font-mono text-sm font-semibold leading-5 text-foreground">{exercise.reps}</p>
        </div>
      </div>

      {exercise.note && <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">{exercise.note}</p>}

      <span className="mt-auto flex min-h-11 w-full items-end justify-between pt-4 text-sm font-semibold text-foreground">
        Xem hướng dẫn
        <ArrowUpRight aria-hidden="true" className="size-4 text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} />
      </span>
    </button>
  );
}
