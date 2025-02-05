import { getCourseIdTag } from "@/cache/course.cache";
import { PageHeader } from "@/components/layout/page/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseForm } from "@/features/courses/course-form";
import { LessonFormDialog } from "@/features/lessons/lesson-form-dialog";
import { SortableLessonList } from "@/features/lessons/sortable-lesson-list";
import { SectionFormDialog } from "@/features/sections/section-form-dialog";
import { SortableSectionList } from "@/features/sections/sortable-section-list";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import type { PageParams } from "@/types/next";
import { CourseStatus } from "@prisma/client";
import { LockKeyhole, Plus } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";

export default async function RoutePage({
  params,
}: PageParams<{ courseId: string }>) {
  const { courseId } = await params;

  const course = await getCourse(courseId);

  if (course === null) return notFound();

  return (
    <div className="container my-6 px-8">
      <PageHeader title={course.name} />
      <Tabs defaultValue="lessons">
        <TabsList>
          <TabsTrigger value="lessons">Leçons</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
        </TabsList>
        <TabsContent value="lessons">
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle>Sections</CardTitle>
              <SectionFormDialog courseId={course.id}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus /> Nouvelle Section
                  </Button>
                </DialogTrigger>
              </SectionFormDialog>
            </CardHeader>
            <CardContent>
              <SortableSectionList
                courseId={course.id}
                sections={course.courseSections}
              />
            </CardContent>
          </Card>
          <hr className="my-4" />
          <div className="space-y-2">
            {course.courseSections.map((section) => (
              <Card key={section.id}>
                <CardHeader className="flex flex-row justify-between gap-4">
                  <CardTitle
                    className={cn(
                      "flex items-center gap-2",
                      section.status === CourseStatus.PRIVATE &&
                        "text-muted-foreground"
                    )}
                  >
                    {section.status === CourseStatus.PRIVATE && (
                      <LockKeyhole className="text-primary size-5" />
                    )}
                    <span>
                      {section.order} - {section.name}
                    </span>
                  </CardTitle>
                  <LessonFormDialog
                    defaultSectionId={section.id}
                    sections={course.courseSections}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Plus /> Nouvelle Leçon
                      </Button>
                    </DialogTrigger>
                  </LessonFormDialog>
                </CardHeader>
                <CardContent>
                  <SortableLessonList
                    sections={course.courseSections}
                    lessons={section.courseLessons}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Modifier le cours</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseForm course={course} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const getCourse = async (courseId: string) => {
  "use cache";
  cacheTag(getCourseIdTag(courseId));

  const course = await db.course.findFirst({
    where: { id: courseId },
    select: {
      id: true,
      name: true,
      description: true,
      courseSections: {
        orderBy: { order: "asc" },
        select: {
          order: true,
          id: true,
          status: true,
          name: true,
          courseLessons: {
            orderBy: { order: "asc" },
            select: {
              sectionId: true,
              order: true,
              id: true,
              name: true,
              description: true,
              status: true,
            },
          },
        },
      },
    },
  });

  return course;
};
