import { PageContainer } from "@/src/components/shared/page-container";

export function AppFooter() {
  return (
    <footer className="mt-14 border-t border-white/[0.07] py-7 sm:mt-20">
      <PageContainer className="flex flex-col gap-1.5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Gym Training Plan · Chương trình 12 tuần</p>
        <p>Dữ liệu giáo án được lưu trực tiếp trong source code.</p>
      </PageContainer>
    </footer>
  );
}
