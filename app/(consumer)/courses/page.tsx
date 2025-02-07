import { getAllCoursesAction } from "@/actions/course.action";
import { Spinner } from "@/components/icons/spinner";
import { PageHeader } from "@/components/layout/page/page-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPlural } from "@/lib/formatters";
import type { PageParams } from "@/types/next";
import Link from "next/link";
import { Suspense } from "react";

export default async function CoursesPage({}: PageParams) {
  return (
    <div className="container my-6 px-8">
      <PageHeader title="Cours" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Suspense fallback={<Spinner />}>
          <CourseGrid />
        </Suspense>
      </div>
    </div>
  );
}

export const CourseGrid = async () => {
  const res = await getAllCoursesAction();
  if (!res?.data) return null;

  if (res.data.length === 0)
    return (
      <div className="flex flex-col gap-2 items-center">
        Aucun cours n&apo;est disponible
      </div>
    );

  return (
    <>
      {res.data.map((course) => (
        <Card key={course.id} className="overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle>{course.name}</CardTitle>
            <CardDescription>
              {formatPlural(course.sectionsCount, {
                plural: "sections",
                singular: "section",
              })}{" "}
              •{" "}
              {formatPlural(course.lessonsCount, {
                plural: "leçons",
                singular: "leçon",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="line-clamp-3" title={course.description}>
            {course.description}
          </CardContent>
          <div className="flex-grow" />
          <CardFooter>
            <Link
              href={`/courses/${course.id}`}
              className={buttonVariants({ variant: "outline" })}
            >
              Voir le cours
            </Link>
          </CardFooter>
          <div
            className="bg-secondary-foreground h-2"
            style={{
              width: `${
                (course.completedLessons / course.lessonsCount) * 100
              }%`,
            }}
          ></div>
        </Card>
      ))}
    </>
  );
};
