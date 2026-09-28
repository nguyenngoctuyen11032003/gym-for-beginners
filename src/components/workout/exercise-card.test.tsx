import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ExerciseCard } from "@/src/components/workout/exercise-card";
import type { Exercise } from "@/src/types/workout";

const exercise: Exercise = {
  id: "incline-bench-press",
  name: "Incline Bench Press",
  vietnameseName: "Đẩy ngực dốc lên",
  muscleGroups: ["Ngực trên"],
  sets: 4,
  reps: "14 / 12 / 10 / 8",
  video: {
    embedUrl: "https://www.youtube.com/embed/8fXfwG4ftaQ",
    title: "Incline press",
    aspectRatio: "9:16",
  },
};

describe("ExerciseCard", () => {
  it("makes the complete card actionable and keeps key metrics visible", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ExerciseCard exercise={exercise} index={1} onSelect={onSelect} />);

    const card = screen.getByRole("button", { name: /Incline Bench Press/i });
    expect(card).toHaveTextContent("4 set");
    expect(card).toHaveTextContent("14 / 12 / 10 / 8");
    expect(card).toHaveTextContent("Có video");
    expect(card).toHaveTextContent("Xem hướng dẫn");

    await user.click(card);
    expect(onSelect).toHaveBeenCalledWith("incline-bench-press");
  });
});
