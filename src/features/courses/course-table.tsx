import { deleteCourseAction } from "@/actions/course.action";
import { ActionButton } from "@/components/action-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPlural } from "@/lib/formatters";
import { Course } from "@prisma/client";
import { Trash2 } from "lucide-react";
import Link from "next/link";

export type CourseTableProps = {
  courses: (Pick<Course, "id" | "name"> & {
    sectionsCount: number;
    lessonsCount: number;
    studentsCount: number;
  })[];
};

export const CourseTable = ({ courses }: CourseTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            {formatPlural(courses.length, {
              singular: "Cours",
              plural: "Cours",
            })}
          </TableHead>
          <TableHead>Étudiants</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.id}>
            <TableCell>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{course.name}</span>
                <span className="text-muted-foreground">
                  {formatPlural(course.sectionsCount, {
                    singular: "section",
                    plural: "sections",
                  })}{" "}
                  •{" "}
                  {formatPlural(course.lessonsCount, {
                    singular: "leçon",
                    plural: "leçons",
                  })}
                </span>
              </div>
            </TableCell>
            <TableCell>{course.studentsCount}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href={`/admin/courses/${course.id}/edit`}>
                    Modifier
                  </Link>
                </Button>
                <ActionButton
                  action={deleteCourseAction.bind(null, course.id)}
                  variant="destructiveOutline"
                  requireAreYouSure
                >
                  <Trash2 />
                  <span className="sr-only">Delete</span>
                </ActionButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
