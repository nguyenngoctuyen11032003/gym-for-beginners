import Image from "next/image";
import { PageContainer } from "@/src/components/shared/page-container";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <PageContainer className="flex h-16 items-center gap-3">
        <Image
          alt=""
          className="size-9 shrink-0 rounded-xl object-cover"
          height={36}
          priority
          sizes="36px"
          src="/image/logo.png"
          width={36}
        />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">Gym Training Plan</p>
          <p className="truncate text-xs text-muted-foreground">Giáo án tập luyện 12 tuần</p>
        </div>
      </PageContainer>
    </header>
  );
}
