"use client";

import {
  CalendarDays,
  Clock3,
  Flag,
  FolderKanban,
  UserRound,
  UsersRound,
} from "lucide-react";

import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/src/types/employee/task.types";

/* ========================= Types ========================= */

export interface EmployeeTaskDetailsData {
  id: number;
  uuid?: string;
  taskCode?: string | null;

  title: string;
  description?: string | null;

  clientName?: string | null;

  /* ========================= Employees ========================= */

  employeeNames?: string[];

  employeeDesignations?: string[];

  employeeInitials?: string[];

  employeeProfileImages?: (string | null)[];

  employeeStatuses?: ("ACTIVE" | "INACTIVE")[];

  status: TaskStatus;
  priority: TaskPriority;

  startDate?: string | null;
  dueDate?: string | null;

  estimatedHours?: number | null;
  progress?: number | null;
}

/* ========================= Props ========================= */

interface EmployeeTaskDetailsProps {
  task?: EmployeeTaskDetailsData | Task | null;
}

/* ========================= Component ========================= */

export default function EmployeeTaskDetails({
  task,
}: EmployeeTaskDetailsProps) {
  /* ========================= Empty State ========================= */

  if (!task) {
    return (
      <aside className="flex h-full min-h-0 w-full flex-col items-center justify-center border-l border-slate-200 bg-white px-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          <FolderKanban className="h-5 w-5 text-blue-500" />
        </div>

        <h3 className="text-sm font-semibold text-slate-800">
          No task selected
        </h3>

        <p className="mt-1 max-w-[220px] text-xs leading-5 text-slate-500">
          Select a task to view its details.
        </p>
      </aside>
    );
  }

  /* ========================= Normalize Task ========================= */

  const details = normalizeTask(task);

  const progress = normalizeProgress(
    details.progress
  );

  const employeeNames = details.employeeNames || [];
  const employeeDesignations =
    details.employeeDesignations || [];
  const employeeInitials =
    details.employeeInitials || [];
  const employeeProfileImages =
    details.employeeProfileImages || [];
  const employeeStatuses =
    details.employeeStatuses || [];

  const hasEmployees = employeeNames.length > 0;
  const employeeCount = employeeNames.length;

  return (
    <aside className="flex h-[600px] min-h-0 w-full flex-col border-l border-slate-200 bg-white lg:h-full">
      {/* ========================= Header ========================= */}

      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200 px-5">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Task Details
          </p>

          <h2 className="mt-0.5 truncate text-sm font-semibold text-slate-900">
            {details.taskCode || `Task ${details.id}`}
          </h2>
        </div>
      </div>

      {/* ========================= Content ========================= */}

      <div className="task-scroll min-h-0 flex-1 overflow-y-auto">
        {/* ========================= Task Information ========================= */}

        <div className="border-b border-slate-100 px-5 py-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="min-w-0 text-sm font-semibold leading-5 text-slate-900">
              {details.title}
            </h3>

            <PriorityBadge priority={details.priority} />
          </div>

          {details.description && (
            <p className="whitespace-pre-wrap text-xs leading-5 text-slate-500">
              {details.description}
            </p>
          )}
        </div>

        {/* ========================= Status ========================= */}

        <div className="border-b border-slate-100 px-5 py-4">
          <SectionLabel label="Status" />

          <div className="mt-2">
            <StatusBadge status={details.status} />
          </div>
        </div>

        {/* ========================= Assigned Employees ========================= */}

        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <SectionLabel label="Assigned To" />

            {hasEmployees && (
              <span className="text-[9px] font-medium text-slate-400">
                {employeeCount}{" "}
                {employeeCount === 1
                  ? "employee"
                  : "employees"}
              </span>
            )}
          </div>

          {hasEmployees ? (
            <div className="mt-3 space-y-3">
              {employeeNames.map((employeeName, index) => {
                const designation =
                  employeeDesignations[index];

                const profileImage =
                  employeeProfileImages[index];

                const initials =
                  employeeInitials[index] ||
                  getInitials(employeeName);

                const status =
                  employeeStatuses[index];

                const isActive = status !== "INACTIVE";

                return (
                  <div
                    key={`${employeeName}-${index}`}
                    className="flex items-center gap-3"
                  >
                    {/* Avatar */}

                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={employeeName}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2E3192]/10 text-[10px] font-semibold text-[#2E3192]">
                        {initials}
                      </div>
                    )}

                    {/* Employee Information */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs font-semibold text-slate-800">
                          {employeeName}
                        </p>

                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            isActive
                              ? "bg-emerald-500"
                              : "bg-slate-300"
                          }`}
                          title={
                            isActive
                              ? "Active"
                              : "Inactive"
                          }
                        />
                      </div>

                      {designation && (
                        <p className="mt-0.5 truncate text-[10px] text-slate-400">
                          {designation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                <UsersRound className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Unassigned
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  No employee assigned
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ========================= Client ========================= */}

        {details.clientName && (
          <div className="border-b border-slate-100 px-5 py-4">
            <SectionLabel label="Client" />

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                <FolderKanban className="h-4 w-4 text-slate-500" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-700">
                  {details.clientName}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Client
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================= Schedule ========================= */}

        <div className="border-b border-slate-100 px-5 py-4">
          <SectionLabel label="Schedule" />

          <div className="mt-3 space-y-3">
            <DetailRow
              icon={<CalendarDays className="h-4 w-4" />}
              label="Start Date"
              value={
                formatDate(details.startDate) || "Not set"
              }
            />

            <DetailRow
              icon={<CalendarDays className="h-4 w-4" />}
              label="Due Date"
              value={
                formatDate(details.dueDate) || "Not set"
              }
            />

            {typeof details.estimatedHours === "number" && (
              <DetailRow
                icon={<Clock3 className="h-4 w-4" />}
                label="Estimated Hours"
                value={`${formatHours(
                  details.estimatedHours
                )} hrs`}
              />
            )}
          </div>
        </div>

        {/* ========================= Progress ========================= */}

        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <SectionLabel label="Progress" />

            <span className="text-xs font-semibold text-[#2E3192]">
              {progress}%
            </span>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#2E3192] transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between">
            <span className="text-[9px] text-slate-400">
              Started
            </span>

            <span className="text-[9px] text-slate-400">
              Completed
            </span>
          </div>
        </div>

        {/* ========================= Task Meta ========================= */}

        <div className="px-5 py-4">
          <SectionLabel label="Task Information" />

          <div className="mt-3 space-y-3">
            <DetailRow
              icon={<FolderKanban className="h-4 w-4" />}
              label="Task ID"
              value={
                details.taskCode || `#${details.id}`
              }
            />

            <DetailRow
              icon={<UserRound className="h-4 w-4" />}
              label="Assigned Employees"
              value={
                hasEmployees
                  ? `${employeeCount} ${
                      employeeCount === 1
                        ? "employee"
                        : "employees"
                    }`
                  : "Unassigned"
              }
            />

            <DetailRow
              icon={<Flag className="h-4 w-4" />}
              label="Priority"
              value={getPriorityLabel(details.priority)}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ========================= Normalize Task ========================= */

function normalizeTask(
  task: EmployeeTaskDetailsData | Task
): EmployeeTaskDetailsData {
  /*
   * If task is already in employee UI format,
   * normalize optional arrays and progress.
   */

  if (isTaskDetailsData(task)) {
    return {
      ...task,
      employeeNames: task.employeeNames || [],
      employeeDesignations:
        task.employeeDesignations || [],
      employeeInitials: task.employeeInitials || [],
      employeeProfileImages:
        task.employeeProfileImages || [],
      employeeStatuses: task.employeeStatuses || [],
      progress: task.progress ?? 0,
    };
  }

  /*
   * Convert API Task structure into the
   * structure required by this component.
   */

  const assignments = task.assignments || [];

  const employees = assignments
    .map((assignment) => assignment.employee)
    .filter(Boolean);

  const employeeNames = employees.map((employee) => {
    if (!employee) {
      return "";
    }

    return (
      employee.name ||
      [
        employee.first_name,
        employee.last_name,
      ]
        .filter(Boolean)
        .join(" ") ||
      "Employee"
    );
  });

  const employeeDesignations = employees.map(
    (employee) => employee?.designation || ""
  );

  const employeeInitials = employeeNames.map(
    (name) => (name ? getInitials(name) : "EM")
  );

  const employeeProfileImages = employees.map(
    (employee) => employee?.profile_image ?? null
  );

  const employeeStatuses = employees.map(
    (employee) =>
      employee?.status === "INACTIVE"
        ? "INACTIVE"
        : "ACTIVE"
  );

  return {
    id: task.id,
    uuid: task.uuid,
    taskCode: task.task_code,

    title: task.title,
    description: task.description,

    clientName: task.client?.name ?? null,

    employeeNames,
    employeeDesignations,
    employeeInitials,
    employeeProfileImages,
    employeeStatuses,

    status: task.status,
    priority: task.priority,

    startDate: task.start_date,
    dueDate: task.due_date,

    estimatedHours: task.estimated_hours,
    progress: task.progress ?? 0,
  };
}

/* ========================= Type Guard ========================= */

function isTaskDetailsData(
  task: EmployeeTaskDetailsData | Task
): task is EmployeeTaskDetailsData {
  return "employeeNames" in task;
}

/* ========================= Section Label ========================= */

function SectionLabel({
  label,
}: {
  label: string;
}) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
      {label}
    </p>
  );
}

/* ========================= Detail Row ========================= */

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] text-slate-400">
          {label}
        </p>

        <p className="truncate text-xs font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ========================= Status Badge ========================= */

/* ========================= Status Badge ========================= */

function StatusBadge({
  status,
}: {
  status: TaskStatus;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${getStatusClass(
        status
      )}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${getStatusDotClass(
          status
        )}`}
      />

      {formatStatus(status)}
    </span>
  );
}

/* ========================= Status Helpers ========================= */

function formatStatus(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    IN_REVIEW: "In Review",
    COMPLETED: "Completed",
  };

  return labels[status];
}

function getStatusClass(status: TaskStatus): string {
  const classes: Record<TaskStatus, string> = {
    TODO: "bg-slate-100 text-slate-600",
    IN_PROGRESS: "bg-blue-50 text-blue-600",
    IN_REVIEW: "bg-amber-50 text-amber-600",
    COMPLETED: "bg-emerald-50 text-emerald-600",
  };

  return classes[status];
}

function getStatusDotClass(status: TaskStatus): string {
  const classes: Record<TaskStatus, string> = {
    TODO: "bg-slate-500",
    IN_PROGRESS: "bg-blue-500",
    IN_REVIEW: "bg-amber-500",
    COMPLETED: "bg-emerald-500",
  };

  return classes[status];
}

/* ========================= Priority Badge ========================= */

function PriorityBadge({
  priority,
}: {
  priority: TaskPriority;
}) {
  return (
    <span
      className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-semibold ${getPriorityClass(
        priority
      )}`}
    >
      {getPriorityLabel(priority)}
    </span>
  );
}

/* ========================= Helpers ========================= */

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "EM"
  );
}

function normalizeProgress(
  progress?: number | null
): number {
  const numericProgress = Number(progress ?? 0);

  if (Number.isNaN(numericProgress)) {
    return 0;
  }

  return Math.min(Math.max(numericProgress, 0), 100);
}

function formatHours(hours: number): string {
  return Number.isInteger(hours)
    ? String(hours)
    : hours
        .toFixed(2)
        .replace(/\.?0+$/, "");
}

function formatDate(date?: string | null): string {
  if (!date) {
    return "";
  }

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

function getPriorityLabel(
  priority: TaskPriority
): string {
  const labels: Record<TaskPriority, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
  };

  return labels[priority];
}

function getPriorityClass(
  priority: TaskPriority
): string {
  const classes: Record<TaskPriority, string> = {
    LOW: "bg-slate-50 text-slate-500",
    MEDIUM: "bg-amber-50 text-amber-600",
    HIGH: "bg-red-50 text-red-600",
    URGENT: "bg-red-100 text-red-700",
  };

  return classes[priority];
}