/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import {
  PropsWithChildren,
  ReactNode,
  useId,
  useOptimistic,
  useTransition,
} from "react";
import { Button } from "./ui/button";

export type SortableListProps<T extends { id: string }> = {
  items: T[];
  onOrderChange: (...args: any) => Promise<object | undefined>;
  renderItems: (items: T[]) => ReactNode;
};

export const SortableList = <T extends { id: string }>({
  items,
  onOrderChange,
  renderItems,
}: SortableListProps<T>) => {
  const dndContextId = useId();
  const [optimisticItems, setOptimisticItems] = useOptimistic(items);
  const [, startTransition] = useTransition();
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id.toString();
    const overId = over?.id.toString();
    if (overId === undefined || activeId === undefined) return;

    const getNewArray = (array: T[], activeId: string, overId: string) => {
      const oldIndex = array.findIndex((item) => item.id === activeId);
      const newIndex = array.findIndex((item) => item.id === overId);
      return arrayMove(array, oldIndex, newIndex);
    };

    startTransition(async () => {
      setOptimisticItems((items) => getNewArray(items, activeId, overId));
      const actionData = await onOrderChange(
        getNewArray(optimisticItems, activeId, overId).map((item) => item.id)
      );

      // actionToast({ actionData });
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd} id={dndContextId}>
      <SortableContext items={optimisticItems}>
        <div className="flex flex-col">{renderItems(optimisticItems)}</div>
      </SortableContext>
    </DndContext>
  );
};

export type SortableItemProps = PropsWithChildren<{
  id: string;
  className?: string;
}>;

export const SortableItem = ({
  children,
  id,
  className,
}: SortableItemProps) => {
  const {
    setNodeRef,
    transform,
    transition,
    activeIndex,
    index,
    attributes,
    listeners,
  } = useSortable({ id });
  const isActive = activeIndex === index;
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex gap-2 items-center bg-background rounded-lg p-2",
        isActive && "z-10 border shadow-md"
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="[&_svg]:size-6 px-1"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="text-muted-foreground size-6 p-1" />
      </Button>
      <div className={cn("flex-grow", className)}>{children}</div>
    </div>
  );
};
