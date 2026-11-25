"use client";
import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  Inbox,
  ListTodo,
  MoreVertical,
  Plus,
  Search,
  RefreshCw,
} from "lucide-react";

import TaskSidebarItem, {
  TaskSidebarItemData,
} from "@/src/components/admin/task/TaskSidebarItem";

import TaskPagination from "@/src/components/admin/task/TaskPagination";

/* ========================= Types ========================= */

export type TaskSidebarStatus =
  | "ALL"
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "COMPLETED";

/* ========================= Props ========================= */

interface TaskSidebarProps {
  tasks: TaskSidebarItemData[];

  selectedTaskId?: number | null;

  onTaskSelect?: (
    taskId: number
  ) => void;

  onCreateTask?: () => void;

  loading?: boolean;

  /* ========================= Backend Pagination ========================= */

  currentPage?: number;

  totalPages?: number;

  onPageChange?: (
    page: number
  ) => void;

  /* ========================= Backend Search / Filter ========================= */

  search?: string;

  onSearchChange?: (
    value: string
  ) => void;

  activeFilter?: TaskSidebarStatus;

  onFilterChange?: (
    filter: TaskSidebarStatus
  ) => void;
}

/* ========================= Component ========================= */

export default function TaskSidebar({
  tasks,
  selectedTaskId = null,
  onTaskSelect,
  onCreateTask,
  loading = false,

  currentPage = 1,
  totalPages = 1,
  onPageChange,

  search = "",
  onSearchChange,

  activeFilter = "ALL",
  onFilterChange,
}: TaskSidebarProps) {
  /* ========================= Filter Label ========================= */

  const filterLabel =
    getFilterLabel(activeFilter);

  /* ========================= Filter Counts ========================= */

  /*
   * These counts are for the currently
   * fetched backend page.
   *
   * Pagination itself remains backend driven.
   */

  const filterCounts = {
    all: tasks.length,

    todo: tasks.filter(
      (task) =>
        task.status === "TODO"
    ).length,

    inProgress: tasks.filter(
      (task) =>
        task.status ===
        "IN_PROGRESS"
    ).length,

    inReview: tasks.filter(
      (task) =>
        task.status ===
        "IN_REVIEW"
    ).length,

    completed: tasks.filter(
      (task) =>
        task.status ===
        "COMPLETED"
    ).length,
  };

  /* ========================= Filter Dropdown ========================= */

  const [showFilters, setShowFilters] =
  useState(false);

  const handleFilterChange = (
    filter: TaskSidebarStatus
  ) => {
    onFilterChange?.(filter);

    setShowFilters(false);
  };

  /* ========================= Render ========================= */

  return (
<aside className="flex h-full min-h-0 w-full flex-col border-r border-slate-200 bg-white">
        {/* ========================= Sidebar Header ========================= */}

      <div className="shrink-0 border-b border-slate-200 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              setShowFilters(
                (prev) => !prev
              )
            }
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

            <span>
              {filterLabel}
            </span>

            <ChevronDown
              size={15}
              className={`text-slate-400 transition-transform ${
                showFilters
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {/* <button
            type="button"
            className="
              rounded-lg
              p-2
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
            "
            aria-label="Task options"
          >
            <MoreVertical size={18} />
          </button> */}
        </div>

        {/* ========================= Filter Dropdown ========================= */}

        {showFilters && (
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_2px_8px_rgba(46,49,146,0.16)]">
            <TaskFilterButton
              active={activeFilter === "ALL"}
              icon={<Inbox size={15} />}
              label="All Tasks"
              count={filterCounts.all}
              onClick={() => handleFilterChange("ALL")}
            />

            <TaskFilterButton
              active={activeFilter === "TODO"}
              icon={<Clock3 size={15} />}
              label="To Do"
              count={filterCounts.todo}
              onClick={() => handleFilterChange("TODO")}
            />

            <TaskFilterButton
              active={activeFilter === "IN_PROGRESS"}
              icon={<Clock3 size={15} />}
              label="In Progress"
              count={filterCounts.inProgress}
              onClick={() => handleFilterChange("IN_PROGRESS")}
            />

            <TaskFilterButton
              active={activeFilter === "IN_REVIEW"}
              icon={<Filter size={15} />}
              label="In Review"
              count={filterCounts.inReview}
              onClick={() => handleFilterChange("IN_REVIEW")}
            />

            <TaskFilterButton
              active={activeFilter === "COMPLETED"}
              icon={<CheckCircle2 size={15} />}
              label="Completed"
              count={filterCounts.completed}
              onClick={() => handleFilterChange("COMPLETED")}
            />
          </div>
        )}
      </div>

      {/* ========================= Task List Header ========================= */}

      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Conversations
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {tasks.length}{" "}
            {tasks.length === 1
              ? "task"
              : "tasks"}
          </p>
        </div>


<button
  type="button"
  onClick={onCreateTask}
  disabled={loading}
  className="
    inline-flex
    items-center
    gap-1.5
    rounded-lg
    bg-[#2E3192]
    px-3
    py-2
    text-xs
    font-semibold
    text-white
    shadow-sm
    transition-all
    duration-200
    hover:bg-[#27297f]
    hover:shadow-md
    active:scale-[0.98]
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
>
  <Plus size={15} />

  New Task
</button>
      </div>

      {/* ========================= Task List ========================= */}

<div className="task-scroll min-h-0 flex-1 overflow-y-auto">
          {loading ? (
          <div className="flex h-full min-h-60 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
              <RefreshIcon />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-700">
              Loading tasks...
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Please wait while tasks are
              being loaded.
            </p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex h-full min-h-60 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Search
                size={20}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-700">
              No tasks found
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Try changing your search
              or task filter.
            </p>
          </div>
        ) : (
          <div>
            {tasks.map((task) => (
              <TaskSidebarItem
                key={task.id}
                task={task}
                selected={
                  selectedTaskId ===
                  task.id
                }
                onClick={() =>
                  onTaskSelect?.(
                    task.id
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* ========================= Backend Pagination ========================= */}

      {!loading &&
        tasks.length > 0 &&
        onPageChange && (
          <TaskPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
    </aside>
  );
}

/* ========================= Task Filter Button ========================= */

interface TaskFilterButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  count: number;
  onClick: () => void;
}

function TaskFilterButton({
  active,
  icon,
  label,
  count,
  onClick,
}: TaskFilterButtonProps) {
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

/* ========================= Loading Icon ========================= */

function RefreshIcon() {
  return (
    <RefreshCw
      size={20}
      className="animate-spin text-indigo-500"
    />
  );
}

/* ========================= Filter Label ========================= */

function getFilterLabel(
  filter: TaskSidebarStatus
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