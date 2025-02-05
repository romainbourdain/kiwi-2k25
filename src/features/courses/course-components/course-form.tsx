"use client";

import { createCourse, updateCourse } from "@/actions/course.action";
import { LoadingTextSwap } from "@/components/action-button";
import { RequiredLabelIcon } from "@/components/icons/required-label-icon";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CourseData, courseSchema } from "@/features/courses/course.schema";
import { actionToast } from "@/lib/action";
import { Course } from "@prisma/client";

export type CourseFormProps = {
  course?: Pick<Course, "id" | "name" | "description">;
};

export const CourseForm = ({ course }: CourseFormProps) => {
  const form = useZodForm({
    schema: courseSchema,
    defaultValues: course ?? {
      name: "",
      description: "",
    },
  });

  const handleSubmit = async (values: CourseData) => {
    const action =
      course === undefined ? createCourse : updateCourse.bind(null, course.id);
    const data = await action(values);
    actionToast({ actionData: data });
  };

  return (
    <Form form={form} onSubmit={handleSubmit} className="flex gap-6 flex-col">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <RequiredLabelIcon />
              Nom
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <RequiredLabelIcon />
              Description
            </FormLabel>
            <FormControl>
              <Textarea className="min-h-20 resize-none" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="self-end">
        <Button disabled={form.formState.isSubmitting} type="submit">
          <LoadingTextSwap isLoading={form.formState.isSubmitting}>
            {course === undefined ? "Créer" : "Modifier"}
          </LoadingTextSwap>
        </Button>
      </div>
    </Form>
  );
};
