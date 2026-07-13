import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { WorkoutPlanner } from "@/src/components/workout/workout-planner";
import { workoutPlan } from "@/src/data/workout-plan";
import type { WorkoutDay } from "@/src/types/workout";

vi.mock("@/src/lib/day-utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/src/lib/day-utils")>();
  return {
    ...actual,
    getCurrentWorkoutDay: (plan: WorkoutDay[]) => plan.find((day) => day.id === "monday") ?? null,
  };
});

function renderPlanner() {
  return render(
    <WorkoutPlanner
      initialDayId="monday"
      initialTodayId="monday"
      plan={workoutPlan}
    />,
  );
}

describe("WorkoutPlanner", () => {
  it("replaces the stable server skeleton after hydration", async () => {
    const markup = renderToString(
      <WorkoutPlanner initialDayId="monday" initialTodayId="monday" plan={workoutPlan} />,
    );
    const container = document.createElement("div");
    container.innerHTML = markup;
    document.body.appendChild(container);

    expect(container.querySelector("[aria-busy='true']")).toBeInTheDocument();
    const root = hydrateRoot(
      container,
      <WorkoutPlanner initialDayId="monday" initialTodayId="monday" plan={workoutPlan} />,
    );

    await waitFor(() => {
      expect(within(container).getByRole("tablist")).toBeInTheDocument();
    });
    root.unmount();
    container.remove();
  });

  it("closes the previous exercise detail when the day changes", async () => {
    const user = userEvent.setup();
    renderPlanner();
    await screen.findByRole("tablist");

    await user.click(screen.getByRole("button", { name: /Xem hướng dẫn Bench Press/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /Thứ 3/i, hidden: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Thứ 3/i })).toHaveAttribute("aria-selected", "true");
  });

  it("does not render the exercise grid on a rest day", async () => {
    renderPlanner();
    await screen.findByRole("tablist");
    fireEvent.click(screen.getByRole("tab", { name: /Thứ 7/i }));

    expect(screen.queryByTestId("exercise-grid")).not.toBeInTheDocument();
    expect(screen.getByText("Ngày nghỉ phục hồi")).toBeInTheDocument();
  });

  it("moves Sunday directly to Monday", async () => {
    const user = userEvent.setup();
    renderPlanner();
    await screen.findByRole("tablist");
    await user.click(screen.getByRole("tab", { name: /CN/i }));
    await user.click(screen.getByRole("button", { name: "Xem trước lịch Thứ 2" }));

    expect(screen.getByRole("tab", { name: /Thứ 2/i })).toHaveAttribute("aria-selected", "true");
  });
});
