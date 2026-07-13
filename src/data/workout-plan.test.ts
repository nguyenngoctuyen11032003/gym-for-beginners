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

  it("assigns the supplied videos to matching exercise entries", () => {
    const exercises = workoutPlan.flatMap((day) => day.exercises);
    const withVideo = exercises.filter((exercise) => exercise.video.embedUrl !== null);

    expect(Object.fromEntries(withVideo.map(({ id, video }) => [id, video]))).toEqual({
      "bench-press": {
        embedUrl: "https://www.youtube.com/embed/XjrsqShr-Ic",
        title: "✅ Bench Press LIKE THIS!",
        aspectRatio: "9:16",
      },
      "incline-bench-press": {
        embedUrl: "https://www.youtube.com/embed/8fXfwG4ftaQ",
        title: "The PERFECT Incline Dumbbell Chest Press",
        aspectRatio: "9:16",
      },
      dip: {
        embedUrl: "https://www.youtube.com/embed/eicOUO9WaJc",
        title: "Dips - KNOW THE DIFFERENCE!",
        aspectRatio: "9:16",
      },
      "dumbbell-front-raise": {
        embedUrl: "https://www.youtube.com/embed/9ThlTL25DH8",
        title: "Build 3D Shoulders (Dumbbells Only)",
        aspectRatio: "9:16",
      },
      "dumbbell-lateral-raise": {
        embedUrl: "https://www.youtube.com/embed/Kl3LEzQ5Zqs",
        title: "The Perfect Lateral Raise (DO THIS!)",
        aspectRatio: "9:16",
      },
      "dumbbell-reverse-raise": {
        embedUrl: "https://www.youtube.com/embed/LsT-bR_zxLo",
        title: "The PERFECT Dumbbell Rear Delt Fly (DO THIS!)",
        aspectRatio: "9:16",
      },
      "cable-tricep-pushdown": {
        embedUrl: "https://www.youtube.com/embed/1FjkhpZsaxc",
        title: "The Perfect Triceps Pushdown (DO THIS!)",
        aspectRatio: "9:16",
      },
      squat: {
        embedUrl: "https://www.youtube.com/embed/iKCJCydYYrE",
        title: "✅ The PERFECT Smith Machine Squat",
        aspectRatio: "9:16",
      },
      "walking-lunges-tuesday": {
        embedUrl: "https://www.youtube.com/embed/mJilHWIBWO8",
        title: "✅ The PERFECT Dumbbell Static Lunge",
        aspectRatio: "9:16",
      },
      "hip-thrust-tuesday": {
        embedUrl: "https://www.youtube.com/embed/CvuVYMFd11g",
        title: "❌ FIX THIS Hip Thrust Mistake!",
        aspectRatio: "9:16",
      },
      "leg-extension-tuesday": {
        embedUrl: "https://www.youtube.com/embed/uM86QE59Tgc",
        title: "The PERFECT Leg Extension",
        aspectRatio: "9:16",
      },
      "walking-lunges-thursday": {
        embedUrl: "https://www.youtube.com/embed/mJilHWIBWO8",
        title: "✅ The PERFECT Dumbbell Static Lunge",
        aspectRatio: "9:16",
      },
      "hip-thrust-thursday": {
        embedUrl: "https://www.youtube.com/embed/CvuVYMFd11g",
        title: "❌ FIX THIS Hip Thrust Mistake!",
        aspectRatio: "9:16",
      },
      "leg-extension-thursday": {
        embedUrl: "https://www.youtube.com/embed/uM86QE59Tgc",
        title: "The PERFECT Leg Extension",
        aspectRatio: "9:16",
      },
      "dumbbell-front-raise-friday": {
        embedUrl: "https://www.youtube.com/embed/9ThlTL25DH8",
        title: "Build 3D Shoulders (Dumbbells Only)",
        aspectRatio: "9:16",
      },
      "dumbbell-lateral-raise-friday": {
        embedUrl: "https://www.youtube.com/embed/Kl3LEzQ5Zqs",
        title: "The Perfect Lateral Raise (DO THIS!)",
        aspectRatio: "9:16",
      },
      "dumbbell-reverse-raise-friday": {
        embedUrl: "https://www.youtube.com/embed/LsT-bR_zxLo",
        title: "The PERFECT Dumbbell Rear Delt Fly (DO THIS!)",
        aspectRatio: "9:16",
      },
    });
  });
});
