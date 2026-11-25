"use client";

import { useRouter } from "next/navigation";

import {
  CalendarDays,
  ClipboardList,
  UserRound,
  ArrowRight,
} from "lucide-react";

import {
  EmployeeDashboardTask,
  EmployeeTaskPriority,
  EmployeeTaskStatus,
} from "@/src/types/employee/dashboard.types";

import EmployeeDashboardRecentTasksSkeleton from "./EmployeeDashboardRecentTasksSkeleton";

/* =========================================================
   PROPS
========================================================= */

interface EmployeeDashboardRecentTasksProps {
  tasks: EmployeeDashboardTask[];
  isLoading: boolean;
}

/* =========================================================
   PRIORITY STYLES
========================================================= */

const priorityStyles: Record<
  EmployeeTaskPriority,
  string
> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-50 text-blue-700",
  HIGH: "bg-orange-50 text-orange-700",
  URGENT: "bg-red-50 text-red-700",
};

/* =========================================================
   STATUS STYLES
========================================================= */

const statusStyles: Record<
  EmployeeTaskStatus,
  string
> = {
  TODO: "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-indigo-50 text-indigo-700",
  IN_REVIEW: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
};

/* =========================================================
   FORMAT STATUS
========================================================= */

const formatStatus = (
  status: EmployeeTaskStatus
): string => {
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
};

/* =========================================================
   FORMAT PRIORITY
========================================================= */

const formatPriority = (
  priority: EmployeeTaskPriority
): string => {
  return (
    priority.charAt(0) +
    priority.slice(1).toLowerCase()
  );
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (
  date: string | null
): string => {
  if (!date) {
    return "No due date";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "No due date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   COMPONENT
========================================================= */

export default function EmployeeDashboardRecentTasks({
  tasks,
  isLoading,
}: EmployeeDashboardRecentTasksProps) {

  const router = useRouter();

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <EmployeeDashboardRecentTasksSkeleton />;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList
              size={20}
              className="text-[#2E3192]"
              strokeWidth={1.8}
            />

            <h2 className="text-lg font-semibold text-slate-900">
              Recent Tasks
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Your recently assigned tasks
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/employee/tasks")}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[#2E3192] transition-colors hover:text-[#252775]"
        >
          View All
          <ArrowRight size={16} strokeWidth={1.8} />
        </button>
      </div>

      {/* Task List */}
      <div className="divide-y divide-slate-100">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <ClipboardList
                size={22}
                className="text-slate-400"
                strokeWidth={1.7}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-700">
              No recent tasks
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              You do not have any recently assigned tasks.
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.uuid}
              className="group px-5 py-5 transition-colors hover:bg-slate-50/70 sm:px-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                {/* Main Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#2E3192]">
                      {task.taskCode}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[task.priority]}`}
                    >
                      {formatPriority(task.priority)}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[task.status]}`}
                    >
                      {formatStatus(task.status)}
                    </span>
                  </div>

                  <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#2E3192] sm:text-base">
                    {task.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                    {task.client?.name && (
                      <div className="flex items-center gap-1.5">
                        <UserRound
                          size={14}
                          strokeWidth={1.7}
                        />

                        <span className="max-w-[220px] truncate">
                          {task.client.name}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <CalendarDays
                        size={14}
                        strokeWidth={1.7}
                      />

                      <span>
                        Due: {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="w-full shrink-0 lg:w-44">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-500">
                      Progress
                    </span>

                    <span className="text-xs font-semibold text-slate-700">
                      {Number(task.progress || 0)}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#2E3192] transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          Math.max(
                            Number(task.progress || 0),
                            0
                          ),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}