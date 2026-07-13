import { describe, expect, it } from "vitest";
import { workoutPlan } from "@/src/data/workout-plan";
import { findNextWorkoutDay, getWorkoutDayForJsDay } from "@/src/lib/day-utils";

describe("getWorkoutDayForJsDay", () => {
  it.each([
    [0, "sunday"],
    [1, "monday"],
    [2, "tuesday"],
    [3, "wednesday"],
    [4, "thursday"],
    [5, "friday"],
    [6, "saturday"],
  ])("maps JavaScript day %i to %s", (dayNumber, id) => {
    expect(getWorkoutDayForJsDay(dayNumber, workoutPlan)?.id).toBe(id);
  });

  it("returns null for an invalid JavaScript day", () => {
    expect(getWorkoutDayForJsDay(7, workoutPlan)).toBeNull();
  });
});

describe("findNextWorkoutDay", () => {
  it("moves Saturday to Monday", () => {
    expect(findNextWorkoutDay("saturday", workoutPlan)?.id).toBe("monday");
  });

  it("wraps Sunday to Monday", () => {
    expect(findNextWorkoutDay("sunday", workoutPlan)?.id).toBe("monday");
  });

  it("terminates safely when every day is a rest day", () => {
    const allRest = workoutPlan.map((day) => ({ ...day, isRestDay: true, exercises: [] }));
    expect(findNextWorkoutDay("monday", allRest)).toBeNull();
  });
});
