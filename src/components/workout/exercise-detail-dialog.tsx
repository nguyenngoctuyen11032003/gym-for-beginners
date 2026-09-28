"use client";

import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { Drawer, DrawerContent } from "@/src/components/ui/drawer";
import { ExerciseDetailContent } from "@/src/components/workout/exercise-detail-content";
import { useMediaQuery } from "@/src/hooks/use-media-query";
import type { Exercise } from "@/src/types/workout";

interface ExerciseDetailDialogProps {
  exercise: Exercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExerciseDetailDialog({ exercise, open, onOpenChange }: ExerciseDetailDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)", false);

  if (!exercise) {
    return null;
  }

  if (isDesktop) {
    return (
      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className="flex max-h-[90dvh] max-w-4xl gap-0 overflow-hidden rounded-2xl border-border-strong bg-card-elevated p-0 text-foreground shadow-[0_32px_96px_rgb(0_0_0/0.55)] sm:rounded-2xl" data-testid="exercise-dialog">
          <ExerciseDetailContent exercise={exercise} onClose={() => onOpenChange(false)} variant="dialog" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer onOpenChange={onOpenChange} open={open}>
      <DrawerContent className="h-[94dvh] border-border-strong bg-card-elevated text-foreground" data-testid="exercise-drawer">
        <ExerciseDetailContent exercise={exercise} onClose={() => onOpenChange(false)} variant="drawer" />
      </DrawerContent>
    </Drawer>
  );
}
