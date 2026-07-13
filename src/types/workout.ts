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
