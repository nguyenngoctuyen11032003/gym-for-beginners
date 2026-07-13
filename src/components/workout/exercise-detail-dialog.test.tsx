import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExerciseDetailDialog } from "@/src/components/workout/exercise-detail-dialog";
import type { Exercise } from "@/src/types/workout";

const { mockUseMediaQuery } = vi.hoisted(() => ({
  mockUseMediaQuery: vi.fn(),
}));

vi.mock("@/src/hooks/use-media-query", () => ({
  useMediaQuery: mockUseMediaQuery,
}));

const exercise: Exercise = {
  id: "incline-bench-press",
  name: "Incline Bench Press",
  vietnameseName: "Đẩy ngực dốc lên",
  muscleGroups: ["Ngực trên"],
  sets: 4,
  reps: "14 / 12 / 10 / 8",
  instructions: ["Giữ bả vai ổn định."],
  video: {
    embedUrl: "https://www.youtube.com/embed/8fXfwG4ftaQ",
    title: "Incline press",
    aspectRatio: "9:16",
  },
};

describe("ExerciseDetailDialog", () => {
  beforeEach(() => mockUseMediaQuery.mockReset());

  it("mounts only the drawer on mobile", () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(<ExerciseDetailDialog exercise={exercise} open onOpenChange={() => {}} />);

    expect(screen.getByTestId("exercise-drawer")).toBeInTheDocument();
    expect(screen.queryByTestId("exercise-dialog")).not.toBeInTheDocument();
  });

  it("mounts only the dialog on desktop", () => {
    mockUseMediaQuery.mockReturnValue(true);
    render(<ExerciseDetailDialog exercise={exercise} open onOpenChange={() => {}} />);

    expect(screen.getByTestId("exercise-dialog")).toBeInTheDocument();
    expect(screen.queryByTestId("exercise-drawer")).not.toBeInTheDocument();
  });

  it("does not mount an iframe while closed", () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(<ExerciseDetailDialog exercise={exercise} open={false} onOpenChange={() => {}} />);

    expect(screen.queryByTitle("Incline press")).not.toBeInTheDocument();
  });
});
