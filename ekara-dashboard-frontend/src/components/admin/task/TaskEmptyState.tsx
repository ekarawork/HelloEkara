"use client";

import {
  ClipboardList,
  MessageSquare,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";

/* ========================= Types ========================= */

export type TaskEmptyStateType =
  | "no-tasks"
  | "no-results"
  | "no-selection";

interface TaskEmptyStateProps {
  type?: TaskEmptyStateType;

  title?: string;
  description?: string;

  onCreateTask?: () => void;
  onResetFilters?: () => void;

  className?: string;
}

/* ========================= Component ========================= */

export default function TaskEmptyState({
  type = "no-tasks",
  title,
  description,
  onCreateTask,
  onResetFilters,
  className = "",
}: TaskEmptyStateProps) {
  const config =
    getEmptyStateConfig(type);

  const finalTitle =
    title ?? config.title;

  const finalDescription =
    description ?? config.description;

  const Icon = config.icon;

  return (
    <div
      className={`
        flex
        min-h-[360px]
        w-full
        flex-col
        items-center
        justify-center
        px-6
        py-10
        text-center
        ${className}
      `}
    >
      {/* ========================= Icon ========================= */}

      <div
        className="
          mb-5
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          bg-[#2E3192]/10
          text-[#2E3192]
        "
      >
        <Icon
          size={30}
          strokeWidth={1.8}
        />
      </div>

      {/* ========================= Title ========================= */}

      <h3 className="text-base font-semibold text-slate-800">
        {finalTitle}
      </h3>

      {/* ========================= Description ========================= */}

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {finalDescription}
      </p>

      {/* ========================= Actions ========================= */}

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {/* ========================= Create Task ========================= */}

        {type === "no-tasks" &&
          onCreateTask && (
            <button
              type="button"
              onClick={onCreateTask}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[#2E3192]
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-[#27297f]
                hover:shadow-md
                focus:outline-none
                focus:ring-2
                focus:ring-[#2E3192]/20
              "
            >
              <Plus size={16} />

              Create Task
            </button>
          )}

        {/* ========================= Reset Filters ========================= */}

        {type === "no-results" &&
          onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-slate-600
                transition-all
                duration-200
                hover:border-[#2E3192]/20
                hover:bg-[#2E3192]/10
                hover:text-[#2E3192]
                focus:outline-none
                focus:ring-2
                focus:ring-[#2E3192]/10
              "
            >
              <RotateCcw size={15} />

              Reset Filters
            </button>
          )}
      </div>
    </div>
  );
}

/* ========================= Configuration ========================= */

interface EmptyStateConfig {
  icon: typeof ClipboardList;
  title: string;
  description: string;
}

function getEmptyStateConfig(
  type: TaskEmptyStateType
): EmptyStateConfig {
  switch (type) {
    case "no-results":
      return {
        icon: Search,
        title: "No tasks found",
        description:
          "We couldn't find any tasks matching your search or selected filters.",
      };

    case "no-selection":
      return {
        icon: MessageSquare,
        title: "Select a task",
        description:
          "Select a task from the list to view its conversation and details.",
      };

    case "no-tasks":
    default:
      return {
        icon: ClipboardList,
        title: "No tasks yet",
        description:
          "Create your first task and start assigning work to your employees.",
      };
  }
}