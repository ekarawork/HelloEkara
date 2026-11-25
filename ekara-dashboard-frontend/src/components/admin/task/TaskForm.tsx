"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  Clock3,
  FileText,
  Flag,
  Loader2,
  Plus,
  UserRound,
  X,
} from "lucide-react";

import TaskAssignment from "@/src/components/admin/task/TaskAssignment";
import TaskStatus from "@/src/components/admin/task/TaskStatus";

import type {
  TaskEmployee,
  TaskPriority,
  TaskStatus as TaskStatusType,
} from "@/src/types/admin/task.types";

/* ========================= Types ========================= */

export interface TaskFormData {
  title: string;
  description: string;
  clientId: number | null;
  employeeIds: number[];
  priority: TaskPriority;
  status: TaskStatusType;
  startDate: string;
  dueDate: string;
  estimatedHours: string;
  progress: number;
}

export interface TaskFormClient {
  id: number;
  name: string;
}

interface TaskFormProps {
  mode?: "add" | "edit";

  initialData?: Partial<TaskFormData>;

  clients?: TaskFormClient[];

  employees?: TaskEmployee[];

  isLoading?: boolean;

  error?: string | null;

  onClose: () => void;

  onSubmit?: (
    data: TaskFormData
  ) => void | Promise<void>;
}

/* ========================= Constants ========================= */

const DEFAULT_FORM_DATA: TaskFormData = {
  title: "",
  description: "",
  clientId: null,
  employeeIds: [],
  priority: "MEDIUM",
  status: "TODO",
  startDate: "",
  dueDate: "",
  estimatedHours: "",
  progress: 0,
};

/* ========================= Component ========================= */

export default function TaskForm({
  mode = "add",
  initialData,
  clients = [],
  employees = [],
  isLoading = false,
  error = null,
  onClose,
  onSubmit,
}: TaskFormProps) {
  const isEditMode =
    mode === "edit";

  /* ========================= Form State ========================= */

  const [formData, setFormData] =
    useState<TaskFormData>(
      DEFAULT_FORM_DATA
    );

  const [errors, setErrors] =
    useState<Record<string, string>>(
      {}
    );

  /* ========================= Initial Data ========================= */

  useEffect(() => {
    if (!initialData) {
      setFormData({
        ...DEFAULT_FORM_DATA,
      });

      return;
    }

    setFormData({
      ...DEFAULT_FORM_DATA,
      ...initialData,
      estimatedHours:
        initialData.estimatedHours ??
        "",
    });

    setErrors({});
  }, [initialData]);

  /* ========================= Field Change ========================= */

  const updateField = <
    K extends keyof TaskFormData
  >(
    field: K,
    value: TaskFormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  /* ========================= Validation ========================= */

  const validateForm = () => {
    const nextErrors: Record<
      string,
      string
    > = {};

    /* ========================= Title ========================= */

    if (!formData.title.trim()) {
      nextErrors.title =
        "Task title is required.";
    } else if (
      formData.title.trim().length > 255
    ) {
      nextErrors.title =
        "Task title cannot exceed 255 characters.";
    }

    /* ========================= Client ========================= */

    if (!formData.clientId) {
      nextErrors.clientId =
        "Please select a client.";
    }

    /* ========================= Employee ========================= */

    if (formData.employeeIds.length === 0) {
      nextErrors.employeeIds =
        "Please assign at least one employee.";
    }

    /* ========================= Dates ========================= */

    if (
      formData.startDate &&
      formData.dueDate &&
      formData.dueDate <
        formData.startDate
    ) {
      nextErrors.dueDate =
        "Due date cannot be before start date.";
    }

    /* ========================= Estimated Hours ========================= */

    if (
      formData.estimatedHours
    ) {
      const estimatedHours =
        Number(
          formData.estimatedHours
        );

      if (
        Number.isNaN(
          estimatedHours
        ) ||
        estimatedHours < 0
      ) {
        nextErrors.estimatedHours =
          "Estimated hours must be valid.";
      }
    }

    /* ========================= Progress ========================= */

    if (
      formData.progress < 0 ||
      formData.progress > 100
    ) {
      nextErrors.progress =
        "Progress must be between 0 and 100.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  /* ========================= Submit ========================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const isValid =
      validateForm();

    if (!isValid) {
      return;
    }

    const submitData: TaskFormData = {
      ...formData,

      title:
        formData.title.trim(),

      description:
        formData.description.trim(),

      estimatedHours:
        formData.estimatedHours.trim(),
    };

    if (onSubmit) {
      await onSubmit(
        submitData
      );

      return;
    }
  };

  /* ========================= Close ========================= */

  const handleClose = () => {
    if (isLoading) {
      return;
    }

    setFormData({
      ...DEFAULT_FORM_DATA,
    });

    setErrors({});

    onClose();
  };

  /* ========================= Render ========================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* ========================= Header ========================= */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E3192]/10 text-[#2E3192]">
  <Plus className="h-5 w-5" />
</div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {isEditMode
                  ? "Edit Task"
                  : "Create New Task"}
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {isEditMode
                  ? "Update task information, assignment and schedule."
                  : "Create and assign a task to your team member."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              isLoading
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ========================= Error ========================= */}

        {error && (
          <div className="border-b border-red-100 bg-red-50 px-6 py-2.5 text-[10px] text-red-600">
            {error}
          </div>
        )}

        {/* ========================= Form ========================= */}

        <form
          onSubmit={
            handleSubmit
          }
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-5">

              {/* ========================= Basic Information ========================= */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#2E3192]" />

                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Task Information
                  </h3>
                </div>

                <div className="space-y-4">

                  {/* Title */}

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      Task Title
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      value={
                        formData.title
                      }
                      maxLength={255}
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "title",
                          event.target
                            .value
                        )
                      }
                      placeholder="e.g. Create Instagram campaign"
                      disabled={
                        isLoading
                      }
                      className={`w-full rounded-lg border bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                        errors.title
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#2E3192] focus:ring-[#2E3192]/10"
                      }`}
                    />

                    {errors.title && (
                      <p className="mt-1 text-[10px] text-red-500">
                        {
                          errors.title
                        }
                      </p>
                    )}
                  </div>

                  {/* Description */}

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      Description
                    </label>

                    <textarea
                      rows={4}
                      maxLength={10000}
                      value={
                        formData.description
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "description",
                          event.target
                            .value
                        )
                      }
                      placeholder="Describe the task, requirements, instructions..."
                      disabled={
                        isLoading
                      }
className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>

                </div>
              </div>

              {/* ========================= Assignment ========================= */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-[#2E3192]" />

                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Assignment
                  </h3>
                </div>

                <div className="space-y-4">

                  {/* Client */}

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      Client
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <select
                      value={
                        formData.clientId ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "clientId",
                          event.target
                            .value
                            ? Number(
                                event.target
                                  .value
                              )
                            : null
                        )
                      }
                      disabled={
                        isLoading
                      }
                      className={`w-full rounded-lg border bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                        errors.clientId
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#2E3192] focus:ring-[#2E3192]/10"
                      }`}
                    >
                      <option value="">
                        Select client
                      </option>

                      {clients.map(
                        (
                          client
                        ) => (
                          <option
                            key={
                              client.id
                            }
                            value={
                              client.id
                            }
                          >
                            {
                              client.name
                            }
                          </option>
                        )
                      )}
                    </select>

                    {errors.clientId && (
                      <p className="mt-1 text-[10px] text-red-500">
                        {
                          errors.clientId
                        }
                      </p>
                    )}
                  </div>

                  {/* Employee */}

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      Assign Employee
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <TaskAssignment
                      employees={
                        employees
                      }
                      selectedEmployeeIds={formData.employeeIds}
                      onChange={(selectedEmployees) =>
                        updateField(
                          "employeeIds",
                          selectedEmployees.map(
                            (employee) => employee.id
                          )
                        )
                      }
                      disabled={
                        isLoading
                      }
                    />

                    {errors.employeeIds && (
                      <p className="mt-1 text-[10px] text-red-500">
                        {errors.employeeIds}
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* ========================= Priority & Status ========================= */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Flag className="h-4 w-4 text-[#2E3192]" />

                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Task Settings
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {/* Priority */}

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      Priority
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          "LOW",
                          "MEDIUM",
                          "HIGH",
                          "URGENT",
                        ] as TaskPriority[]
                      ).map(
                        (
                          priority
                        ) => {
                          const active =
                            formData.priority ===
                            priority;

                          return (
                            <button
                              key={
                                priority
                              }
                              type="button"
                              onClick={() =>
                                updateField(
                                  "priority",
                                  priority
                                )
                              }
                              disabled={
                                isLoading
                              }
                              className={`rounded-lg border px-3 py-2 text-[10px] font-medium transition ${
                                active
                                  ? getPriorityActiveClass(
                                      priority
                                    )
                                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              {
                                priority
                              }
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Status */}

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      Initial Status
                    </label>

                    <TaskStatus
                      status={
                        formData.status
                      }
                      onChange={(
                        status
                      ) =>
                        updateField(
                          "status",
                          status
                        )
                      }
                      disabled={
                        isLoading
                      }
                      compact
                    />
                  </div>

                </div>
              </div>

              {/* ========================= Schedule ========================= */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#2E3192]" />

                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Schedule
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                  {/* Start Date */}

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={
                        formData.startDate
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "startDate",
                          event.target
                            .value
                        )
                      }
                      disabled={
                        isLoading
                      }
className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>

                  {/* Due Date */}

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      Due Date
                    </label>

                    <input
                      type="date"
                      value={
                        formData.dueDate
                      }
                      min={
                        formData.startDate ||
                        undefined
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "dueDate",
                          event.target
                            .value
                        )
                      }
                      disabled={
                        isLoading
                      }
                      className={`w-full rounded-lg border bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                        errors.dueDate
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#2E3192] focus:ring-[#2E3192]/10"
                      }`}
                    />

                    {errors.dueDate && (
                      <p className="mt-1 text-[10px] text-red-500">
                        {
                          errors.dueDate
                        }
                      </p>
                    )}
                  </div>

                  {/* Estimated Hours */}

                  <div>
                    <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-slate-700">
                      <Clock3 className="h-3 w-3 text-slate-400" />
                      Estimated Hours
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={
                        formData.estimatedHours
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "estimatedHours",
                          event.target
                            .value
                        )
                      }
                      placeholder="e.g. 8"
                      disabled={
                        isLoading
                      }
                      className={`w-full rounded-lg border bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                        errors.estimatedHours
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-[#2E3192] focus:ring-[#2E3192]/10"
                      }`}
                    />

                    {errors.estimatedHours && (
                      <p className="mt-1 text-[10px] text-red-500">
                        {
                          errors.estimatedHours
                        }
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* ========================= Progress ========================= */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-medium text-slate-700">
                      Initial Progress
                    </label>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      New tasks normally start
                      at 0%.
                    </p>
                  </div>

                 <span className="text-xs font-semibold text-[#2E3192]">
  {formData.progress}%
</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={
                    formData.progress
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "progress",
                      Number(
                        event.target
                          .value
                      )
                    )
                  }
                  disabled={
                    isLoading
                  }
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#2E3192]"
                />

                {errors.progress && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {
                      errors.progress
                    }
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* ========================= Footer ========================= */}

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4">

            {/* Cancel */}

            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                isLoading
              }
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            {/* Submit */}

            <button
              type="submit"
              disabled={
                isLoading
              }
className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-[#2E3192] px-4 py-2.5 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#27297f] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  {isEditMode
                    ? "Updating..."
                    : "Creating..."}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />

                  {isEditMode
                    ? "Update Task"
                    : "Create Task"}
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

/* ========================= Helpers ========================= */

function getPriorityActiveClass(
  priority: TaskPriority
) {
  switch (priority) {
    case "LOW":
      return "border-emerald-200 bg-emerald-50 text-emerald-600";

    case "MEDIUM":
  return "border-[#2E3192]/20 bg-[#2E3192]/10 text-[#2E3192]";

    case "HIGH":
      return "border-orange-200 bg-orange-50 text-orange-600";

    case "URGENT":
      return "border-red-200 bg-red-50 text-red-600";

default:
  return "border-[#2E3192]/20 bg-[#2E3192]/10 text-[#2E3192]";
  }
}