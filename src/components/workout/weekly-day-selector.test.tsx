import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { workoutPlan } from "@/src/data/workout-plan";
import { WeeklyDaySelector } from "@/src/components/workout/weekly-day-selector";

describe("WeeklyDaySelector", () => {
  it("keeps the today badge when another day is selected", () => {
    render(
      <WeeklyDaySelector
        plan={workoutPlan}
        selectedDayId="tuesday"
        todayId="monday"
        onSelectDay={() => {}}
      />,
    );

    const monday = screen.getByRole("tab", { name: /Thứ 2/i });
    const tuesday = screen.getByRole("tab", { name: /Thứ 3/i });

    expect(within(monday).getByText("Hôm nay")).toBeInTheDocument();
    expect(monday).toHaveAttribute("aria-selected", "false");
    expect(tuesday).toHaveAttribute("aria-selected", "true");
    expect(tuesday).toHaveClass("selected-orbit");
  });
});
