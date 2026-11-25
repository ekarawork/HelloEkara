"use client";

import {
  UsersRound,
} from "lucide-react";
/* ========================= Types ========================= */

export type TaskSidebarItemStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "COMPLETED";

export interface TaskSidebarItemData {
  id: number;

  title: string;

  employeeNames: string[];

  employeeDesignations: string[];

  employeeInitials: string[];

  employeeProfileImages: (
    string | null
  )[];

  preview: string;

  time: string;

  status: TaskSidebarItemStatus;

  unread?: number;

  employeeStatuses?: (
    "ACTIVE" | "INACTIVE"
  )[];
}

/* ========================= Props ========================= */

interface TaskSidebarItemProps {
  task: TaskSidebarItemData;

  selected?: boolean;

  onClick?: () => void;
}

/* ========================= Component ========================= */

export default function TaskSidebarItem({
  task,
  selected = false,
  onClick,
}: TaskSidebarItemProps) {
  const employeeCount =
    task.employeeNames.length;

  const visibleEmployeeNames =
    task.employeeNames.slice(0, 2);

  const remainingEmployeeCount =
    Math.max(
      employeeCount - 2,
      0
    );

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border-b border-slate-100 px-4 py-3.5 text-left transition ${
        selected
          ? "bg-indigo-50/80"
          : "bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex gap-3">

        {/* ========================= Avatar ========================= */}

        {/* ========================= Avatar ========================= */}

        <div className="relative shrink-0">

          {task.employeeProfileImages?.[0] ? (
            <img
              src={
                task.employeeProfileImages[0]
              }
              alt={
                task.employeeNames[0] ||
                "Employee"
              }
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div
  className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${
    selected
      ? "bg-[#2E3192] text-white"
      : "bg-slate-100 text-slate-600"
  }`}
>
  {task.employeeInitials?.[0] || "—"}
</div>
          )}
        </div>

        {/* ========================= Content ========================= */}

        <div className="min-w-0 flex-1">

          {/* ========================= Title + Time ========================= */}

          <div className="flex items-start justify-between gap-2">

            <h3
              className={`truncate text-sm font-semibold ${
                selected
                  ? "text-indigo-900"
                  : "text-slate-800"
              }`}
            >
              {task.title}
            </h3>

            <span className="shrink-0 text-[10px] text-slate-400">
              {task.time}
            </span>
          </div>

          {/* ========================= Employee ========================= */}

          <div className="mt-0.5 flex items-center gap-1.5">

            <UsersRound
              size={12}
              className="shrink-0 text-slate-400"
            />

            <p className="truncate text-xs text-slate-500">
              {visibleEmployeeNames.join(", ")}

              {remainingEmployeeCount > 0 && (
                <span className="ml-1 font-medium text-indigo-500">
                  +{remainingEmployeeCount}
                </span>
              )}
            </p>
          </div>

{/* ========================= Employee Designation + Status ========================= */}

<div className="mt-0.5 flex min-w-0 items-center gap-2">

  {task.employeeDesignations?.length > 0 && (
    <p className="min-w-0 truncate text-[10px] text-slate-400">
      {task.employeeDesignations
        .slice(0, 2)
        .join(", ")}

      {task.employeeDesignations.length > 2 && (
        <span className="ml-1">
          +{task.employeeDesignations.length - 2} more
        </span>
      )}
    </p>
  )}

  <TaskStatusBadge
    status={task.status}
  />

</div>

{/* ========================= Unread Count ========================= */}

{task.unread &&
  task.unread > 0 && (
    <div className="mt-2 flex justify-end">
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
        {task.unread}
      </span>
    </div>
  )}
        </div>
      </div>
    </button>
  );
}

/* ========================= Status Badge ========================= */

function TaskStatusBadge({
  status,
}: {
  status: TaskSidebarItemStatus;
}) {
  const config = {
    TODO: {
      label: "To Do",

      className:
        "bg-slate-100 text-slate-600",
    },

    IN_PROGRESS: {
      label: "In Progress",

      className:
        "bg-blue-50 text-blue-600",
    },

    IN_REVIEW: {
      label: "In Review",

      className:
        "bg-amber-50 text-amber-600",
    },

    COMPLETED: {
      label: "Completed",

      className:
        "bg-emerald-50 text-emerald-600",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}