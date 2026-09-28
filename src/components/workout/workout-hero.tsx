import { Clock3, TimerReset } from "lucide-react";

const restGuides = [
  { label: "Nghỉ giữa set", value: "45-60 giây", icon: Clock3 },
  { label: "Nghỉ giữa bài", value: "3-5 phút", icon: TimerReset },
];

export function WorkoutHero() {
  return (
    <section className="grid gap-6 border-b border-border pb-8 pt-8 sm:pt-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12 md:pb-10">
      <div className="min-w-0">
        <h1 className="text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground">
          Lịch tập trong tuần
        </h1>
        <p className="mt-3 max-w-[46ch] text-[15px] leading-6 text-muted-foreground">
          Chọn một ngày để xem bài tập, số set, số rep và video hướng dẫn.
        </p>
      </div>

      <dl className="grid grid-cols-2 divide-x divide-border rounded-2xl border border-border bg-card md:w-[360px]">
        {restGuides.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex min-w-0 items-center gap-3 px-4 py-3.5">
            <Icon aria-hidden="true" className="size-4 shrink-0 text-accent" strokeWidth={1.75} />
            <div className="min-w-0">
              <dt className="truncate text-xs text-muted-foreground">{label}</dt>
              <dd className="tabular mt-0.5 truncate text-[15px] font-semibold text-foreground">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
