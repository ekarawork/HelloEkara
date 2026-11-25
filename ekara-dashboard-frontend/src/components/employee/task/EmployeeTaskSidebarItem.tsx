"use client";

import { UsersRound } from "lucide-react";

/* ========================= Types ========================= */

export type EmployeeTaskSidebarItemStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "COMPLETED";

export interface EmployeeTaskSidebarItemData {
  id: number;

  title: string;

  employeeNames: string[];

  employeeDesignations: string[];

  employeeInitials: string[];

  employeeProfileImages: (string | null)[];

  preview: string;

  time: string;

  status: EmployeeTaskSidebarItemStatus;

  unread?: number;

  employeeStatuses?: ("ACTIVE" | "INACTIVE")[];
}

/* ========================= Props ========================= */

interface EmployeeTaskSidebarItemProps {
  task: EmployeeTaskSidebarItemData;

  selected?: boolean;

  onClick?: () => void;
}

/* ========================= Component ========================= */

export default function EmployeeTaskSidebarItem({
  task,
  selected = false,
  onClick,
}: EmployeeTaskSidebarItemProps) {
  const employeeCount = task.employeeNames?.length ?? 0;

  const visibleEmployeeNames = (
    task.employeeNames ?? []
  ).slice(0, 2);

  const remainingEmployeeCount = Math.max(
    employeeCount - 2,
    0
  );

  const visibleDesignations = (
    task.employeeDesignations ?? []
  ).slice(0, 2);

  const remainingDesignationCount = Math.max(
    (task.employeeDesignations?.length ?? 0) - 2,
    0
  );

  const profileImage = task.employeeProfileImages?.[0];
  const employeeInitial = task.employeeInitials?.[0];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border-b border-slate-100 px-4 py-3.5 text-left transition-colors duration-200 ${
        selected
          ? "bg-indigo-50/80"
          : "bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex min-w-0 gap-3">
        {/* ========================= Avatar ========================= */}

        <div className="relative shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt={employeeInitial || "Employee"}
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
              {employeeInitial || "—"}
            </div>
          )}

          {/* Active employee indicator */}

          {task.employeeStatuses?.[0] === "ACTIVE" && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          )}
        </div>

        {/* ========================= Content ========================= */}

        <div className="min-w-0 flex-1">
          {/* ========================= Title + Time ========================= */}

          <div className="flex min-w-0 items-start justify-between gap-2">
            <h3
              className={`min-w-0 truncate text-sm font-semibold ${
                selected
                  ? "text-indigo-900"
                  : "text-slate-800"
              }`}
            >
              {task.title}
            </h3>

            {task.time && (
              <span className="shrink-0 text-[10px] text-slate-400">
                {task.time}
              </span>
            )}
          </div>

          {/* ========================= Employee Names ========================= */}

          <div className="mt-1 flex min-w-0 items-center gap-1.5">
            <UsersRound
              size={12}
              className="shrink-0 text-slate-400"
            />

            <p className="min-w-0 truncate text-xs text-slate-500">
              {visibleEmployeeNames.length > 0
                ? visibleEmployeeNames.join(", ")
                : "No employee assigned"}

              {remainingEmployeeCount > 0 && (
                <span className="ml-1 font-medium text-indigo-500">
                  +{remainingEmployeeCount}
                </span>
              )}
            </p>
          </div>

          {/* ========================= Designation + Status ========================= */}

          <div className="mt-1 flex min-w-0 items-center gap-2">
            {visibleDesignations.length > 0 && (
              <p className="min-w-0 truncate text-[10px] text-slate-400">
                {visibleDesignations.join(", ")}

                {remainingDesignationCount > 0 && (
                  <span className="ml-1">
                    +{remainingDesignationCount} more
                  </span>
                )}
              </p>
            )}

            <EmployeeTaskStatusBadge
              status={task.status}
            />
          </div>

          {/* ========================= Task Preview ========================= */}

          {task.preview && (
            <p className="mt-1 truncate text-[11px] text-slate-400">
              {task.preview}
            </p>
          )}

          {/* ========================= Unread Count ========================= */}

          {task.unread && task.unread > 0 && (
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

function EmployeeTaskStatusBadge({
  status,
}: {
  status: EmployeeTaskSidebarItemStatus;
}) {
  const statusConfig: Record<
    EmployeeTaskSidebarItemStatus,
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

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}