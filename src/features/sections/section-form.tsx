"use client";

import {
  createSectionAction,
  updateSectionAction,
} from "@/actions/section.action";
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
import { LoadingTextSwap } from "@/components/utilities/action-button";
import { CourseSection, CourseStatus } from "@prisma/client";
import { SectionData, sectionSchema } from "../../schemas/section.schema";

export type SectionFormProps = {
  courseId: string;
  section?: Pick<CourseSection, "id" | "name" | "status">;
  onSuccess?: () => void;
};

export const SectionForm = ({
  section,
  courseId,
  onSuccess,
}: SectionFormProps) => {
  const form = useZodForm({
    schema: sectionSchema,
    defaultValues: section ?? {
      name: "",
      status: CourseStatus.PUBLIC,
    },
  });

  const handleSubmit = async (values: SectionData) => {
    const action =
      section === undefined
        ? createSectionAction.bind(null, courseId)
        : updateSectionAction.bind(null, section.id);
    const response = await action(values);
    // actionToast({ actionData: data });

    if (!response?.serverError) onSuccess?.();
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
            {section === undefined ? "Créer" : "Modifier"}
          </LoadingTextSwap>
        </Button>
      </div>
    </Form>
  );
};
