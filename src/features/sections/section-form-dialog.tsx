"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseSection } from "@prisma/client";
import { useState, type PropsWithChildren } from "react";
import { SectionForm } from "./section-form";

export type SectionFormDialogProps = PropsWithChildren<{
  courseId: string;
  section?: Pick<CourseSection, "id" | "name" | "status">;
}>;

export const SectionFormDialog = ({
  children,
  courseId,
  section,
}: SectionFormDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {section === undefined
              ? "Nouvelle Section"
              : `Modifier ${section.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <SectionForm
            courseId={courseId}
            section={section}
            onSuccess={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
