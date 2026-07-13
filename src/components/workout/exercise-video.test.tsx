import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExerciseVideo } from "@/src/components/workout/exercise-video";

describe("ExerciseVideo", () => {
  it("renders a lazy iframe for a valid video", () => {
    render(
      <ExerciseVideo
        video={{
          embedUrl: "https://www.youtube.com/embed/8fXfwG4ftaQ",
          title: "Incline press",
          aspectRatio: "9:16",
        }}
      />,
    );

    expect(screen.getByTitle("Incline press")).toHaveAttribute("loading", "lazy");
  });

  it("renders an empty state instead of an iframe for an invalid URL", () => {
    render(
      <ExerciseVideo
        video={{
          embedUrl: "https://evil.example/embed/8fXfwG4ftaQ",
          aspectRatio: "16:9",
        }}
      />,
    );

    expect(screen.queryByTitle(/video hướng dẫn/i)).not.toBeInTheDocument();
    expect(screen.getByText("Chưa có video hướng dẫn cho bài tập này.")).toBeInTheDocument();
  });
});
