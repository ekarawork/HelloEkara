"use client";

import {
  MoreVertical,
  UsersRound,
} from "lucide-react";

import type {
  TaskPriority,
  TaskStatus,
} from "@/src/types/employee/task.types";

/* ========================= Types ========================= */

export interface EmployeeTaskChatHeaderData {
  id: number;

  uuid?: string;

  taskCode?: string | null;

  title: string;

  /* ========================= Employees ========================= */

  employeeNames?: string[];

  employeeDesignations?: string[];

  employeeProfileImages?: (string | null)[];

  employeeStatuses?: ("ACTIVE" | "INACTIVE")[];

  status: TaskStatus;

  priority: TaskPriority;

  dueDate?: string | null;
}

/* ========================= Props ========================= */

interface EmployeeTaskChatHeaderProps {
  task: EmployeeTaskChatHeaderData;

  onMenuClick?: () => void;

  disabled?: boolean;
}

/* ========================= Component ========================= */

export default function EmployeeTaskChatHeader({
  task,
  onMenuClick,
  disabled = false,
}: EmployeeTaskChatHeaderProps) {
  /* ========================= Employees ========================= */

  const employeeNames = task.employeeNames ?? [];

  const employeeDesignations =
    task.employeeDesignations ?? [];

  const employeeProfileImages =
    task.employeeProfileImages ?? [];

  const employeeStatuses =
    task.employeeStatuses ?? [];

  const employeeCount = employeeNames.length;

  const visibleEmployeeNames = employeeNames.slice(0, 2);

  const remainingEmployeeCount = Math.max(
    employeeCount - 2,
    0
  );

  const hasEmployees = employeeCount > 0;

  const isAnyEmployeeActive =
    employeeStatuses.length > 0
      ? employeeStatuses.some(
          (status) => status === "ACTIVE"
        )
      : false;

  /* ========================= Display Names ========================= */

  const employeeDisplayName = hasEmployees
    ? visibleEmployeeNames.join(", ")
    : "Unassigned";

  const employeeDisplayNameWithCount = hasEmployees
    ? `${employeeDisplayName}${
        remainingEmployeeCount > 0
          ? ` +${remainingEmployeeCount}`
          : ""
      }`
    : "Unassigned";

  /* ========================= Designations ========================= */

  const filteredDesignations =
    employeeDesignations.filter(Boolean);

  const visibleDesignations =
    filteredDesignations.slice(0, 2);

  const remainingDesignationCount = Math.max(
    filteredDesignations.length - 2,
    0
  );

  const designationText = hasEmployees
    ? visibleDesignations.length > 0
      ? `${visibleDesignations.join(", ")}${
          remainingDesignationCount > 0
            ? ` +${remainingDesignationCount} more`
            : ""
        }`
      : "Employee"
    : "No employee assigned";

  /* ========================= Group Avatar ========================= */

  const avatarImages = employeeProfileImages
    .filter(Boolean)
    .slice(0, 2) as string[];

  const avatarInitials = employeeNames
    .slice(0, 2)
    .map((name) => getInitials(name));

  return (
    <>
      {/* ========================= Employee Header ========================= */}

      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
        <div className="flex min-w-0 items-center gap-3">
          {/* ========================= Group Avatar ========================= */}

          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
            {hasEmployees ? (
              avatarImages.length > 0 ? (
                <div className="relative h-10 w-10">
                  {/* ========================= First Avatar ========================= */}

                  {avatarImages[0] ? (
                    <img
                      src={avatarImages[0]}
                      alt={
                        employeeNames[0] || "Employee"
                      }
                      className="absolute left-0 top-0 h-8 w-8 rounded-full border-2 border-white object-cover"
                    />
                  ) : (
                    <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-[10px] font-bold text-blue-700">
                      {avatarInitials[0] || "EM"}
                    </div>
                  )}

                  {/* ========================= Second Avatar ========================= */}

                  {employeeCount > 1 &&
                    (avatarImages[1] ? (
                      <img
                        src={avatarImages[1]}
                        alt={
                          employeeNames[1] || "Employee"
                        }
                        className="absolute bottom-0 right-0 h-7 w-7 rounded-full border-2 border-white object-cover"
                      />
                    ) : (
                      <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-[9px] font-bold text-indigo-700">
                        {avatarInitials[1] || "EM"}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#2E3192]/10 text-[#2E3192]">
                  <UsersRound className="h-5 w-5" />

                  {isAnyEmployeeActive && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                  )}
                </div>
              )
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <UsersRound className="h-5 w-5" />
              </div>
            )}
          </div>

          {/* ========================= Employee Information ========================= */}

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-900">
              {employeeDisplayNameWithCount}
            </h2>

            <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
              {hasEmployees ? (
                <>
                  <UsersRound className="h-3 w-3 shrink-0 text-slate-400" />

                  <p className="truncate text-xs text-slate-500">
                    Group Chat
                  </p>

                  <span className="text-slate-300">
                    •
                  </span>

                  <p className="shrink-0 text-xs text-slate-500">
                    {employeeCount}{" "}
                    {employeeCount === 1
                      ? "member"
                      : "members"}
                  </p>
                </>
              ) : (
                <p className="truncate text-xs text-slate-500">
                  {designationText}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ========================= Header Menu ========================= */}

        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            disabled={disabled}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Task menu"
            title="Task menu"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        )}
      </header>

      {/* ========================= Task Context ========================= */}

      <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          {/* ========================= Task Information ========================= */}

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-slate-800">
                {task.title}
              </h3>

              <EmployeeTaskStatusBadge
                status={task.status}
              />
            </div>

            <div className="mt-1 flex min-w-0 items-center gap-2">
              {task.taskCode && (
                <span className="shrink-0 text-[10px] font-medium text-slate-400">
                  {task.taskCode}
                </span>
              )}

              {task.taskCode && (
                <span className="text-[9px] text-slate-300">
                  •
                </span>
              )}

              <p className="truncate text-xs text-slate-500">
                {task.dueDate
                  ? `Due ${formatDueDate(task.dueDate)}`
                  : "No due date"}
              </p>
            </div>
          </div>

          {/* ========================= Priority ========================= */}

          <EmployeeTaskPriorityBadge
            priority={task.priority}
          />
        </div>
      </div>
    </>
  );
}

/* ========================= Status Badge ========================= */

function EmployeeTaskStatusBadge({
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
      className: "bg-emerald-50 text-emerald-600",
    },
  };

  const item = config[status];

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}

/* ========================= Priority Badge ========================= */

function EmployeeTaskPriorityBadge({
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
      className: "text-slate-500",
    },

    MEDIUM: {
      label: "Medium",
      className: "text-amber-600",
    },

    HIGH: {
      label: "High",
      className: "text-red-500",
    },

    URGENT: {
      label: "Urgent",
      className: "text-red-600",
    },
  };

  const item = config[priority];

  return (
    <span
      className={`shrink-0 text-[10px] font-semibold ${item.className}`}
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

function formatDueDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}