"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Flag,
  FolderKanban,
  UserRound,
  X,
} from "lucide-react";

import TaskStatus from "@/src/components/admin/task/TaskStatus";

import type {
  Task,
  TaskPriority,
  TaskStatus as TaskStatusType,
} from "@/src/types/admin/task.types";

/* ========================= Types ========================= */

export interface TaskDetailsModalData {
  id: number | string;
  uuid?: string;

  taskCode?: string | null;

  title: string;
  description?: string | null;

  clientId?: number | null;
  clientName?: string | null;

  employeeId?: number | null;
  employeeName?: string | null;
  employeeDesignation?: string | null;
  employeeInitials?: string | null;
  employeeAvatar?: string | null;
  employeeProfileImage?: string | null;

  priority: TaskPriority;
  status: TaskStatusType;

  startDate?: string | null;
  dueDate?: string | null;

  estimatedHours?: string | number | null;
  progress?: number | null;

  createdAt?: string | null;
  updatedAt?: string | null;
}

interface TaskDetailsModalProps {
  open: boolean;
  task?: TaskDetailsModalData | Task | null;
  isLoading?: boolean;

  onClose: () => void;

  onEdit?: (task: TaskDetailsModalData) => void;

  onStatusChange?: (status: TaskStatusType) => void;
}

/* ========================= Component ========================= */

export default function TaskDetailsModal({
  open,
  task,
  isLoading = false,
  onClose,
  onEdit,
  onStatusChange,
}: TaskDetailsModalProps) {
  if (!open || !task) {
    return null;
  }

  const normalizedTask =
    normalizeTask(task);

  /* ========================= Close ========================= */

  const handleClose = () => {
    if (isLoading) {
      return;
    }

    onClose();
  };

  /* ========================= Render ========================= */

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          handleClose();
        }
      }}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* ========================= Header ========================= */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FolderKanban className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-500">
                Task Details
              </p>

              <h2 className="truncate text-base font-semibold text-slate-900">
                {normalizedTask.title}
              </h2>

              {normalizedTask.taskCode && (
                <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                  {normalizedTask.taskCode}
                </p>
              )}
            </div>
          </div>

          <div className="ml-4 flex shrink-0 items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() =>
                  onEdit(normalizedTask)
                }
                disabled={isLoading}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ========================= Content ========================= */}

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            {/* ========================= Status / Priority ========================= */}

            <div className="flex flex-wrap items-center gap-2">
              <TaskStatus
                status={normalizedTask.status}
                onChange={onStatusChange}
                disabled={
                  isLoading ||
                  !onStatusChange
                }
                compact
              />

              <PriorityBadge
                priority={
                  normalizedTask.priority
                }
              />

              {normalizedTask.dueDate && (
                <span className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1.5 text-[10px] font-medium text-slate-600">
                  <CalendarDays className="h-3 w-3" />
                  Due{" "}
                  {formatDate(
                    normalizedTask.dueDate
                  )}
                </span>
              )}
            </div>

            {/* ========================= Description ========================= */}

            <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                  <FolderKanban className="h-3.5 w-3.5" />
                </div>

                <h3 className="text-xs font-semibold text-slate-700">
                  Description
                </h3>
              </div>

              {normalizedTask.description ? (
                <p className="whitespace-pre-wrap text-xs leading-5 text-slate-600">
                  {
                    normalizedTask.description
                  }
                </p>
              ) : (
                <p className="text-xs italic text-slate-400">
                  No description added.
                </p>
              )}
            </section>

            {/* ========================= Assignment ========================= */}

            <section>
              <SectionTitle
                icon={
                  <UserRound className="h-4 w-4" />
                }
                title="Assignment"
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Employee */}

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="mb-2 text-[9px] font-medium uppercase tracking-wide text-slate-400">
                    Assigned Employee
                  </p>

                  <div className="flex items-center gap-3">
                    <EmployeeAvatar
                      name={
                        normalizedTask.employeeName
                      }
                      initials={
                        normalizedTask.employeeInitials
                      }
                      avatar={
                        normalizedTask.employeeAvatar
                      }
                    />

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-700">
                        {
                          normalizedTask.employeeName
                        }
                      </p>

                      {normalizedTask.employeeDesignation && (
                        <p className="mt-0.5 truncate text-[10px] text-slate-400">
                          {
                            normalizedTask.employeeDesignation
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Client */}

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="mb-2 text-[9px] font-medium uppercase tracking-wide text-slate-400">
                    Client
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                      <FolderKanban className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-700">
                        {normalizedTask.clientName ||
                          "No client assigned"}
                      </p>

                      {normalizedTask.clientId && (
                        <p className="mt-0.5 text-[9px] text-slate-400">
                          Client #
                          {normalizedTask.clientId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ========================= Schedule ========================= */}

            <section>
              <SectionTitle
                icon={
                  <CalendarDays className="h-4 w-4" />
                }
                title="Schedule"
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <InfoCard
                  label="Start Date"
                  value={
                    normalizedTask.startDate
                      ? formatDate(
                          normalizedTask.startDate
                        )
                      : "Not set"
                  }
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                />

                <InfoCard
                  label="Due Date"
                  value={
                    normalizedTask.dueDate
                      ? formatDate(
                          normalizedTask.dueDate
                        )
                      : "Not set"
                  }
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                />

                <InfoCard
                  label="Estimated Hours"
                  value={formatEstimatedHours(
                    normalizedTask.estimatedHours
                  )}
                  icon={
                    <Clock3 className="h-4 w-4" />
                  }
                />
              </div>
            </section>

            {/* ========================= Progress ========================= */}

            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-slate-700">
                    Task Progress
                  </h3>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Current completion
                  </p>
                </div>

                <span className="text-sm font-semibold text-blue-600">
                  {clampProgress(
                    normalizedTask.progress
                  )}
                  %
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${clampProgress(
                      normalizedTask.progress
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[9px] text-slate-400">
                <span>Started</span>

                <span>
                  {clampProgress(
                    normalizedTask.progress
                  )}
                  % complete
                </span>

                <span>Completed</span>
              </div>
            </section>

            {/* ========================= Task Information ========================= */}

            <section>
              <SectionTitle
                icon={
                  <Flag className="h-4 w-4" />
                }
                title="Task Information"
              />

              <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
                <SimpleInfo
                  label="Task ID"
                  value={`#${normalizedTask.id}`}
                />

                <SimpleInfo
                  label="Priority"
                  value={
                    normalizedTask.priority
                  }
                />

                <SimpleInfo
                  label="Status"
                  value={formatStatus(
                    normalizedTask.status
                  )}
                />

                <SimpleInfo
                  label="Progress"
                  value={`${clampProgress(
                    normalizedTask.progress
                  )}%`}
                />

                {normalizedTask.createdAt && (
                  <SimpleInfo
                    label="Created"
                    value={formatDateTime(
                      normalizedTask.createdAt
                    )}
                  />
                )}

                {normalizedTask.updatedAt && (
                  <SimpleInfo
                    label="Updated"
                    value={formatDateTime(
                      normalizedTask.updatedAt
                    )}
                  />
                )}
              </div>
            </section>

            {/* ========================= Completion Notice ========================= */}

            {normalizedTask.status ===
              "COMPLETED" && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-emerald-700">
                    Task Completed
                  </p>

                  <p className="mt-0.5 text-[10px] text-emerald-600">
                    This task has been marked as
                    completed.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================= Footer ========================= */}

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/70 px-6 py-3">
          <p className="text-[10px] text-slate-400">
            {normalizedTask.taskCode
              ? normalizedTask.taskCode
              : `Task #${normalizedTask.id}`}
          </p>

          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================= Section Title ========================= */

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-blue-500">
        {icon}
      </span>

      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
        {title}
      </h3>
    </div>
  );
}

/* ========================= Info Card ========================= */

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-[9px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="text-xs font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* ========================= Simple Info ========================= */

function SimpleInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-[11px] font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* ========================= Employee Avatar ========================= */

function EmployeeAvatar({
  name,
  initials,
  avatar,
}: {
  name?: string | null;
  initials?: string | null;
  avatar?: string | null;
}) {
  const employeeName =
    name || "Unassigned";

  const fallbackInitials =
    initials ||
    getInitials(employeeName);

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={employeeName}
        className="h-9 w-9 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-600">
      {fallbackInitials}
    </div>
  );
}

/* ========================= Priority Badge ========================= */

function PriorityBadge({
  priority,
}: {
  priority: TaskPriority;
}) {
  return (
    <span
      className={`rounded-md px-2.5 py-1.5 text-[10px] font-medium ${getPriorityClass(
        priority
      )}`}
    >
      {priority}
    </span>
  );
}

/* ========================= Normalize Task ========================= */

function normalizeTask(
  task: TaskDetailsModalData | Task
): TaskDetailsModalData {
  if ("task_code" in task) {
    const employee =
      task.assignments?.[0]?.employee;

    return {
      id: task.id,
      uuid: task.uuid,

      taskCode: task.task_code,

      title: task.title,
      description: task.description,

      clientId: task.client_id,
      clientName:
        task.client?.name ?? null,

      employeeId:
        employee?.id ?? null,

      employeeName:
        employee?.name ??
        "Unassigned",

      employeeDesignation:
        employee?.designation ?? null,

      employeeInitials:
        employee?.name
          ? getInitials(employee.name)
          : null,

      employeeAvatar:
        employee?.profile_image ?? null,

      employeeProfileImage:
        employee?.profile_image ?? null,

      priority: task.priority,
      status: task.status,

      startDate: task.start_date,
      dueDate: task.due_date,

      estimatedHours:
        task.estimated_hours,

      progress: task.progress,

      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  return {
    ...task,

    taskCode:
      task.taskCode ?? null,

    employeeName:
      task.employeeName ??
      "Unassigned",

    employeeAvatar:
      task.employeeAvatar ??
      task.employeeProfileImage ??
      null,

    progress: clampProgress(
      task.progress
    ),
  };
}

/* ========================= Helpers ========================= */

function getInitials(
  name: string
) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getPriorityClass(
  priority: TaskPriority
) {
  switch (priority) {
    case "LOW":
      return "bg-emerald-50 text-emerald-600";

    case "MEDIUM":
      return "bg-blue-50 text-blue-600";

    case "HIGH":
      return "bg-orange-50 text-orange-600";

    case "URGENT":
      return "bg-red-50 text-red-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function formatStatus(
  status: TaskStatusType
) {
  switch (status) {
    case "TODO":
      return "To Do";

    case "IN_PROGRESS":
      return "In Progress";

    case "IN_REVIEW":
      return "In Review";

    case "COMPLETED":
      return "Completed";

    default:
      return status;
  }
}

function formatDate(
  value: string
) {
  const date = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatDateTime(
  value: string
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatEstimatedHours(
  value?: string | number | null
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not set";
  }

  return `${value} hrs`;
}

function clampProgress(
  value?: number | null
) {
  return Math.min(
    100,
    Math.max(0, value ?? 0)
  );
}
