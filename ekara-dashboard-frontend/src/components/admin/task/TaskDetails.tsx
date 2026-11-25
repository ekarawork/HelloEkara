"use client";

import {
  CalendarDays,
  Check,
  Clock3,
  Flag,
  FolderKanban,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/src/types/admin/task.types";

/* ========================= Available Employee ========================= */

export interface TaskAvailableEmployee {
  id: number;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  designation?: string | null;
  profile_image?: string | null;
  status?: "ACTIVE" | "INACTIVE" | string | null;
}

/* ========================= Types ========================= */

export interface TaskDetailsData {
  id: number;
  uuid?: string;
  taskCode?: string | null;

  title: string;
  description?: string | null;

  clientName?: string | null;

  /* ========================= Multiple Employees ========================= */

  employeeNames?: string[];

  employeeDesignations?: string[];

  employeeInitials?: string[];

  employeeProfileImages?: (
    string | null
  )[];

  employeeStatuses?: (
    "ACTIVE" | "INACTIVE"
  )[];

  status: TaskStatus;
  priority: TaskPriority;

  startDate?: string | null;
  dueDate?: string | null;

  estimatedHours?: number | null;
  progress?: number | null;
}

/* ========================= Props ========================= */

interface TaskDetailsProps {
  task?: TaskDetailsData | Task | null;

  onEdit?: () => void;

  onDelete?: () => void | Promise<void>;

  onStatusChange?: (
    status: TaskStatus
  ) => void | Promise<void>;

  /* ========================= Assignment ========================= */

  availableEmployees?: TaskAvailableEmployee[];

  onAssignEmployee?: (
    employeeId: number
  ) => void | Promise<void>;

  isAssigningEmployee?: boolean;

  isUpdatingStatus?: boolean;

  isDeleting?: boolean;
}

/* ========================= Component ========================= */

export default function TaskDetails({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  availableEmployees = [],
  onAssignEmployee,
  isAssigningEmployee = false,
  isUpdatingStatus = false,
  isDeleting = false,
}: TaskDetailsProps) {

  const [isAssignMenuOpen, setIsAssignMenuOpen] =
  useState(false);

const [employeeSearch, setEmployeeSearch] =
  useState("");


const assignedEmployeeIds = useMemo(() => {
  if (!task) {
    return new Set<number>();
  }

  if (!("assignments" in task)) {
    return new Set<number>();
  }

  if (!task.assignments) {
    return new Set<number>();
  }

  return new Set<number>(
    task.assignments
      .map((assignment) =>
        Number(assignment.employee_id)
      )
      .filter((id) => id > 0)
  );
}, [task]);

const filteredEmployees = useMemo(() => {
  const search =
    employeeSearch.trim().toLowerCase();

  return availableEmployees
    .filter(
      (employee) =>
        employee.status !== "INACTIVE"
    )
    .filter(
      (employee) =>
        !assignedEmployeeIds.has(
          Number(employee.id)
        )
    )
    .filter((employee) => {
      if (!search) {
        return true;
      }

      const name =
        employee.name ||
        [
          employee.first_name,
          employee.last_name,
        ]
          .filter(Boolean)
          .join(" ");

      return [
        name,
        employee.designation || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
}, [
  availableEmployees,
  assignedEmployeeIds,
  employeeSearch,
]);
  /* ========================= Empty State ========================= */

  if (!task) {
    return (
      <aside className="flex h-full w-full flex-col items-center justify-center border-l border-slate-200 bg-white px-6 text-center">
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

  const employeeNames =
    details.employeeNames || [];

  const employeeDesignations =
    details.employeeDesignations || [];

  const employeeInitials =
    details.employeeInitials || [];

  const employeeProfileImages =
    details.employeeProfileImages || [];

  const employeeStatuses =
    details.employeeStatuses || [];

  const hasEmployees =
    employeeNames.length > 0;

  const employeeCount =
    employeeNames.length;

  return (
<aside className="flex h-[600px] min-h-0 w-full flex-col border-l border-slate-200 bg-white lg:h-full">
        {/* ========================= Header ========================= */}

      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200 px-5">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Task Details
          </p>

          <h2 className="mt-0.5 truncate text-sm font-semibold text-slate-900">
            {details.taskCode ||
              `Task ${details.id}`}
          </h2>
        </div>

       <div className="flex items-center gap-1">
  {/* ========================= Edit ========================= */}
{onEdit && (
  <button
    type="button"
    onClick={onEdit}
    disabled={
      isUpdatingStatus ||
      isDeleting
    }
    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-all duration-200 hover:bg-[#2E3192]/10 hover:text-[#2E3192] disabled:cursor-not-allowed disabled:opacity-50"
    title="Edit task"
    aria-label="Edit task"
  >
    <Pencil className="h-4 w-4" />
  </button>
)}

  {/* ========================= Delete ========================= */}

  {onDelete && (
    <button
      type="button"
      onClick={onDelete}
      disabled={
        isUpdatingStatus ||
        isDeleting
      }
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      title="Delete task"
      aria-label="Delete task"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )}
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

            <PriorityBadge
              priority={
                details.priority
              }
            />
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

          <div className="mt-2 grid grid-cols-2 gap-2">
            <StatusButton
              label="To Do"
              value="TODO"
              currentStatus={
                details.status
              }
              disabled={
                isUpdatingStatus
              }
              onClick={() =>
                onStatusChange?.(
                  "TODO"
                )
              }
            />

            <StatusButton
              label="In Progress"
              value="IN_PROGRESS"
              currentStatus={
                details.status
              }
              disabled={
                isUpdatingStatus
              }
              onClick={() =>
                onStatusChange?.(
                  "IN_PROGRESS"
                )
              }
            />

            <StatusButton
              label="In Review"
              value="IN_REVIEW"
              currentStatus={
                details.status
              }
              disabled={
                isUpdatingStatus
              }
              onClick={() =>
                onStatusChange?.(
                  "IN_REVIEW"
                )
              }
            />

            <StatusButton
              label="Completed"
              value="COMPLETED"
              currentStatus={
                details.status
              }
              disabled={
                isUpdatingStatus
              }
              onClick={() =>
                onStatusChange?.(
                  "COMPLETED"
                )
              }
            />
          </div>
        </div>

        {/* ========================= Assignment ========================= */}

 {/* ========================= Assignment ========================= */}

<div className="border-b border-slate-100 px-5 py-4">
  <div className="relative">
    {/* ========================= Assignment Header ========================= */}

    <div className="flex items-center justify-between">
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

      {onAssignEmployee && (
       <button
  type="button"
  onClick={() => {
    setIsAssignMenuOpen(
      (current) => !current
    );

    setEmployeeSearch("");
  }}
  disabled={isAssigningEmployee}
  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition-all duration-200 hover:bg-[#2E3192]/10 hover:text-[#2E3192] disabled:cursor-not-allowed disabled:opacity-50"
  title="Add employee"
  aria-label="Add employee"
>
  {isAssignMenuOpen ? (
    <X className="h-3.5 w-3.5" />
  ) : (
    <Plus className="h-3.5 w-3.5" />
  )}
</button>
      )}
    </div>

    {/* ========================= Employee Picker ========================= */}

    {isAssignMenuOpen &&
      onAssignEmployee && (
        <div className="absolute right-0 top-8 z-30 w-[260px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {/* ========================= Search ========================= */}

          <div className="border-b border-slate-100 p-2">
            <div className="flex h-8 items-center gap-2 rounded-lg bg-slate-50 px-2.5">
              <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />

              <input
                type="text"
                value={employeeSearch}
                onChange={(event) =>
                  setEmployeeSearch(
                    event.target.value
                  )
                }
                placeholder="Search employee..."
                autoFocus
                className="min-w-0 flex-1 bg-transparent text-[11px] text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* ========================= Employee List ========================= */}

          <div className="max-h-[220px] overflow-y-auto p-1.5">
            {filteredEmployees.length > 0 ? (
              <div className="space-y-0.5">
                {filteredEmployees.map(
                  (employee) => {
                    const employeeName =
                      employee.name ||
                      [
                        employee.first_name,
                        employee.last_name,
                      ]
                        .filter(Boolean)
                        .join(" ") ||
                      "Employee";

                    const initials =
                      getInitials(
                        employeeName
                      );

                    return (
                      <button
                        key={employee.id}
                        type="button"
                        disabled={
                          isAssigningEmployee
                        }
                        onClick={async () => {
                          await onAssignEmployee(
                            Number(
                              employee.id
                            )
                          );

                          setIsAssignMenuOpen(
                            false
                          );

                          setEmployeeSearch(
                            ""
                          );
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {/* Avatar */}

                        {employee.profile_image ? (
  <img
    src={employee.profile_image}
    alt={employeeName}
    className="h-8 w-8 shrink-0 rounded-full object-cover"
  />
) : (
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2E3192]/10 text-[9px] font-semibold text-[#2E3192]">
    {initials}
  </div>
)}

                        {/* Employee */}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-semibold text-slate-700">
                            {
                              employeeName
                            }
                          </p>

                          {employee.designation && (
                            <p className="mt-0.5 truncate text-[9px] text-slate-400">
                              {
                                employee.designation
                              }
                            </p>
                          )}
                        </div>

                        {isAssigningEmployee && (
                          <div className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="px-3 py-5 text-center">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                  <UsersRound className="h-4 w-4 text-slate-400" />
                </div>

                <p className="mt-2 text-[10px] font-medium text-slate-600">
                  {employeeSearch.trim()
                    ? "No employee found"
                    : "No employees available"}
                </p>

                {!employeeSearch.trim() &&
                  availableEmployees.length >
                    0 && (
                    <p className="mt-0.5 text-[9px] text-slate-400">
                      All available employees
                      are already assigned.
                    </p>
                  )}
              </div>
            )}
          </div>
        </div>
      )}
  </div>

  {/* ========================= Assigned Employees ========================= */}

  {hasEmployees ? (
    <div className="mt-3 space-y-3">
      {employeeNames.map(
        (
          employeeName,
          index
        ) => {
          const designation =
            employeeDesignations[
              index
            ];

          const profileImage =
            employeeProfileImages[
              index
            ];

          const initials =
            employeeInitials[
              index
            ] ||
            getInitials(
              employeeName
            );

          const status =
            employeeStatuses[
              index
            ];

          const isActive =
            status !==
            "INACTIVE";

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

              {/* Employee */}

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
                    {
                      designation
                    }
                  </p>
                )}
              </div>
            </div>
          );
        }
      )}
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
                  {
                    details.clientName
                  }
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Client
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================= Dates ========================= */}

        <div className="border-b border-slate-100 px-5 py-4">
          <SectionLabel label="Schedule" />

          <div className="mt-3 space-y-3">
            {/* Start Date */}

            <DetailRow
              icon={
                <CalendarDays className="h-4 w-4" />
              }
              label="Start Date"
              value={
                formatDate(
                  details.startDate
                ) ||
                "Not set"
              }
            />

            {/* Due Date */}

            <DetailRow
              icon={
                <CalendarDays className="h-4 w-4" />
              }
              label="Due Date"
              value={
                formatDate(
                  details.dueDate
                ) ||
                "Not set"
              }
            />

            {/* Estimated Hours */}

            {typeof details.estimatedHours ===
              "number" && (
              <DetailRow
                icon={
                  <Clock3 className="h-4 w-4" />
                }
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
              icon={
                <FolderKanban className="h-4 w-4" />
              }
              label="Task ID"
              value={
                details.taskCode ||
                `#${details.id}`
              }
            />

            <DetailRow
              icon={
                <UserRound className="h-4 w-4" />
              }
              label="Assigned Employees"
              value={
                hasEmployees
                  ? `${employeeCount} ${
                      employeeCount ===
                      1
                        ? "employee"
                        : "employees"
                    }`
                  : "Unassigned"
              }
            />

            <DetailRow
              icon={
                <Flag className="h-4 w-4" />
              }
              label="Priority"
              value={getPriorityLabel(
                details.priority
              )}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ========================= Normalize Task ========================= */

function normalizeTask(
  task: TaskDetailsData | Task
): TaskDetailsData {
  /*
   * If task is already in UI format,
   * return it directly.
   */

  if (isTaskDetailsData(task)) {
    return {
      ...task,
      employeeNames:
        task.employeeNames || [],
      employeeDesignations:
        task.employeeDesignations || [],
      employeeInitials:
        task.employeeInitials || [],
      employeeProfileImages:
        task.employeeProfileImages || [],
      employeeStatuses:
        task.employeeStatuses || [],
      progress:
        task.progress ?? 0,
    };
  }

  /*
   * Convert central API Task structure
   * into the structure required by this component.
   */

  const assignments =
    task.assignments || [];

  const employees = assignments
    .map(
      (assignment) =>
        assignment.employee
    )
    .filter(Boolean);

  const employeeNames =
    employees.map((employee) =>
      employee
        ? employee.name ||
          [
            employee.first_name,
            employee.last_name,
          ]
            .filter(Boolean)
            .join(" ")
        : ""
    );

  const employeeDesignations =
    employees.map(
      (employee) =>
        employee?.designation || ""
    );

  const employeeInitials =
    employeeNames.map((name) =>
      name
        ? getInitials(name)
        : "EM"
    );

  const employeeProfileImages =
    employees.map(
      (employee) =>
        employee?.profile_image ??
        null
    );

  const employeeStatuses =
  employees.map(
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

    clientName:
      task.client?.name ?? null,

    employeeNames,
    employeeDesignations,
    employeeInitials,
    employeeProfileImages,
    employeeStatuses,

    status: task.status,
    priority: task.priority,

    startDate:
      task.start_date,
    dueDate:
      task.due_date,

    estimatedHours:
      task.estimated_hours,

    progress:
      task.progress ?? 0,
  };
}

/* ========================= Type Guard ========================= */

function isTaskDetailsData(
  task: TaskDetailsData | Task
): task is TaskDetailsData {
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

/* ========================= Status Button ========================= */

function StatusButton({
  label,
  value,
  currentStatus,
  onClick,
  disabled = false,
}: {
  label: string;
  value: TaskStatus;
  currentStatus: TaskStatus;
  onClick: () => void;
  disabled?: boolean;
}) {
  const isActive =
    value === currentStatus;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={
        disabled || isActive
      }
      className={`rounded-lg border px-2 py-2 text-left text-[10px] font-medium transition ${
        isActive
          ? getActiveStatusClass(
              value
            )
          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : ""
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isActive
              ? getStatusDotClass(
                  value
                )
              : "bg-slate-300"
          }`}
        />

        {label}
      </div>
    </button>
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
      className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-semibold ${getPriorityClass(
        priority
      )}`}
    >
      {getPriorityLabel(
        priority
      )}
    </span>
  );
}

/* ========================= Helpers ========================= */

function getInitials(
  name: string
) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part
          .charAt(0)
          .toUpperCase()
      )
      .join("") || "EM"
  );
}

function normalizeProgress(
  progress?: number | null
) {
  const numericProgress =
    Number(progress ?? 0);

  if (
    Number.isNaN(
      numericProgress
    )
  ) {
    return 0;
  }

  return Math.min(
    Math.max(
      numericProgress,
      0
    ),
    100
  );
}

function formatHours(
  hours: number
) {
  return Number.isInteger(hours)
    ? String(hours)
    : hours
        .toFixed(2)
        .replace(
          /\.?0+$/,
          ""
        );
}

function formatDate(
  date?: string | null
) {
  if (!date) {
    return "";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
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

function getPriorityClass(
  priority: TaskPriority
) {
  const classes: Record<
    TaskPriority,
    string
  > = {
    LOW: "bg-slate-50 text-slate-500",
    MEDIUM:
      "bg-amber-50 text-amber-600",
    HIGH:
      "bg-red-50 text-red-600",
    URGENT:
      "bg-red-100 text-red-700",
  };

  return classes[priority];
}

function getActiveStatusClass(
  status: TaskStatus
) {
  const classes: Record<
    TaskStatus,
    string
  > = {
    TODO:
      "border-slate-300 bg-slate-50 text-slate-700",

    IN_PROGRESS:
      "border-blue-200 bg-blue-50 text-blue-700",

    IN_REVIEW:
      "border-amber-200 bg-amber-50 text-amber-700",

    COMPLETED:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return classes[status];
}

function getStatusDotClass(
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