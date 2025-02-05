"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseLesson, CourseSection } from "@prisma/client";
import { useState, type PropsWithChildren } from "react";
import { LessonForm } from "./lesson-form";

export type LessonFormDialogProps = PropsWithChildren<{
  sections?: Pick<CourseSection, "id" | "name">[];
  defaultSectionId?: string;
  lesson?: Pick<
    CourseLesson,
    "id" | "name" | "status" | "description" | "sectionId"
  >;
}>;

export const LessonFormDialog = ({
  children,
  sections,
  defaultSectionId,
  lesson,
}: LessonFormDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {lesson === undefined
              ? "Nouvelle Leçon"
              : `Modifier ${lesson.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <LessonForm
            lesson={lesson}
            sections={sections}
            defaultSectionId={defaultSectionId}
            onSuccess={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
