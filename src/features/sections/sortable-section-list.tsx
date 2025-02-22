"use client";

import {
  deleteSectionAction,
  updateSectionOrdersAction,
} from "@/actions/section.action";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/utilities/action-button";
import {
  SortableItem,
  SortableList,
} from "@/components/utilities/sortable-list";
import { cn } from "@/lib/utils";
import { CourseSection, CourseStatus } from "@prisma/client";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { LockKeyhole, Trash2 } from "lucide-react";
import { SectionFormDialog } from "./section-form-dialog";

export type SortableSectionListProps = {
  courseId: string;
  sections: Pick<CourseSection, "id" | "name" | "status" | "order">[];
};

export const SortableSectionList = ({
  sections,
  courseId,
}: SortableSectionListProps) => {
  return (
    <SortableList
      items={sections}
      onOrderChange={updateSectionOrdersAction}
      renderItems={(items) => (
        <div className="space-y-1">
          {items.length > 0 ? (
            items.map((section) => (
              <SortableItem
                key={section.id}
                id={section.id}
                className="flex items-center gap-1"
              >
                <div
                  className={cn(
                    "contents space-x-1",
                    section.status === CourseStatus.PRIVATE &&
                      "text-muted-foreground"
                  )}
                >
                  {section.status === CourseStatus.PRIVATE && (
                    <LockKeyhole className="size-4 text-primary" />
                  )}
                  <span>
                    {section.order} - {section.name}
                  </span>
                </div>
                <SectionFormDialog section={section} courseId={courseId}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Modifier
                    </Button>
                  </DialogTrigger>
                </SectionFormDialog>
                <ActionButton
                  action={deleteSectionAction.bind(null, section.id)}
                  requireAreYouSure
                  variant="destructiveOutline"
                  size="sm"
                >
                  <Trash2 />
                  <span className="sr-only">Supprimer</span>
                </ActionButton>
              </SortableItem>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">
              Aucune section
            </span>
          )}
        </div>
      )}
    />
  );
};
