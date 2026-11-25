"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flag,
  UserRound,
} from "lucide-react";

import type {
  TaskPriority,
  TaskStatus,
} from "@/src/types/admin/task.types";

/* ========================= Types ========================= */

export interface TaskCardData {
  id: number;
  taskCode?: string | null;
  title: string;
  description?: string | null;

  employeeName?: string | null;
  employeeDesignation?: string | null;
  employeeInitials?: string;
  employeeProfileImage?: string | null;

  status: TaskStatus;
  priority: TaskPriority;

  dueDate?: string | null;
  progress?: number;
}

/* ========================= Props ========================= */

interface TaskCardProps {
  task: TaskCardData;
  compact?: boolean;
  onClick?: () => void;
}

/* ========================= Component ========================= */

export default function TaskCard({
  task,
  compact = false,
  onClick,
}: TaskCardProps) {
  const progress =
    typeof task.progress === "number"
      ? Math.min(Math.max(task.progress, 0), 100)
      : null;

  return (
    <div
      onClick={onClick}
      className={`w-full rounded-xl border border-slate-200 bg-white text-left shadow-sm transition ${
        onClick
          ? "cursor-pointer hover:border-blue-200 hover:shadow-md"
          : ""
      }`}
    >
      {/* ========================= Header ========================= */}

      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {task.taskCode
                ? task.taskCode
                : `Task #${task.id}`}
            </span>

            <TaskStatusBadge status={task.status} />
          </div>

          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
            {task.title}
          </h3>
        </div>

        <TaskPriorityBadge priority={task.priority} />
      </div>

      {/* ========================= Description ========================= */}

      {!compact && task.description && (
        <div className="px-4 pt-3">
          <p className="line-clamp-2 text-xs leading-5 text-slate-500">
            {task.description}
          </p>
        </div>
      )}

      {/* ========================= Employee ========================= */}

      <div className="flex items-center gap-3 px-4 py-3">
        {/* Avatar */}

        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-[10px] font-semibold text-blue-600">
          {task.employeeProfileImage ? (
            <img
              src={task.employeeProfileImage}
              alt={task.employeeName || "Employee"}
              className="h-full w-full object-cover"
            />
          ) : task.employeeName ? (
            task.employeeInitials ||
            getInitials(task.employeeName)
          ) : (
            <UserRound className="h-4 w-4" />
          )}
        </div>

        {/* Employee Details */}

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-slate-700">
            {task.employeeName || "Unassigned"}
          </p>

          {task.employeeDesignation && (
            <p className="truncate text-[10px] text-slate-400">
              {task.employeeDesignation}
            </p>
          )}
        </div>
      </div>

      {/* ========================= Meta Information ========================= */}

      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 px-4 py-3">
        {/* Due Date */}

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50">
            <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] text-slate-400">
              Due Date
            </p>

            <p className="truncate text-[10px] font-medium text-slate-600">
              {task.dueDate
                ? formatDueDate(task.dueDate)
                : "Not set"}
            </p>
          </div>
        </div>

        {/* Priority */}

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50">
            <Flag className="h-3.5 w-3.5 text-slate-500" />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] text-slate-400">
              Priority
            </p>

            <p
              className={`truncate text-[10px] font-medium ${getPriorityTextClass(
                task.priority
              )}`}
            >
              {getPriorityLabel(task.priority)}
            </p>
          </div>
        </div>
      </div>

      {/* ========================= Progress ========================= */}

      {progress !== null && (
        <div className="border-t border-slate-100 px-4 py-3">
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />

              <span className="text-[10px] font-medium text-slate-500">
                Progress
              </span>
            </div>

            <span className="text-[10px] font-semibold text-slate-600">
              {progress}%
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* ========================= Footer ========================= */}

      {!compact && (
        <div className="flex items-center gap-1.5 border-t border-slate-100 px-4 py-2.5">
          <Clock3 className="h-3 w-3 text-slate-400" />

          <span className="text-[9px] text-slate-400">
            Task conversation
          </span>
        </div>
      )}
    </div>
  );
}

/* ========================= Status Badge ========================= */

function TaskStatusBadge({
  status,
}: {
  status: TaskStatus;
}) {
  const config: Record<
    TaskStatus,
    {
      label: string;
      className: string;
    }
  > = {
    TODO: {
      label: "To Do",
      className: "bg-slate-100 text-slate-600",
    },

    IN_PROGRESS: {
      label: "In Progress",
      className: "bg-blue-50 text-blue-600",
    },

    IN_REVIEW: {
      label: "In Review",
      className: "bg-amber-50 text-amber-600",
    },

    COMPLETED: {
      label: "Completed",
      className:
        "bg-emerald-50 text-emerald-600",
    },
  };

  const item = config[status];

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}

/* ========================= Priority Badge ========================= */

function TaskPriorityBadge({
  priority,
}: {
  priority: TaskPriority;
}) {
  const config: Record<
    TaskPriority,
    {
      label: string;
      className: string;
    }
  > = {
    LOW: {
      label: "Low",
      className:
        "bg-slate-50 text-slate-500",
    },

    MEDIUM: {
      label: "Medium",
      className:
        "bg-amber-50 text-amber-600",
    },

    HIGH: {
      label: "High",
      className:
        "bg-red-50 text-red-600",
    },

    URGENT: {
      label: "Urgent",
      className:
        "bg-red-100 text-red-700",
    },
  };

  const item = config[priority];

  return (
    <span
      className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-semibold ${item.className}`}
    >
      {item.label}
    </span>
  );
}

/* ========================= Helpers ========================= */

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("") || "EM"
  );
}

function getPriorityLabel(
  priority: TaskPriority
) {
  const labels: Record<
    TaskPriority,
    string
  > = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
  };

  return labels[priority];
}

function getPriorityTextClass(
  priority: TaskPriority
) {
  const classes: Record<
    TaskPriority,
    string
  > = {
    LOW: "text-slate-500",
    MEDIUM: "text-amber-600",
    HIGH: "text-red-600",
    URGENT: "text-red-700",
  };

  return classes[priority];
}

function formatDueDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}
