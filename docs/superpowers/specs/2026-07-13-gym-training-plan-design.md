# Gym Training Plan — Design Specification

## 1. Goal and scope

Build a static, mobile-first workout-plan viewer with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, and Lucide icons. A user can open the site, see the correct current day, choose another day, scan that day's exercises, and open an exercise guide with an optional YouTube embed in no more than two or three actions.

The site has one page and no backend, API routes, database, authentication, persistence, progress tracking, weight input, timers, statistics, or administration features. All workout and video data lives in local TypeScript files.

## 2. Product and visual direction

The product is a practical premium fitness application rather than a marketing landing page. It uses a fixed dark theme with a graphite background, layered charcoal surfaces, white and light-gray text, and restrained electric-lime accents. Lime is reserved for selection, important badges, focus, and primary actions. Large decorative gradients, strong neon glows, random gym photography, and excessive animation are excluded.

Geist is the primary typeface. Exercise names, set counts, and rep schemes receive the strongest hierarchy. Borders are thin, surfaces are subtly separated, and corner radii stay between 16 and 24 pixels. Motion lasts approximately 180–220 ms and is reduced or disabled when `prefers-reduced-motion: reduce` is active.

## 3. Responsive layout

### Mobile, starting at 360 px

- Use a single content column and touch targets of at least 44 px.
- Keep the header compact.
- Keep the hero between roughly 220 and 300 px depending on the viewport. It contains the program badge, title, short instruction, and both rest-time recommendations without resembling an advertising hero.
- Render the seven-day selector as a smooth horizontal scroller with scroll snapping and no visible scrollbar.
- Render exercise cards in one column. The entire card opens its details, while a visible “Xem hướng dẫn” action explains the behavior.
- Open exercise details in a shadcn/ui Drawer based on Vaul. The drawer occupies about 90–95dvh, has a drag handle, a sticky header, an independently scrolling body, and supports swipe-down, close button, overlay click, and Escape dismissal.

### Tablet and desktop

- Limit the main container to approximately 1180–1280 px.
- Show all seven day cards in a seven-column selector.
- Use a two-column exercise grid. Do not use three columns.
- Replace the mobile Drawer with one centered, large Dialog at an appropriate desktop breakpoint.
- Divide dialog content into information and video regions when width and aspect ratio permit. Use one column for portrait video or constrained widths.

## 4. Day-state behavior

The day selector communicates three independent concepts:

- **Today:** Always retains a visible “Hôm nay” badge, even when another day is selected.
- **Selected:** Uses a lime border, a slightly brighter surface, a very small glow, `aria-selected`, and a non-color visual indicator.
- **Rest day:** Uses neutral, lower-contrast styling and a textual rest indicator.

The initial server render uses a stable `initialDayId` supplied by the Server Component. Because the server cannot reliably know the browser's local timezone, the client determines the actual local day after mount and updates both the selected day and “today” marker. The initial client render exactly matches the server value, and a brief mounted-state treatment prevents an obvious flash when correction is needed. `new Date()` is not called in render JSX.

Changing the selected day closes any open exercise detail and clears the selected exercise ID. Saturday's rest action advances to the next configured workout day. Sunday's action wraps to Monday.

## 5. Architecture

`app/page.tsx` remains a Server Component. It imports the static workout plan and renders the static page shell: app header, compact hero, page container, and footer. It passes the workout data and stable initial day identifier to the interactive planner subtree.

`WorkoutPlanner` is the primary client boundary. Interactive descendants may also be Client Components when they require hooks or event handlers; the goal is a small, explicit client subtree rather than concentrating all behavior in one file.

Suggested responsibilities:

- `AppHeader`, `AppFooter`, `PageContainer`, and the compact hero: static presentation.
- `WorkoutPlanner`: selected day ID, selected exercise ID, open state, local-today resolution, and cross-component coordination.
- `WeeklyDaySelector`: accessible day selection and mobile scroll-snap behavior.
- `WorkoutDayHeader`: selected session title, groups, total exercises, and general note.
- `ExerciseGrid`: renders only for workout days.
- `ExerciseCard`: fully clickable exercise summary with compact set/rep data, note when present, video-status badge, hover, active, and focus-visible states.
- `ResponsiveExerciseDetail`: mounts exactly one overlay implementation based on a media-query hook with a stable mobile-first SSR fallback.
- `ExerciseDetailContent`: shared content for Drawer and Dialog so overlay behavior is not duplicated.
- `ExerciseVideo`: renders only while details are open and only for a validated embed URL.
- `RestDayCard`: recovery message and direct next-workout action.
- Shared primitives: muscle badge, empty-video state, section heading, skeleton, and shadcn/ui components.

The responsive overlay must never mount Drawer and Dialog simultaneously. This prevents duplicate focus traps, duplicate iframes, and divergent state.

## 6. Data model and state

Workout types live in `types/workout.ts`; the full Monday-through-Sunday plan lives in `data/workout-plan.ts`. The data implements the supplied `Exercise`, `ExerciseVideo`, and `WorkoutDay` structures. Only Incline Bench Press receives the supplied portrait YouTube embed. Every other exercise has `embedUrl: null` and a `16:9` placeholder aspect ratio.

Planner state stores identifiers rather than data objects:

- `selectedDayId: string`
- `selectedExerciseId: string | null`
- overlay open/closed state
- resolved local today ID after mount

The selected exercise is derived from the currently selected day's exercises. This prevents stale object state. If a day changes, the overlay closes and the exercise ID resets before the new day content becomes active.

## 7. Pure utilities

`getCurrentWorkoutDay` maps JavaScript `Date.getDay()` values correctly: Sunday 0 through Saturday 6. The core mapping is separately testable with an injected day number or Date.

`findNextWorkoutDay(currentDayId, workoutPlan)` searches forward and wraps at the end. It performs no more iterations than the plan length, returning a safe null result if no workout day exists or configuration is invalid.

`isValidYouTubeEmbedUrl(url)` accepts only:

- the `https:` protocol;
- `youtube.com`, `www.youtube.com`, `youtube-nocookie.com`, or `www.youtube-nocookie.com`;
- a pathname beginning with `/embed/`;
- a valid YouTube video ID segment.

Substring checks such as `includes("youtube.com")` are insufficient and will not be used.

## 8. Exercise details and video

Details include exercise names, muscle groups, description when available, sets, rep scheme, note, technical instructions, and video state. The header remains reachable while content scrolls.

The iframe is not present in the DOM while the overlay is closed. When open, `ExerciseVideo` first validates the URL. A valid video receives a responsive ratio-preserving container, `loading="lazy"`, an accessible title, `allowFullScreen`, the specified permissions, and no autoplay parameter. A 16:9 video fills a horizontal container. A 9:16 video is centered and height-limited so it cannot exceed the usable viewport. The fixed-ratio container and loading skeleton prevent layout shift.

A missing or invalid URL renders a designed empty state and never renders an empty iframe. `dangerouslySetInnerHTML` is not used.

## 9. Rest-day experience

Saturday and Sunday never render `ExerciseGrid`. They render a quieter neutral recovery card with concise guidance for rest, light stretching, or walking. Its action uses `findNextWorkoutDay` to navigate directly to the next training day, including Sunday-to-Monday wrapping.

## 10. Accessibility and interaction

- Use semantic buttons for selectable and clickable controls.
- Ensure all interactive targets are at least approximately 44 px.
- Provide strong `focus-visible` treatment.
- Use `aria-selected` and textual/state indicators so color is never the sole cue.
- Add accessible labels to icon-only buttons.
- Preserve shadcn/Radix/Vaul focus management and Escape behavior.
- Give every iframe a meaningful title.
- Maintain readable contrast for primary and secondary text.
- Disable or reduce transitions under reduced-motion preferences.

## 11. Testing and verification

Use unit tests for pure utilities and focused component tests for core behavior if the installed project setup supports them. Do not add an end-to-end framework solely for this small static site.

Priority checks:

1. Correct mapping from every `Date.getDay()` value to workout data.
2. Next-workout lookup, including Sunday wrapping to Monday and the all-rest guard.
3. The “Hôm nay” badge remains when another day is selected.
4. Changing day closes details and clears the previous exercise.
5. Invalid video URLs never create an iframe.
6. The iframe is absent while the overlay is closed.
7. Only Drawer or Dialog is mounted at a time.
8. Rest days do not render `ExerciseGrid`.

Final verification consists of the available test command, `npm run lint`, and `npm run build`, plus responsive inspection at 360 px, tablet width, and desktop width. TypeScript, ESLint, hydration, focus, and build errors must be resolved before completion.

## 12. Dependencies and boundaries

Add only the frontend dependencies needed for shadcn/ui primitives, Vaul Drawer, Lucide icons, Tailwind class composition, and focused tests where the project does not already provide them. No external API is called at runtime, no environment variables are required, and no feature outside the stated workout-viewing flow is introduced.
