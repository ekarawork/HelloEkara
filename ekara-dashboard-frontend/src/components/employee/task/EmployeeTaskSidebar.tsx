"use client";

import { useState, type ReactNode } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  Inbox,
  ListTodo,
  RefreshCw,
  Search,
} from "lucide-react";

import EmployeeTaskSidebarItem, {
  type EmployeeTaskSidebarItemData,
} from "@/src/components/employee/task/EmployeeTaskSidebarItem";

import type {
  EmployeeTaskStatusFilter,
} from "@/src/components/employee/task/EmployeeTaskFilters";

import EmployeeTaskPagination from "@/src/components/employee/task/EmployeeTaskPagination";

/* ========================= Props ========================= */

interface EmployeeTaskSidebarProps {
  tasks: EmployeeTaskSidebarItemData[];

  selectedTaskId?: number | null;

  onTaskSelect?: (taskId: number) => void;

  loading?: boolean;

  /* ========================= Backend Pagination ========================= */

  currentPage?: number;

  totalPages?: number;

  onPageChange?: (page: number) => void;

  /* ========================= Backend Search / Filter ========================= */

  search?: string;

  onSearchChange?: (value: string) => void;

  activeFilter?: EmployeeTaskStatusFilter;

  onFilterChange?: (
    filter: EmployeeTaskStatusFilter
  ) => void;
}

/* ========================= Component ========================= */

export default function EmployeeTaskSidebar({
  tasks,
  selectedTaskId = null,
  onTaskSelect,
  loading = false,

  currentPage = 1,
  totalPages = 1,
  onPageChange,

  search = "",
  onSearchChange,

  activeFilter = "ALL",
  onFilterChange,
}: EmployeeTaskSidebarProps) {
  /* ========================= State ========================= */

  const [showFilters, setShowFilters] = useState(false);

  /* ========================= Filter Label ========================= */

  const filterLabel = getFilterLabel(activeFilter);

  /* ========================= Filter Counts ========================= */

  const filterCounts = {
    all: tasks.length,

    todo: tasks.filter(
      (task) => task.status === "TODO"
    ).length,

    inProgress: tasks.filter(
      (task) => task.status === "IN_PROGRESS"
    ).length,

    inReview: tasks.filter(
      (task) => task.status === "IN_REVIEW"
    ).length,

    completed: tasks.filter(
      (task) => task.status === "COMPLETED"
    ).length,
  };

  /* ========================= Handlers ========================= */

  const handleFilterChange = (
    filter: EmployeeTaskStatusFilter
  ) => {
    onFilterChange?.(filter);
    setShowFilters(false);
  };

  /* ========================= Render ========================= */

  return (
    <aside
      className="
        flex
        h-full
        min-h-0
        w-full
        flex-col
        border-r
        border-slate-200
        bg-white
      "
    >
      {/* ========================= SIDEBAR HEADER ========================= */}

      <div className="shrink-0 border-b border-slate-200 px-4 py-4">
        {/* FILTER DROPDOWN HEADER */}

        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          disabled={loading}
          className="
            flex
            items-center
            gap-2
            rounded-lg
            px-2
            py-1.5
            text-sm
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-50
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <ListTodo
            size={17}
            className="text-[#2E3192]"
          />

          <span>{filterLabel}</span>

          <ChevronDown
            size={15}
            className={`text-slate-400 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* ========================= FILTER DROPDOWN ========================= */}

        {showFilters && (
          <div
            className="
              mt-3
              rounded-xl
              border
              border-slate-200
              bg-white
              p-1.5
              shadow-[0_2px_8px_rgba(46,49,146,0.16)]
            "
          >
            <EmployeeTaskFilterButton
              active={activeFilter === "ALL"}
              icon={<Inbox size={15} />}
              label="All Tasks"
              count={filterCounts.all}
              onClick={() => handleFilterChange("ALL")}
            />

            <EmployeeTaskFilterButton
              active={activeFilter === "TODO"}
              icon={<Clock3 size={15} />}
              label="To Do"
              count={filterCounts.todo}
              onClick={() => handleFilterChange("TODO")}
            />

            <EmployeeTaskFilterButton
              active={activeFilter === "IN_PROGRESS"}
              icon={<Clock3 size={15} />}
              label="In Progress"
              count={filterCounts.inProgress}
              onClick={() =>
                handleFilterChange("IN_PROGRESS")
              }
            />

            <EmployeeTaskFilterButton
              active={activeFilter === "IN_REVIEW"}
              icon={<Filter size={15} />}
              label="In Review"
              count={filterCounts.inReview}
              onClick={() =>
                handleFilterChange("IN_REVIEW")
              }
            />

            <EmployeeTaskFilterButton
              active={activeFilter === "COMPLETED"}
              icon={<CheckCircle2 size={15} />}
              label="Completed"
              count={filterCounts.completed}
              onClick={() =>
                handleFilterChange("COMPLETED")
              }
            />
          </div>
        )}

      </div>

      {/* ========================= CONVERSATIONS HEADER ========================= */}

      <div
        className="
          flex
          shrink-0
          items-center
          justify-between
          border-b
          border-slate-100
          px-4
          py-3
        "
      >
        <div>
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            Conversations
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {tasks.length}{" "}
            {tasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>
      </div>

      {/* ========================= TASK LIST ========================= */}

      <div className="task-scroll min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div
            className="
              flex
              h-full
              min-h-60
              flex-col
              items-center
              justify-center
              px-6
              text-center
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-indigo-50
              "
            >
              <RefreshCw
                size={20}
                className="animate-spin text-indigo-500"
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-700">
              Loading tasks...
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Please wait while tasks are being loaded.
            </p>
          </div>
        ) : tasks.length === 0 ? (
          <div
            className="
              flex
              h-full
              min-h-60
              flex-col
              items-center
              justify-center
              px-6
              text-center
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-slate-100
              "
            >
              <Search
                size={20}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-700">
              No tasks found
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Try changing your search or task filter.
            </p>
          </div>
        ) : (
          <div>
            {tasks.map((task) => (
              <EmployeeTaskSidebarItem
                key={task.id}
                task={task}
                selected={selectedTaskId === task.id}
                onClick={() => onTaskSelect?.(task.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ========================= PAGINATION ========================= */}

      {!loading &&
        tasks.length > 0 &&
        onPageChange && (
          <EmployeeTaskPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
    </aside>
  );
}

/* ========================= Filter Button ========================= */

interface EmployeeTaskFilterButtonProps {
  active: boolean;
  icon: ReactNode;
  label: string;
  count: number;
  onClick: () => void;
}

function EmployeeTaskFilterButton({
  active,
  icon,
  label,
  count,
  onClick,
}: EmployeeTaskFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
        active
          ? "bg-[#2E3192]/10 text-[#2E3192]"
          : "text-slate-600 hover:bg-[#2E3192]/10 hover:text-[#2E3192]"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>

      <span
        className={`text-xs ${
          active
            ? "font-semibold text-[#2E3192]"
            : "text-slate-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/* ========================= Filter Label ========================= */

function getFilterLabel(
  filter: EmployeeTaskStatusFilter
) {
  switch (filter) {
    case "TODO":
      return "To Do";

    case "IN_PROGRESS":
      return "In Progress";

    case "IN_REVIEW":
      return "In Review";

    case "COMPLETED":
      return "Completed";

    default:
      return "All Tasks";
  }
}