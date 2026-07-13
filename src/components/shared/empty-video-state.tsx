import { VideoOff } from "lucide-react";

export function EmptyVideoState() {
  return (
    <div className="premium-card flex min-h-48 flex-col items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-white/[0.12] bg-white/[0.025] px-5 py-8 text-center shadow-[inset_0_1px_0_rgb(255_255_255/0.035)] sm:min-h-56">
      <span className="flex size-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] text-muted-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
        <VideoOff aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </span>
      <p className="mt-4 text-sm font-semibold text-foreground">Chưa có video hướng dẫn cho bài tập này.</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">Video sẽ được cập nhật sau.</p>
    </div>
  );
}
