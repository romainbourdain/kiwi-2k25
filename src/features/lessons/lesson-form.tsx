"use client";

import { createLesson, updateLesson } from "@/actions/lesson.action";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { actionToast } from "@/lib/action";
import { CourseLesson, CourseSection, CourseStatus } from "@prisma/client";
import { LessonData, lessonSchema } from "../../schemas/lesson.schema";

export type LessonFormProps = {
  sections?: Pick<CourseSection, "id" | "name">[];
  defaultSectionId?: string;
  lesson?: Pick<
    CourseLesson,
    "id" | "name" | "status" | "description" | "sectionId"
  >;
  onSuccess?: () => void;
};

export const LessonForm = ({
  sections,
  defaultSectionId,
  lesson,
  onSuccess,
}: LessonFormProps) => {
  const form = useZodForm({
    schema: lessonSchema,
    defaultValues: {
      name: lesson?.name ?? "",
      status: lesson?.status ?? CourseStatus.PUBLIC,
      description: lesson?.description ?? "",
      sectionId:
        lesson?.sectionId ?? defaultSectionId ?? sections?.[0]?.id ?? "",
    },
  });

  const handleSubmit = async (values: LessonData) => {
    const action =
      lesson === undefined ? createLesson : updateLesson.bind(null, lesson.id);
    const data = await action(values);
    actionToast({ actionData: data });

    if (!data.error) onSuccess?.();
  };

  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      className="flex gap-6 flex-col @container"
    >
      <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
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
                <Textarea
                  className="min-h-20 resize-none"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sectionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sections?.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CourseStatus.PUBLIC}>Public</SelectItem>
                    <SelectItem value={CourseStatus.PRIVATE}>Privé</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="self-end">
        <Button disabled={form.formState.isSubmitting} type="submit">
          <LoadingTextSwap isLoading={form.formState.isSubmitting}>
            {lesson === undefined ? "Créer" : "Modifier"}
          </LoadingTextSwap>
        </Button>
      </div>
    </Form>
  );
};
