import { describe, expect, it } from "vitest";
import { workoutPlan } from "@/src/data/workout-plan";

describe("workoutPlan", () => {
  it("contains all seven days in JavaScript weekday order", () => {
    expect(workoutPlan.map((day) => day.dayNumber)).toEqual([1, 2, 3, 4, 5, 6, 0]);
    expect(workoutPlan.map((day) => day.exercises.length)).toEqual([7, 7, 7, 7, 8, 0, 0]);
  });

  it("marks only Saturday and Sunday as rest days", () => {
    expect(workoutPlan.filter((day) => day.isRestDay).map((day) => day.id)).toEqual([
      "saturday",
      "sunday",
    ]);
  });

  it("assigns the supplied video only to incline bench press", () => {
    const exercises = workoutPlan.flatMap((day) => day.exercises);
    const withVideo = exercises.filter((exercise) => exercise.video.embedUrl !== null);

    expect(withVideo).toHaveLength(1);
    expect(withVideo[0]).toMatchObject({
      id: "incline-bench-press",
      video: {
        embedUrl: "https://www.youtube.com/embed/8fXfwG4ftaQ",
        title: "The PERFECT Incline Dumbbell Chest Press",
        aspectRatio: "9:16",
      },
    });
  });
});
