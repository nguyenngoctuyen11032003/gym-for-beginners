import { VideoOff } from "lucide-react";

export function EmptyVideoState() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong px-5 py-8 text-center sm:min-h-56">
      <VideoOff aria-hidden="true" className="size-5 text-muted-foreground" strokeWidth={1.75} />
      <p className="mt-3 text-sm font-semibold text-foreground">Chưa có video hướng dẫn cho bài tập này.</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">Video sẽ được cập nhật sau.</p>
    </div>
  );
}
