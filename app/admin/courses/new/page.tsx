import { CourseForm } from "@/features/courses/course-form";
import type { PageParams } from "@/types/next";
import { PageHeader } from "../../../../src/components/layout/page/page-header";

export default async function RoutePage({}: PageParams) {
  return (
    <div className="container my-6 px-8">
      <PageHeader title="New Course" />
      <CourseForm />
    </div>
  );
}
