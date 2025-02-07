import { CourseSidebar } from "@/features/courses/course-sidebar";
import type { LayoutParams } from "@/types/next";
import { Suspense } from "react";

export default async function RouteLayout({
  children,
  params,
}: LayoutParams<{ courseId: string }>) {
  const { courseId } = await params;

  return (
    <div className="grid grid-cols-[300px_1fr] gap-8 container my-6 px-8">
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <CourseSidebar courseId={courseId} />
        </Suspense>
      </div>
      <div>{children}</div>
    </div>
  );
}
