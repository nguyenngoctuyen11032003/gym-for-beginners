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
        <DialogContent className="flex max-h-[90dvh] max-w-5xl gap-0 overflow-hidden rounded-[24px] border-white/[0.12] bg-card-elevated p-0 text-foreground shadow-[0_34px_110px_rgb(0_0_0/0.58),0_0_54px_rgb(197_244_103/0.055),inset_0_1px_0_rgb(255_255_255/0.05)]" data-testid="exercise-dialog">
          <ExerciseDetailContent exercise={exercise} onClose={() => onOpenChange(false)} variant="dialog" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer onOpenChange={onOpenChange} open={open}>
      <DrawerContent className="h-[94dvh] border-white/[0.12] bg-card-elevated text-foreground shadow-[0_-24px_70px_rgb(0_0_0/0.5),0_0_44px_rgb(197_244_103/0.045)]" data-testid="exercise-drawer">
        <ExerciseDetailContent exercise={exercise} onClose={() => onOpenChange(false)} variant="drawer" />
      </DrawerContent>
    </Drawer>
  );
}
