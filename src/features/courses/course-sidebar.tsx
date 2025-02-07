import { getCourseByIdAction } from "@/actions/course.action";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseSidebarItems } from "./course-sidebar-items";

export const CourseSidebar = async ({ courseId }: { courseId: string }) => {
  const res = await getCourseByIdAction(courseId);

  if (!res?.data) return notFound();

  return (
    <>
      <Link
        className="text-lg font-semibold hover:underline block"
        href={`/courses/${courseId}`}
      >
        {res.data.name}
      </Link>
      <CourseSidebarItems course={res.data} />
    </>
  );
};
