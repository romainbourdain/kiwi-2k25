"use client";

import {
  deleteLessonAction,
  updateLessonsOrderAction,
} from "@/actions/lesson.action";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/utilities/action-button";
import {
  SortableItem,
  SortableList,
} from "@/components/utilities/sortable-list";
import { cn } from "@/lib/utils";
import { CourseLesson, CourseSection, CourseStatus } from "@prisma/client";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { LockKeyhole, Trash2 } from "lucide-react";
import { LessonFormDialog } from "./lesson-form-dialog";

export type SortableLessonListProps = {
  sections: Pick<CourseSection, "id" | "name">[];
  lessons: Pick<
    CourseLesson,
    "id" | "name" | "status" | "description" | "sectionId" | "order"
  >[];
};

export const SortableLessonList = ({
  sections,
  lessons,
}: SortableLessonListProps) => {
  return (
    <SortableList
      items={lessons}
      onOrderChange={updateLessonsOrderAction}
      renderItems={(items) => (
        <div className="space-y-1">
          {items.length > 0 ? (
            items.map((lesson) => (
              <SortableItem
                key={lesson.id}
                id={lesson.id}
                className="flex items-center gap-1"
              >
                <div
                  className={cn(
                    "contents space-x-1",
                    lesson.status === CourseStatus.PRIVATE &&
                      "text-muted-foreground"
                  )}
                >
                  {lesson.status === CourseStatus.PRIVATE && (
                    <LockKeyhole className="size-4 text-primary" />
                  )}
                  <span>
                    {lesson.order} - {lesson.name}
                  </span>
                </div>
                <LessonFormDialog lesson={lesson} sections={sections}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Modifier
                    </Button>
                  </DialogTrigger>
                </LessonFormDialog>
                <ActionButton
                  action={deleteLessonAction.bind(null, lesson.id)}
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
            <span className="text-muted-foreground text-xs">Aucune leçon</span>
          )}
        </div>
      )}
    />
  );
};
