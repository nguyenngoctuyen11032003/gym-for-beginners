import { PageContainer } from "@/src/components/shared/page-container";

export function AppFooter() {
  return (
    <footer className="mt-16 border-t border-border py-6 sm:mt-24">
      <PageContainer className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Gym Training Plan, chương trình 12 tuần</p>
        <p>Ưu tiên đúng kỹ thuật trước khi tăng mức tạ.</p>
      </PageContainer>
    </footer>
  );
}
