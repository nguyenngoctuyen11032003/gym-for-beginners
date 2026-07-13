"use client";

import { useState } from "react";
import { EmptyVideoState } from "@/src/components/shared/empty-video-state";
import { Skeleton } from "@/src/components/ui/skeleton";
import { cn } from "@/src/lib/cn";
import { isValidYouTubeEmbedUrl } from "@/src/lib/video-utils";
import type { ExerciseVideo as ExerciseVideoType } from "@/src/types/workout";

export function ExerciseVideo({ video }: { video: ExerciseVideoType }) {
  const [loaded, setLoaded] = useState(false);

  if (!video.embedUrl || !isValidYouTubeEmbedUrl(video.embedUrl)) {
    return <EmptyVideoState />;
  }

  const portrait = video.aspectRatio === "9:16";

  return (
    <div
      className={cn(
        "relative mx-auto overflow-hidden rounded-[20px] border border-white/[0.1] bg-black",
        portrait ? "aspect-[9/16]" : "aspect-video w-full",
      )}
      style={portrait ? { width: "min(100%, calc(58dvh * 9 / 16))" } : undefined}
    >
      {!loaded && <Skeleton className="absolute inset-0 size-full rounded-none bg-white/[0.055]" />}
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 size-full"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        referrerPolicy="strict-origin-when-cross-origin"
        src={video.embedUrl}
        title={video.title ?? "Video hướng dẫn bài tập"}
      />
    </div>
  );
}
