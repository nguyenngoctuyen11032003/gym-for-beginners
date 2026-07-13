import Image from "next/image";
import { PageContainer } from "@/src/components/shared/page-container";

export function AppHeader() {
  return (
    <header className="border-b border-white/[0.07] bg-background/94">
      <PageContainer className="flex h-[68px] items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            alt=""
            className="size-10 shrink-0 rounded-[14px] object-cover shadow-[0_0_18px_rgb(197_244_103/0.08)]"
            height={40}
            priority
            sizes="40px"
            src="/image/logo.png"
            width={40}
          />
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
