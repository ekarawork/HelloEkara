"use client";

import {
  CheckCircle2,
  Circle,
  Eye,
  LoaderCircle,
} from "lucide-react";

import type {
  TaskStatus,
} from "@/src/types/admin/task.types";

/* ========================= Types ========================= */

interface TaskStatusOptionWithDescription {
  value: TaskStatus;
  label: string;
  description: string;
}

/* ========================= Constants ========================= */

export const TASK_STATUS_OPTIONS: TaskStatusOptionWithDescription[] =
  [
    {
      value: "TODO",
      label: "To Do",
      description:
        "Task has not been started yet.",
    },
    {
      value: "IN_PROGRESS",
      label: "In Progress",
      description:
        "Task is currently being worked on.",
    },
    {
      value: "IN_REVIEW",
      label: "In Review",
      description:
        "Task is waiting for review.",
    },
    {
      value: "COMPLETED",
      label: "Completed",
      description:
        "Task has been completed.",
    },
  ];

/* ========================= Props ========================= */

interface TaskStatusProps {
  status: TaskStatus;

  onChange?: (
    status: TaskStatus
  ) => void;

  disabled?: boolean;

  compact?: boolean;
}

/* ========================= Component ========================= */

export default function TaskStatus({
  status,
  onChange,
  disabled = false,
  compact = false,
}: TaskStatusProps) {
  /* ========================= Compact Mode ========================= */

  if (compact) {
    return (
      <CompactTaskStatus
        status={status}
      />
    );
  }

  return (
    <div className="w-full">
      {/* ========================= Header ========================= */}

      <div className="mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Task Status
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Update the current progress stage of
          this task.
        </p>
      </div>

      {/* ========================= Status Options ========================= */}

      <div className="space-y-2">
        {TASK_STATUS_OPTIONS.map(
          (option) => {
            const isActive =
              option.value === status;

            return (
              <button
                key={option.value}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onChange?.(
                    option.value
                  )
                }
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  isActive
                    ? getActiveClass(
                        option.value
                      )
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                } ${
                  disabled
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >
                {/* ========================= Icon ========================= */}

                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isActive
                      ? getIconContainerClass(
                          option.value
                        )
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  {getStatusIcon(
                    option.value,
                    isActive
                  )}
                </div>

                {/* ========================= Content ========================= */}

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-semibold ${
                      isActive
                        ? getTextClass(
                            option.value
                          )
                        : "text-slate-700"
                    }`}
                  >
                    {option.label}
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
                    {option.description}
                  </p>
                </div>

                {/* ========================= Selected Indicator ========================= */}

                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    isActive
                      ? getRadioClass(
                          option.value
                        )
                      : "border-slate-300"
                  }`}
                >
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </div>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}

/* ========================= Compact Status ========================= */

function CompactTaskStatus({
  status,
}: {
  status: TaskStatus;
}) {
  const option =
    TASK_STATUS_OPTIONS.find(
      (item) => item.value === status
    );

  if (!option) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${getBadgeClass(
        status
      )}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${getDotClass(
          status
        )}`}
      />

      {option.label}
    </span>
  );
}

/* ========================= Status Icon ========================= */

function getStatusIcon(
  status: TaskStatus,
  active: boolean
) {
  const className = "h-4 w-4";

  switch (status) {
    case "TODO":
      return (
        <Circle
          className={className}
        />
      );

    case "IN_PROGRESS":
      return (
        <LoaderCircle
          className={`${className} ${
            active
              ? "animate-spin"
              : ""
          }`}
        />
      );

    case "IN_REVIEW":
      return (
        <Eye
          className={className}
        />
      );

    case "COMPLETED":
      return (
        <CheckCircle2
          className={className}
        />
      );

    default:
      return null;
  }
}

/* ========================= Style Helpers ========================= */

function getActiveClass(
  status: TaskStatus
) {
  const classes: Record<
    TaskStatus,
    string
  > = {
    TODO:
      "border-slate-300 bg-slate-50",

    IN_PROGRESS:
      "border-blue-200 bg-blue-50/60",

    IN_REVIEW:
      "border-amber-200 bg-amber-50/60",

    COMPLETED:
      "border-emerald-200 bg-emerald-50/60",
  };

  return classes[status];
}

function getIconContainerClass(
  status: TaskStatus
) {
  const classes: Record<
    TaskStatus,
    string
  > = {
    TODO:
      "bg-slate-100 text-slate-600",

    IN_PROGRESS:
      "bg-blue-100 text-blue-600",

    IN_REVIEW:
      "bg-amber-100 text-amber-600",

    COMPLETED:
      "bg-emerald-100 text-emerald-600",
  };

  return classes[status];
}

function getTextClass(
  status: TaskStatus
) {
  const classes: Record<
    TaskStatus,
    string
  > = {
    TODO: "text-slate-700",

    IN_PROGRESS:
      "text-blue-700",

    IN_REVIEW:
      "text-amber-700",

    COMPLETED:
      "text-emerald-700",
  };

  return classes[status];
}

function getRadioClass(
  status: TaskStatus
) {
  const classes: Record<
    TaskStatus,
    string
  > = {
    TODO:
      "border-slate-500 text-slate-500",

    IN_PROGRESS:
      "border-blue-500 text-blue-500",

    IN_REVIEW:
      "border-amber-500 text-amber-500",

    COMPLETED:
      "border-emerald-500 text-emerald-500",
  };

  return classes[status];
}

function getBadgeClass(
  status: TaskStatus
) {
  const classes: Record<
    TaskStatus,
    string
  > = {
    TODO:
      "bg-slate-100 text-slate-600",

    IN_PROGRESS:
      "bg-blue-50 text-blue-600",

    IN_REVIEW:
      "bg-amber-50 text-amber-600",

    COMPLETED:
      "bg-emerald-50 text-emerald-600",
  };

  return classes[status];
}

function getDotClass(
  status: TaskStatus
) {
  const classes: Record<
    TaskStatus,
    string
  > = {
    TODO: "bg-slate-500",

    IN_PROGRESS:
      "bg-blue-500",

    IN_REVIEW:
      "bg-amber-500",

    COMPLETED:
      "bg-emerald-500",
  };

  return classes[status];
}
