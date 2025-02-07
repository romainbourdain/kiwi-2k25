import { getCourseByIdAction } from "@/actions/course.action";
import { PageHeader } from "@/components/layout/page/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { PageParams } from "@/types/next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function RoutePage({
  params,
}: PageParams<{ courseId: string }>) {
  const { courseId } = await params;

  return (
    <div className="container my-6 px-8">
      <Suspense>
        <CourseContent courseId={courseId} />
      </Suspense>
    </div>
  );
}

export const CourseContent = async ({ courseId }: { courseId: string }) => {
  const res = await getCourseByIdAction(courseId);

  if (!res?.data) return notFound();

  console.log(res);
  return (
    <div className="space-y-10">
      <div>
        <PageHeader title={res.data.name} className="mb-2" />
        <p>{res.data.description}</p>
      </div>
      <div className="flex items-center gap-4">
        <Avatar>
          {res.data.author.image && <AvatarImage src={res.data.author.image} />}
          <AvatarFallback>
            {res.data.author.name?.[0].toUpperCase() ?? ""}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Créé par</span>
          <span className="text-lg font-semibold">{res.data.author.name}</span>
        </div>
      </div>
      <div className="text-muted-foreground">
        Dernière modification le{" "}
        {res.data.updatedAt.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
      <Button>Commencer</Button>
      <Separator />
      <div>
        <h2 className="text-2xl font-semibold mb-4">Table des matières</h2>
        <div>
          {res.data.courseSections.map((section) => (
            <div key={section.id} className="mb-8">
              <div className="bg-secondary px-7 py-2 rounded-lg mb-4">
                <span className="uppercase text-sm text-secondary-foreground">
                  Partie {section.order}
                </span>
                <h3 className="text-lg font-semibold">{section.name}</h3>
              </div>
              <div className="mx-5 space-y-4">
                {section.courseLessons.map((lesson) => (
                  <div
                    className="flex w-full items-center gap-2"
                    key={lesson.id}
                  >
                    <div className="border-primary border text-primary rounded-full h-auto size-6 aspect-square flex items-center justify-center">
                      <span className="text-sm">{lesson.order}</span>
                    </div>
                    <Link
                      href={`/courses/${courseId}/lessons/${lesson.id}`}
                      className="font-semibold hover:text-foreground/70 transition-colors"
                    >
                      {lesson.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
