import { PageHeader } from "@/components/layout/page/page-header";
import { CourseForm } from "@/features/courses/course-components/course-form";
import type { PageParams } from "@/types/next";

export default async function RoutePage({}: PageParams) {
  return (
    <div className="container my-6 px-8">
      <PageHeader title="New Course" />
      <CourseForm />
    </div>
  );
}
