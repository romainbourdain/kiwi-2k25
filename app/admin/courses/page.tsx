import { getAllCoursesAction } from "@/actions/course.action";
import { PageHeader } from "@/components/layout/page/page-header";
import { buttonVariants } from "@/components/ui/button";
import { CourseTable } from "@/features/courses/course-table";
import type { PageParams } from "@/types/next";
import Link from "next/link";

export default async function CoursesPage({}: PageParams) {
  const res = await getAllCoursesAction();
  if (!res?.data) return null;

  return (
    <div className="container py-6 px-8">
      <PageHeader title="Courses">
        <Link href="/admin/courses/new" className={buttonVariants()}>
          New Course
        </Link>
      </PageHeader>
      <div className="container py-6 px-8">
        <CourseTable courses={res.data} />
      </div>
    </div>
  );
}
