import { Dumbbell } from "lucide-react";
import { PageContainer } from "@/src/components/shared/page-container";

export function AppHeader() {
  return (
    <header className="border-b border-white/[0.07] bg-background/94">
      <PageContainer className="flex h-[68px] items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]">
            <Dumbbell aria-hidden="true" className="size-5" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-foreground">
              Gym Training Plan
            </p>
            <p className="truncate text-xs text-muted-foreground">Giáo án tập luyện 12 tuần</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:flex">
          <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
            Frontend tĩnh
          </span>
        </div>
      </PageContainer>
    </header>
  );
}
