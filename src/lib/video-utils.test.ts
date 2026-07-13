import { describe, expect, it } from "vitest";
import { isValidYouTubeEmbedUrl } from "@/src/lib/video-utils";

describe("isValidYouTubeEmbedUrl", () => {
  it.each([
    "https://www.youtube.com/embed/8fXfwG4ftaQ",
    "https://youtube.com/embed/8fXfwG4ftaQ",
    "https://www.youtube-nocookie.com/embed/8fXfwG4ftaQ",
    "https://youtube-nocookie.com/embed/8fXfwG4ftaQ",
  ])("accepts supported embed URL %s", (url) => {
    expect(isValidYouTubeEmbedUrl(url)).toBe(true);
  });

  it.each([
    "http://www.youtube.com/embed/8fXfwG4ftaQ",
    "https://evil.example/youtube.com/embed/8fXfwG4ftaQ",
    "https://www.youtube.com/watch?v=8fXfwG4ftaQ",
    "https://www.youtube.com/embed/",
    "https://www.youtube.com/embed/not valid",
    "not-a-url",
  ])("rejects invalid URL %s", (url) => {
    expect(isValidYouTubeEmbedUrl(url)).toBe(false);
  });
});
