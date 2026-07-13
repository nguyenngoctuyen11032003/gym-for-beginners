import { Clock3, Dumbbell, TimerReset } from "lucide-react";

const restMetrics = [
  {
    label: "Nghỉ giữa set",
    value: "45-60 giây",
    icon: Clock3,
  },
  {
    label: "Nghỉ giữa bài",
    value: "3-5 phút",
    icon: TimerReset,
  },
];

export function WorkoutHero() {
  return (
    <section className="grid min-h-[232px] items-center gap-6 border-b border-white/[0.07] py-7 sm:min-h-[250px] sm:py-9 md:grid-cols-[minmax(0,1fr)_minmax(330px,0.72fr)] md:gap-10">
      <div className="min-w-0">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.08] px-3 py-1.5 text-xs font-semibold text-accent">
          <Dumbbell aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
          Chương trình 12 tuần
        </div>
        <h1 className="max-w-[14ch] text-[clamp(2rem,8vw,3.25rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-foreground">
          Lịch tập trong tuần
        </h1>
        <p className="mt-3 max-w-[42ch] text-sm leading-6 text-muted-foreground sm:text-base">
          Chọn một ngày để xem bài tập và video hướng dẫn.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {restMetrics.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="min-w-0 rounded-2xl border border-white/[0.08] bg-card px-3.5 py-3.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.035)] sm:px-4 sm:py-4"
          >
            <Icon aria-hidden="true" className="mb-4 size-4 text-accent" strokeWidth={1.8} />
            <p className="text-[11px] leading-4 text-muted-foreground sm:text-xs">{label}</p>
            <p className="mt-0.5 truncate text-sm font-semibold tracking-[-0.02em] text-foreground sm:text-base">
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
