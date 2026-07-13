# Gym Training Plan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished static, mobile-first weekly gym-plan viewer that selects the browser's current day, switches days instantly, and opens accessible responsive exercise guidance with optional YouTube video.

**Architecture:** Keep `app/page.tsx`, metadata, static page chrome, and local workout data server-rendered. Pass the plan and a stable initial day ID into a small `WorkoutPlanner` client subtree that owns selected IDs and mounts exactly one responsive overlay. Keep date mapping, next-workout lookup, and YouTube URL validation in pure utilities with unit tests.

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui-style Radix primitives, Vaul, Lucide React, Vitest, React Testing Library, jsdom.

---

## File map

### Existing files to modify

- `package.json` — add UI and test dependencies and the `test` script.
- `app/layout.tsx` — Vietnamese document language, Geist, viewport, theme color, and metadata.
- `app/page.tsx` — Server Component composition and stable `initialDayId`.
- `app/globals.css` — design tokens, dark graphite base, accessibility, scrollbar hiding, motion reduction.

### Files to create

- `vitest.config.ts` — jsdom test environment and `@` alias.
- `vitest.setup.ts` — Testing Library DOM matchers and browser polyfills.
- `components.json` — shadcn/ui project configuration.
- `src/types/workout.ts` — shared workout types.
- `src/data/workout-plan.ts` — complete Monday-to-Sunday data.
- `src/lib/cn.ts` — Tailwind class merging.
- `src/lib/day-utils.ts` — date mapping and bounded next-workout search.
- `src/lib/video-utils.ts` — strict YouTube embed validator.
- `src/hooks/use-media-query.ts` — stable mobile-first responsive hook.
- `src/components/ui/badge.tsx` — local shadcn-style Badge.
- `src/components/ui/button.tsx` — local shadcn-style Button.
- `src/components/ui/dialog.tsx` — Radix Dialog wrapper.
- `src/components/ui/drawer.tsx` — Vaul Drawer wrapper.
- `src/components/ui/skeleton.tsx` — loading placeholder.
- `src/components/shared/page-container.tsx` — bounded responsive container.
- `src/components/shared/muscle-badge.tsx` — compact muscle label.
- `src/components/shared/empty-video-state.tsx` — missing/invalid video treatment.
- `src/components/layout/app-header.tsx` — compact brand header.
- `src/components/layout/app-footer.tsx` — small static footer.
- `src/components/workout/workout-hero.tsx` — compact program summary and rest guidance.
- `src/components/workout/workout-planner.tsx` — client coordination boundary.
- `src/components/workout/weekly-day-selector.tsx` — accessible day selection.
- `src/components/workout/workout-day-header.tsx` — current session summary.
- `src/components/workout/exercise-grid.tsx` — two-column maximum list.
- `src/components/workout/exercise-card.tsx` — clickable exercise summary.
- `src/components/workout/exercise-detail-content.tsx` — shared detail body.
- `src/components/workout/exercise-detail-dialog.tsx` — single responsive Drawer/Dialog abstraction.
- `src/components/workout/exercise-video.tsx` — validated, lazy iframe rendering.
- `src/components/workout/rest-day-card.tsx` — recovery state and next workout action.
- `src/lib/day-utils.test.ts` — date and next-day unit tests.
- `src/lib/video-utils.test.ts` — URL validator tests.
- `src/data/workout-plan.test.ts` — plan completeness and supplied-video tests.
- `src/components/workout/workout-planner.test.tsx` — core interaction tests.
- `src/components/workout/exercise-video.test.tsx` — iframe lifecycle and validation tests.
- `src/components/workout/exercise-detail-dialog.test.tsx` — one-overlay-only tests.

## Task 1: Prepare dependencies and the test harness

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `components.json`

- [ ] **Step 1: Re-read the local Next.js guides before implementation**

Run:

```powershell
Get-Content -Raw node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md
Get-Content -Raw node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md
Get-Content -Raw node_modules/next/dist/docs/01-app/01-getting-started/11-css.md
Get-Content -Raw node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md
```

Expected: all four files load successfully and confirm pages/layouts are Server Components by default, client boundaries require `"use client"`, global CSS belongs at the app root, and static metadata is exported by a Server Component.

- [ ] **Step 2: Install the minimal runtime and test dependencies**

Run:

```powershell
npm install lucide-react vaul @radix-ui/react-dialog @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Expected: exit code 0 and lockfile updated without peer-dependency errors.

- [ ] **Step 3: Add the test script**

Modify `package.json` scripts to exactly include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run"
  }
}
```

- [ ] **Step 4: Add Vitest configuration**

Create `vitest.config.ts`:

```ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
```

- [ ] **Step 5: Add shadcn configuration**

Create `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/src/components",
    "utils": "@/src/lib/cn",
    "ui": "@/src/components/ui",
    "lib": "@/src/lib",
    "hooks": "@/src/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 6: Confirm the empty test suite runs**

Run: `npm run test -- --passWithNoTests`

Expected: exit code 0 with no test files found.

- [ ] **Step 7: Commit the harness**

```powershell
git add package.json package-lock.json vitest.config.ts vitest.setup.ts components.json
git commit -m "chore: add workout UI and test tooling"
```

## Task 2: Define and validate the workout data

**Files:**
- Create: `src/types/workout.ts`
- Create: `src/data/workout-plan.ts`
- Test: `src/data/workout-plan.test.ts`

- [ ] **Step 1: Write the failing plan-data tests**

Create `src/data/workout-plan.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm run test -- src/data/workout-plan.test.ts`

Expected: FAIL because `@/src/data/workout-plan` does not exist.

- [ ] **Step 3: Add exact shared types**

Create `src/types/workout.ts`:

```ts
export type VideoAspectRatio = "16:9" | "9:16";

export interface ExerciseVideo {
  embedUrl: string | null;
  title?: string;
  aspectRatio: VideoAspectRatio;
}

export interface Exercise {
  id: string;
  name: string;
  vietnameseName?: string;
  muscleGroups: string[];
  sets: number;
  reps: string;
  note?: string;
  description?: string;
  instructions?: string[];
  video: ExerciseVideo;
}

export interface WorkoutDay {
  id: string;
  dayNumber: number;
  shortLabel: string;
  fullLabel: string;
  title: string;
  muscleGroups: string[];
  description?: string;
  isRestDay: boolean;
  exercises: Exercise[];
}
```

- [ ] **Step 4: Add the complete local plan**

Create `src/data/workout-plan.ts`. Use a `noVideo` helper that returns a new object, and encode the supplied plan exactly:

```ts
import type { Exercise, WorkoutDay } from "@/src/types/workout";

const noVideo = (): Exercise["video"] => ({ embedUrl: null, aspectRatio: "16:9" });

const exercise = (
  id: string,
  name: string,
  vietnameseName: string,
  muscleGroups: string[],
  sets: number,
  reps: string,
  options: Partial<Pick<Exercise, "note" | "description" | "instructions" | "video">> = {},
): Exercise => ({
  id,
  name,
  vietnameseName,
  muscleGroups,
  sets,
  reps,
  description: `Hướng dẫn nhanh cho ${name}.`,
  video: noVideo(),
  ...options,
});

export const workoutPlan: WorkoutDay[] = [
  {
    id: "monday", dayNumber: 1, shortLabel: "Thứ 2", fullLabel: "Thứ 2",
    title: "Ngực, vai và tay sau", muscleGroups: ["Ngực", "Vai", "Tay sau"],
    description: "Ưu tiên kỹ thuật kiểm soát và tăng tải có chủ đích.", isRestDay: false,
    exercises: [
      exercise("bench-press", "Bench Press", "Đẩy ngực thanh đòn", ["Ngực"], 5, "14 / 12 / 10 / 8 / 6"),
      exercise("incline-bench-press", "Incline Bench Press", "Đẩy ngực dốc lên", ["Ngực trên"], 4, "14 / 12 / 10 / 8", { video: { embedUrl: "https://www.youtube.com/embed/8fXfwG4ftaQ", title: "The PERFECT Incline Dumbbell Chest Press", aspectRatio: "9:16" } }),
      exercise("dip", "Dip", "Xà kép", ["Ngực", "Tay sau"], 3, "Tối đa", { note: "Mục tiêu khoảng 8 rep mỗi set nếu thể lực cho phép." }),
      exercise("dumbbell-front-raise", "Dumbbell Front Raise", "Nâng tạ trước", ["Vai trước"], 3, "15 mỗi set"),
      exercise("dumbbell-lateral-raise", "Dumbbell Lateral Raise", "Nâng tạ ngang", ["Vai giữa"], 3, "15 mỗi set"),
      exercise("dumbbell-reverse-raise", "Dumbbell Reverse Raise", "Nâng tạ vai sau", ["Vai sau"], 3, "15 mỗi set"),
      exercise("cable-tricep-pushdown", "Cable Tricep Pushdown", "Kéo cáp tay sau", ["Tay sau"], 4, "15 mỗi set"),
    ],
  },
  {
    id: "tuesday", dayNumber: 2, shortLabel: "Thứ 3", fullLabel: "Thứ 3",
    title: "Chân, mông và core", muscleGroups: ["Chân", "Mông", "Core"],
    description: "Giữ thân người ổn định và ưu tiên biên độ chuyển động an toàn.", isRestDay: false,
    exercises: [
      exercise("squat", "Squat", "Gánh đùi", ["Đùi", "Mông"], 5, "14 / 12 / 10 / 8 / 6"),
      exercise("walking-lunges-tuesday", "Walking Lunges", "Chùng chân bước tới", ["Đùi", "Mông"], 4, "14 / 12 / 10 / 8 mỗi chân"),
      exercise("hip-thrust-tuesday", "Hip Thrust", "Đẩy hông", ["Mông"], 4, "14 / 12 / 10 / 8"),
      exercise("leg-extension-tuesday", "Leg Extension", "Duỗi chân máy", ["Đùi trước"], 3, "14 / 12 / 10"),
      exercise("leg-curl-tuesday", "Leg Curl", "Cuốn chân máy", ["Đùi sau"], 3, "14 / 12 / 10"),
      exercise("leg-press-tuesday", "Leg Press", "Đạp đùi máy", ["Đùi", "Mông"], 4, "15 mỗi set"),
      exercise("v-sit-up-tuesday", "V Sit-up", "Gập bụng chữ V", ["Core"], 4, "15 mỗi set"),
    ],
  },
  {
    id: "wednesday", dayNumber: 3, shortLabel: "Thứ 4", fullLabel: "Thứ 4",
    title: "Lưng, xô và tay trước", muscleGroups: ["Lưng", "Xô", "Tay trước"],
    description: "Kéo bằng khuỷu tay và giữ cột sống trung lập.", isRestDay: false,
    exercises: [
      exercise("pull-up", "Pull-up", "Hít xà", ["Xô", "Lưng"], 5, "Tối đa"),
      exercise("barbell-bent-over-row", "Barbell Bent-over Row", "Kéo thanh đòn gập người", ["Lưng"], 4, "14 / 12 / 10 / 8"),
      exercise("dumbbell-bent-over-row", "Dumbbell Bent-over Row", "Kéo tạ đơn gập người", ["Lưng", "Xô"], 4, "14 / 12 / 10 / 8 mỗi bên"),
      exercise("seated-row", "Seated Row", "Kéo cáp ngồi", ["Lưng giữa"], 3, "15 mỗi set"),
      exercise("lat-pulldown", "Lat Pulldown", "Kéo xô", ["Xô"], 3, "15 mỗi set"),
      exercise("cable-bicep-curl", "Cable Bicep Curl", "Cuốn tay trước cáp", ["Tay trước"], 4, "15 mỗi set"),
      exercise("back-extension", "Back Extension", "Duỗi lưng", ["Lưng dưới"], 4, "15 mỗi set"),
    ],
  },
  {
    id: "thursday", dayNumber: 4, shortLabel: "Thứ 5", fullLabel: "Thứ 5",
    title: "Deadlift và chân", muscleGroups: ["Lưng dưới", "Chân", "Mông"],
    description: "Tập trung vào kỹ thuật hip hinge và kiểm soát nhịp hạ tạ.", isRestDay: false,
    exercises: [
      exercise("deadlift", "Deadlift", "Kéo tạ", ["Lưng dưới", "Mông", "Đùi sau"], 5, "14 / 12 / 10 / 8 / 6"),
      exercise("walking-lunges-thursday", "Walking Lunges", "Chùng chân bước tới", ["Đùi", "Mông"], 4, "14 / 12 / 10 / 8 mỗi chân"),
      exercise("hip-thrust-thursday", "Hip Thrust", "Đẩy hông", ["Mông"], 4, "14 / 12 / 10 / 8"),
      exercise("leg-extension-thursday", "Leg Extension", "Duỗi chân máy", ["Đùi trước"], 3, "14 / 12 / 10"),
      exercise("leg-curl-thursday", "Leg Curl", "Cuốn chân máy", ["Đùi sau"], 3, "14 / 12 / 10"),
      exercise("leg-press-thursday", "Leg Press", "Đạp đùi máy", ["Đùi", "Mông"], 4, "15 mỗi set"),
      exercise("v-sit-up-thursday", "V Sit-up", "Gập bụng chữ V", ["Core"], 4, "15 mỗi set"),
    ],
  },
  {
    id: "friday", dayNumber: 5, shortLabel: "Thứ 6", fullLabel: "Thứ 6",
    title: "Vai, ngực và tay sau", muscleGroups: ["Vai", "Ngực", "Tay sau"],
    description: "Ưu tiên vai ổn định, chuyển động mượt và không khóa khớp.", isRestDay: false,
    exercises: [
      exercise("overhead-press", "Overhead Press — OHP", "Đẩy vai thanh đòn", ["Vai"], 5, "14 / 12 / 10 / 8 / 6"),
      exercise("dumbbell-shoulder-press", "Dumbbell Shoulder Press", "Đẩy vai tạ đơn", ["Vai"], 4, "14 / 12 / 10 / 8"),
      exercise("dumbbell-front-raise-friday", "Dumbbell Front Raise", "Nâng tạ trước", ["Vai trước"], 4, "15 mỗi set"),
      exercise("dumbbell-lateral-raise-friday", "Dumbbell Lateral Raise", "Nâng tạ ngang", ["Vai giữa"], 4, "15 mỗi set"),
      exercise("dumbbell-reverse-raise-friday", "Dumbbell Reverse Raise", "Nâng tạ vai sau", ["Vai sau"], 4, "15 mỗi set"),
      exercise("dumbbell-bench-press", "Dumbbell Bench Press", "Đẩy ngực tạ đơn", ["Ngực"], 3, "15 mỗi set"),
      exercise("dumbbell-incline-bench-press", "Dumbbell Incline Bench Press", "Đẩy ngực dốc lên tạ đơn", ["Ngực trên"], 3, "15 mỗi set"),
      exercise("cable-tricep-extension", "Cable Tricep Extension", "Duỗi tay sau với cáp", ["Tay sau"], 4, "15 mỗi set"),
    ],
  },
  {
    id: "saturday", dayNumber: 6, shortLabel: "Thứ 7", fullLabel: "Thứ 7",
    title: "Ngày nghỉ phục hồi", muscleGroups: ["Phục hồi"],
    description: "Nghỉ ngơi, giãn cơ nhẹ hoặc đi bộ để cơ thể sẵn sàng cho tuần mới.",
    isRestDay: true, exercises: [],
  },
  {
    id: "sunday", dayNumber: 0, shortLabel: "CN", fullLabel: "Chủ nhật",
    title: "Ngày nghỉ phục hồi", muscleGroups: ["Phục hồi"],
    description: "Dành thời gian ngủ đủ, vận động nhẹ và chuẩn bị cho buổi tập Thứ 2.",
    isRestDay: true, exercises: [],
  },
];
```

- [ ] **Step 5: Verify GREEN**

Run: `npm run test -- src/data/workout-plan.test.ts`

Expected: 3 tests pass.

- [ ] **Step 6: Commit data and types**

```powershell
git add src/types/workout.ts src/data/workout-plan.ts src/data/workout-plan.test.ts
git commit -m "feat: add twelve-week workout plan data"
```

## Task 3: Build pure utilities with test-first coverage

**Files:**
- Create: `src/lib/day-utils.test.ts`
- Create: `src/lib/day-utils.ts`
- Create: `src/lib/video-utils.test.ts`
- Create: `src/lib/video-utils.ts`
- Create: `src/lib/cn.ts`

- [ ] **Step 1: Write failing day utility tests**

Create `src/lib/day-utils.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { workoutPlan } from "@/src/data/workout-plan";
import { findNextWorkoutDay, getWorkoutDayForJsDay } from "@/src/lib/day-utils";

describe("getWorkoutDayForJsDay", () => {
  it.each([
    [0, "sunday"], [1, "monday"], [2, "tuesday"], [3, "wednesday"],
    [4, "thursday"], [5, "friday"], [6, "saturday"],
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
```

- [ ] **Step 2: Verify day tests are RED**

Run: `npm run test -- src/lib/day-utils.test.ts`

Expected: FAIL because `day-utils.ts` does not exist.

- [ ] **Step 3: Implement bounded date utilities**

Create `src/lib/day-utils.ts`:

```ts
import type { WorkoutDay } from "@/src/types/workout";

export function getWorkoutDayForJsDay(dayNumber: number, plan: WorkoutDay[]) {
  if (!Number.isInteger(dayNumber) || dayNumber < 0 || dayNumber > 6) return null;
  return plan.find((day) => day.dayNumber === dayNumber) ?? null;
}

export function getCurrentWorkoutDay(plan: WorkoutDay[], date = new Date()) {
  return getWorkoutDayForJsDay(date.getDay(), plan);
}

export function findNextWorkoutDay(currentDayId: string, plan: WorkoutDay[]) {
  const startIndex = plan.findIndex((day) => day.id === currentDayId);
  if (startIndex < 0 || plan.length === 0) return null;

  for (let offset = 1; offset <= plan.length; offset += 1) {
    const candidate = plan[(startIndex + offset) % plan.length];
    if (!candidate.isRestDay && candidate.exercises.length > 0) return candidate;
  }

  return null;
}
```

- [ ] **Step 4: Verify day tests are GREEN**

Run: `npm run test -- src/lib/day-utils.test.ts`

Expected: 11 tests pass.

- [ ] **Step 5: Write failing video URL tests**

Create `src/lib/video-utils.test.ts`:

```ts
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
```

- [ ] **Step 6: Verify video tests are RED**

Run: `npm run test -- src/lib/video-utils.test.ts`

Expected: FAIL because `video-utils.ts` does not exist.

- [ ] **Step 7: Implement the strict validator and class helper**

Create `src/lib/video-utils.ts`:

```ts
const ALLOWED_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function isValidYouTubeEmbedUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname)) return false;
    const match = url.pathname.match(/^\/embed\/([^/]+)\/?$/);
    return match ? VIDEO_ID_PATTERN.test(match[1]) : false;
  } catch {
    return false;
  }
}
```

Create `src/lib/cn.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 8: Verify all utility tests are GREEN**

Run: `npm run test -- src/lib/day-utils.test.ts src/lib/video-utils.test.ts`

Expected: all utility tests pass.

- [ ] **Step 9: Commit utilities**

```powershell
git add src/lib
git commit -m "feat: add safe workout day and video utilities"
```

## Task 4: Add UI primitives and the responsive hook

**Files:**
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/dialog.tsx`
- Create: `src/components/ui/drawer.tsx`
- Create: `src/components/ui/skeleton.tsx`
- Create: `src/hooks/use-media-query.ts`

- [ ] **Step 1: Generate local shadcn components**

Run:

```powershell
npx shadcn@latest add badge button dialog drawer skeleton --yes
```

Expected: the five components are created under `src/components/ui`, using Radix Dialog and Vaul Drawer. Inspect the diff and retain local source rather than a runtime component service.

- [ ] **Step 2: Add a stable mobile-first media query hook**

Create `src/hooks/use-media-query.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string, defaultValue = false) {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}
```

- [ ] **Step 3: Inspect primitive accessibility contracts**

Confirm in source:

- Dialog and Drawer expose `Title` and `Description` wrappers.
- Dialog uses Radix focus management and Escape dismissal.
- Drawer uses Vaul and exposes handle-capable content.
- Icon-only buttons can receive `aria-label` and remain at least 44 px via caller classes.

- [ ] **Step 4: Run static checks**

Run: `npx tsc --noEmit`

Expected: exit code 0.

- [ ] **Step 5: Commit primitives**

```powershell
git add src/components/ui src/hooks/use-media-query.ts
git commit -m "feat: add accessible workout UI primitives"
```

## Task 5: Build the video and responsive detail overlay test-first

**Files:**
- Create: `src/components/shared/empty-video-state.tsx`
- Create: `src/components/shared/muscle-badge.tsx`
- Create: `src/components/workout/exercise-video.test.tsx`
- Create: `src/components/workout/exercise-video.tsx`
- Create: `src/components/workout/exercise-detail-content.tsx`
- Create: `src/components/workout/exercise-detail-dialog.test.tsx`
- Create: `src/components/workout/exercise-detail-dialog.tsx`

- [ ] **Step 1: Write failing iframe lifecycle tests**

Create `src/components/workout/exercise-video.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExerciseVideo } from "@/src/components/workout/exercise-video";

describe("ExerciseVideo", () => {
  it("renders a lazy iframe for a valid open video", () => {
    render(<ExerciseVideo video={{ embedUrl: "https://www.youtube.com/embed/8fXfwG4ftaQ", title: "Incline press", aspectRatio: "9:16" }} />);
    expect(screen.getByTitle("Incline press")).toHaveAttribute("loading", "lazy");
  });

  it("renders an empty state instead of an iframe for an invalid URL", () => {
    render(<ExerciseVideo video={{ embedUrl: "https://evil.example/embed/8fXfwG4ftaQ", aspectRatio: "16:9" }} />);
    expect(screen.queryByTitle(/video/i)).not.toBeInTheDocument();
    expect(screen.getByText("Chưa có video hướng dẫn cho bài tập này.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Verify video component tests are RED**

Run: `npm run test -- src/components/workout/exercise-video.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement empty state, muscle badge, and video**

`EmptyVideoState` renders a `VideoOff` icon, the exact missing-video title, and “Video sẽ được cập nhật sau.” `MuscleBadge` renders a compact neutral badge. `ExerciseVideo` must:

```tsx
export function ExerciseVideo({ video }: { video: Exercise["video"] }) {
  if (!video.embedUrl || !isValidYouTubeEmbedUrl(video.embedUrl)) {
    return <EmptyVideoState />;
  }

  const portrait = video.aspectRatio === "9:16";
  return (
    <div className={cn("relative mx-auto w-full overflow-hidden rounded-2xl border border-white/10 bg-black", portrait ? "max-h-[62dvh] max-w-[22rem] aspect-[9/16]" : "aspect-video")}>
      <iframe
        className="absolute inset-0 size-full"
        src={video.embedUrl}
        title={video.title ?? "Video hướng dẫn bài tập"}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
```

Do not add an autoplay query parameter and do not use `dangerouslySetInnerHTML`.

- [ ] **Step 4: Verify video tests are GREEN**

Run: `npm run test -- src/components/workout/exercise-video.test.tsx`

Expected: 2 tests pass.

- [ ] **Step 5: Write failing responsive-overlay tests**

Create `src/components/workout/exercise-detail-dialog.test.tsx`:

```tsx
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
```

- [ ] **Step 6: Verify overlay tests are RED**

Run: `npm run test -- src/components/workout/exercise-detail-dialog.test.tsx`

Expected: FAIL because the responsive overlay does not exist.

- [ ] **Step 7: Implement shared detail content and the single responsive overlay**

`ExerciseDetailContent` accepts one resolved `Exercise` and renders muscle badges, set and rep summary, optional note, optional instructions, and `ExerciseVideo`. `ExerciseDetailDialog` uses `useMediaQuery("(min-width: 768px)", false)` and a single conditional:

```tsx
if (!exercise) return null;

if (isDesktop) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="exercise-dialog" className="max-h-[90dvh] max-w-5xl overflow-hidden border-white/10 bg-[#111310] p-0 text-white">
        <ExerciseDetailContent exercise={exercise} variant="dialog" onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

return (
  <Drawer open={open} onOpenChange={onOpenChange}>
    <DrawerContent data-testid="exercise-drawer" className="h-[94dvh] border-white/10 bg-[#111310] text-white">
      <ExerciseDetailContent exercise={exercise} variant="drawer" onClose={() => onOpenChange(false)} />
    </DrawerContent>
  </Drawer>
);
```

Only call `ExerciseVideo` inside content mounted by an open overlay. Add sticky title/close header, `DialogTitle`/`DrawerTitle`, hidden accessible descriptions, and independently scrolling detail body.

- [ ] **Step 8: Verify overlay and video tests are GREEN**

Run: `npm run test -- src/components/workout/exercise-video.test.tsx src/components/workout/exercise-detail-dialog.test.tsx`

Expected: all tests pass and no accessible-dialog warnings are printed.

- [ ] **Step 9: Commit detail experience**

```powershell
git add src/components/shared src/components/workout/exercise-video* src/components/workout/exercise-detail* 
git commit -m "feat: add responsive exercise guidance overlay"
```

## Task 6: Build planner interactions test-first

**Files:**
- Create: `src/components/workout/workout-planner.test.tsx`
- Create: `src/components/workout/workout-planner.tsx`
- Create: `src/components/workout/weekly-day-selector.tsx`
- Create: `src/components/workout/workout-day-header.tsx`
- Create: `src/components/workout/exercise-grid.tsx`
- Create: `src/components/workout/exercise-card.tsx`
- Create: `src/components/workout/rest-day-card.tsx`

- [ ] **Step 1: Write failing planner behavior tests**

Create `src/components/workout/workout-planner.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { workoutPlan } from "@/src/data/workout-plan";
import { WorkoutPlanner } from "@/src/components/workout/workout-planner";

vi.mock("@/src/lib/day-utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/src/lib/day-utils")>();
  return {
    ...actual,
    getCurrentWorkoutDay: () => workoutPlan.find((day) => day.id === "monday") ?? null,
  };
});

vi.mock("@/src/components/workout/exercise-detail-dialog", () => ({
  ExerciseDetailDialog: ({ open, exercise }: { open: boolean; exercise: { name: string } | null }) =>
    open && exercise ? <div role="dialog">{exercise.name}</div> : null,
}));

function renderPlanner(overrides: Partial<React.ComponentProps<typeof WorkoutPlanner>> = {}) {
  return render(
    <WorkoutPlanner
      plan={workoutPlan}
      initialDayId="monday"
      initialTodayId="monday"
      {...overrides}
    />,
  );
}

describe("WorkoutPlanner", () => {
it("keeps the today badge when another day is selected", async () => {
  const user = userEvent.setup();
  renderPlanner();
  await user.click(screen.getByRole("tab", { name: /Thứ 3/i }));
  expect(screen.getByRole("tab", { name: /Thứ 2/i })).toHaveTextContent("Hôm nay");
  expect(screen.getByRole("tab", { name: /Thứ 3/i })).toHaveAttribute("aria-selected", "true");
});

it("closes an exercise detail when the day changes", async () => {
  const user = userEvent.setup();
  renderPlanner();
  await user.click(screen.getByRole("button", { name: /Bench Press/i }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  await user.click(screen.getByRole("tab", { name: /Thứ 3/i }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("does not render the exercise grid on a rest day", async () => {
  const user = userEvent.setup();
  renderPlanner();
  await user.click(screen.getByRole("tab", { name: /Thứ 7/i }));
  expect(screen.queryByTestId("exercise-grid")).not.toBeInTheDocument();
  expect(screen.getByText("Ngày nghỉ phục hồi")).toBeInTheDocument();
});

it("moves Sunday directly to Monday", async () => {
  const user = userEvent.setup();
  renderPlanner({ initialDayId: "sunday", initialTodayId: "sunday" });
  await user.click(screen.getByRole("button", { name: "Xem trước lịch Thứ 2" }));
  expect(screen.getByRole("tab", { name: /Thứ 2/i })).toHaveAttribute("aria-selected", "true");
});
});
```

- [ ] **Step 2: Verify planner tests are RED**

Run: `npm run test -- src/components/workout/workout-planner.test.tsx`

Expected: FAIL because the planner components do not exist.

- [ ] **Step 3: Implement the planner state contract**

`WorkoutPlanner` must begin with stable props and update browser-local today only in an effect:

```tsx
const [selectedDayId, setSelectedDayId] = useState(initialDayId);
const [todayId, setTodayId] = useState(initialTodayId);
const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
const [detailOpen, setDetailOpen] = useState(false);
const [hasMounted, setHasMounted] = useState(false);

useEffect(() => {
  const localToday = getCurrentWorkoutDay(plan);
  if (localToday) {
    setTodayId(localToday.id);
    setSelectedDayId((current) => current === initialDayId ? localToday.id : current);
  }
  setHasMounted(true);
}, [initialDayId, plan]);

const selectDay = (dayId: string) => {
  setDetailOpen(false);
  setSelectedExerciseId(null);
  setSelectedDayId(dayId);
};
```

Resolve `selectedDay` from `selectedDayId`, and resolve `selectedExercise` only from `selectedDay.exercises`. Never store either object in state. Before `hasMounted` becomes true, keep the selector shell in place and show a short, fixed-height `aria-busy="true"` planner skeleton instead of server-selected exercise content so a timezone correction cannot visibly flash the wrong workout.

- [ ] **Step 4: Implement the day selector and session header**

Use `role="tablist"` and day buttons with `role="tab"`, `aria-selected`, “Hôm nay” text independent of selected state, rest text/icon, visible selected marker, `snap-start`, `min-w-*` mobile sizing, hidden scrollbar class, and `md:grid md:grid-cols-7` desktop layout.

- [ ] **Step 5: Implement exercise cards and grid**

`ExerciseGrid` uses `data-testid="exercise-grid"` and `grid-cols-1 lg:grid-cols-2`. Each `ExerciseCard` is one semantic button with an accessible name containing the exercise name, a compact number, English and Vietnamese names, muscle badges, high-contrast sets/reps, optional note only when present, a distinct text-and-icon video badge, and a visible “Xem hướng dẫn” row. Apply 200 ms hover/active transitions and focus-visible ring.

- [ ] **Step 6: Implement the bounded rest-day action**

`RestDayCard` calls `findNextWorkoutDay(day.id, plan)`. Disable the action if it returns null. Use label `Xem trước lịch Thứ 2` for Sunday and `Xem lịch ngày tập tiếp theo` otherwise. The click handler calls the same `selectDay` function used by the selector.

- [ ] **Step 7: Verify planner tests are GREEN**

Run: `npm run test -- src/components/workout/workout-planner.test.tsx`

Expected: all four interaction tests pass without act, hydration, or accessibility warnings.

- [ ] **Step 8: Run all tests**

Run: `npm run test`

Expected: all data, utility, video, overlay, and planner tests pass.

- [ ] **Step 9: Commit planner interactions**

```powershell
git add src/components/workout
git commit -m "feat: add interactive weekly workout planner"
```

## Task 7: Compose the server-rendered page and premium visual system

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Create: `src/components/layout/app-header.tsx`
- Create: `src/components/layout/app-footer.tsx`
- Create: `src/components/shared/page-container.tsx`
- Create: `src/components/workout/workout-hero.tsx`

- [ ] **Step 1: Apply the approved design read before styling**

Use this fixed direction: “Single-page personal fitness utility for fast in-gym use, dark graphite and restrained electric lime, compact mobile hierarchy, no marketing hero, no decorative photography, no large gradients.” Set design variance 4/10, motion 3/10, and visual density 6/10.

- [ ] **Step 2: Update layout metadata and viewport**

Keep `app/layout.tsx` a Server Component. Export:

```ts
export const metadata: Metadata = {
  title: "Gym Training Plan | Giáo án tập 12 tuần",
  description: "Website xem lịch tập gym trong tuần, danh sách bài tập và video hướng dẫn động tác.",
  openGraph: {
    title: "Gym Training Plan | Giáo án tập 12 tuần",
    description: "Lịch tập gym trong tuần và video hướng dẫn động tác.",
    type: "website",
    locale: "vi_VN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0c09",
  colorScheme: "dark",
};
```

Set `<html lang="vi" className={geistSans.variable}>` and keep the existing favicon file.

- [ ] **Step 3: Compose a compact static page shell**

`app/page.tsx` imports `workoutPlan`, passes stable Monday values during static/server rendering, and remains free of `"use client"`:

```tsx
export default function Home() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <AppHeader />
      <main>
        <PageContainer>
          <WorkoutHero />
          <WorkoutPlanner plan={workoutPlan} initialDayId="monday" initialTodayId="monday" />
        </PageContainer>
      </main>
      <AppFooter />
    </div>
  );
}
```

The browser-local correction remains inside the planner effect described in Task 6.

- [ ] **Step 4: Implement compact static components**

- `AppHeader`: dumbbell/monogram icon, “Gym Training Plan”, “Giáo án tập luyện 12 tuần”; no theme switch.
- `WorkoutHero`: badge, “Lịch tập trong tuần”, the supplied instruction, and two compact rest metrics with Clock icons. Keep the mobile block within 220–300 px by using tight vertical spacing.
- `PageContainer`: `mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8`.
- `AppFooter`: concise local-data/privacy note and program label; do not add navigation or marketing links.

- [ ] **Step 5: Implement the global dark design tokens**

In `app/globals.css`, retain `@import "tailwindcss"`, define graphite variables such as `--background: #0a0c09`, `--card: #121510`, `--muted: #1a1e18`, `--foreground: #f5f7f2`, `--muted-foreground: #a5ada0`, and `--accent: #c7ff3d`. Add:

```css
* { box-sizing: border-box; }
html { background: var(--background); scroll-behavior: smooth; }
body { margin: 0; background: var(--background); color: var(--foreground); }
button, a { -webkit-tap-highlight-color: transparent; }
.scrollbar-none { scrollbar-width: none; }
.scrollbar-none::-webkit-scrollbar { display: none; }
::selection { background: rgb(199 255 61 / 0.25); color: #fff; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Use at most a small radial highlight local to the selected day; do not add a page-sized gradient.

- [ ] **Step 6: Run focused quality checks**

Run:

```powershell
npx tsc --noEmit
npm run test
```

Expected: both commands exit 0.

- [ ] **Step 7: Commit the composed experience**

```powershell
git add app src/components/layout src/components/shared src/components/workout/workout-hero.tsx
git commit -m "feat: compose premium mobile workout experience"
```

## Task 8: Visual, responsive, and accessibility inspection

**Files:**
- Modify only files with verified issues from inspection.

- [ ] **Step 1: Start the development server**

Run: `npm run dev`

Expected: Next.js reports a local URL and no startup errors.

- [ ] **Step 2: Inspect at 360 × 800**

Verify:

- no horizontal page overflow;
- header and hero leave exercises visible without excessive scrolling;
- day selector scrolls, snaps, and hides its scrollbar;
- selected, today, and rest states remain textually distinct;
- every control is at least 44 px;
- exercise cards remain compact without blank note space;
- Drawer reaches about 94dvh, has a handle and sticky header, and its body scrolls;
- portrait video remains centered and within viewport height.

- [ ] **Step 3: Inspect at tablet width**

Verify day navigation remains usable, cards have comfortable line length, and the responsive overlay changes only at the selected breakpoint without mounting duplicate focus traps.

- [ ] **Step 4: Inspect at 1440 × 900**

Verify the container does not exceed 1240 px, all seven day cards fit, the exercise grid is exactly two columns, and the Dialog uses one or two internal columns according to video ratio and available width.

- [ ] **Step 5: Perform keyboard and reduced-motion checks**

Using Tab, Enter/Space, and Escape, verify selector, cards, close buttons, focus trap, and focus restoration. Emulate `prefers-reduced-motion: reduce` and confirm transitions are effectively removed.

- [ ] **Step 6: Fix only observed issues and rerun affected tests**

For every behavior bug, add or update a failing focused test first, run it to confirm RED, make the minimal fix, and rerun to GREEN. For purely visual CSS corrections, record the inspected viewport and recheck it after the change.

- [ ] **Step 7: Commit inspection fixes if any**

```powershell
git add app src
git commit -m "fix: polish responsive workout interactions"
```

Skip this commit when inspection produces no changes.

## Task 9: Final verification and handoff

**Files:**
- Modify only files required to resolve fresh verification failures.

- [ ] **Step 1: Run the complete test suite**

Run: `npm run test`

Expected: all tests pass with zero failures and no React accessibility warnings.

- [ ] **Step 2: Run ESLint**

Run: `npm run lint`

Expected: exit code 0 with zero errors and zero warnings.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: exit code 0, TypeScript compilation succeeds, and `/` is generated without hydration or metadata errors.

- [ ] **Step 4: Audit scope and source structure**

Run:

```powershell
rg --files app src
rg -n "use client|dangerouslySetInnerHTML|autoplay=|api/|process\.env" app src
git status --short
```

Expected:

- `"use client"` appears only in the planner subtree, interactive primitives, and hook files that require it;
- no `dangerouslySetInnerHTML`, autoplay URL parameter, API route, or environment variable appears;
- all specified component/data/type/utility files exist;
- working tree is clean after the final commit.

- [ ] **Step 5: Create the final verification commit when needed**

If verification required code changes, repeat the failed command until it passes, then commit:

```powershell
git add app src package.json package-lock.json
git commit -m "fix: resolve final workout plan verification issues"
```

- [ ] **Step 6: Report evidence**

Report exact test counts, lint exit status, build exit status, key responsive sizes inspected, and the primary files users can edit to replace YouTube links. Do not claim completion without fresh output from all three commands.
