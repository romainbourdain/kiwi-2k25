"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Course, CourseLesson, CourseSection } from "@prisma/client";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export type CourseSidebarItemsProps = {
  course: Course & {
    courseSections: (CourseSection & {
      courseLessons: (CourseLesson & {
        completed: boolean;
      })[];
    })[];
  };
};

export const CourseSidebarItems = ({ course }: CourseSidebarItemsProps) => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const defaultValue = lessonId
    ? course.courseSections.find((section) =>
        section.courseLessons.find((lesson) => lessonId === lesson.id)
      )
    : course.courseSections[0];

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultValue ? [defaultValue.id] : undefined}
    >
      {course.courseSections.map((section) => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger className="text-lg">
            {section.name}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            {section.courseLessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/courses/${course.id}/lessons/${lesson.id}`}
                className={cn(
                  buttonVariants({
                    variant: lesson.id === lessonId ? "default" : "ghost",
                  }),
                  "justify-start"
                )}
              >
                {lesson.name}
                {lesson.completed && <CheckCircle2 className="ml-auto" />}
              </Link>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
