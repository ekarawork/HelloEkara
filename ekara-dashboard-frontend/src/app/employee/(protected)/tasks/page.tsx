"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  RefreshCw,
} from "lucide-react";

import ProtectedRoute from "@/src/components/admin/auth/ProtectedRoute";
import EmployeeNavbar from "@/src/components/employee/EmployeeNavbar";

/* ========================= Task Components ========================= */

import TaskSidebar from "@/src/components/employee/task/EmployeeTaskSidebar";
import TaskChat from "@/src/components/employee/task/EmployeeTaskChat";
import TaskEmptyState from "@/src/components/employee/task/EmployeeTaskEmptyState";
import TaskSearch from "@/src/components/employee/task/EmployeeTaskSearch";
import TaskFilters, {
  DEFAULT_TASK_FILTERS,
  EmployeeTaskFiltersValue,
} from "@/src/components/employee/task/EmployeeTaskFilters";
import TaskSkeleton from "@/src/components/employee/task/EmployeeTaskSkeleton";
import TaskPagination from "@/src/components/employee/task/EmployeeTaskPagination";

/* ========================= Hooks ========================= */

import useTask from "@/src/hooks/employee/useTask";

/* ========================= Types ========================= */

import type {
  Task,
  TaskStatus,
  TaskMessage,
} from "@/src/types/employee/task.types";

import type {
  EmployeeTaskSidebarItemData,
  EmployeeTaskSidebarItemStatus,
} from "@/src/components/employee/task/EmployeeTaskSidebarItem";

import type {
  EmployeeTaskMessageData,
} from "@/src/components/employee/task/EmployeeTaskMessage";

import type {
  EmployeeTaskChatHeaderData,
} from "@/src/components/employee/task/EmployeeTaskChatHeader";

/* =========================================================
   Types
========================================================= */

interface EmployeeTaskViewModel {
  id: number;
  uuid: string;
  taskCode: string;
  title: string;
  description: string;

  clientId: number;
  clientName: string;

  status: TaskStatus;
  priority: Task["priority"];

  startDate: string;
  dueDate: string;

  estimatedHours: number;
  progress: number;

  createdAt: string;
  updatedAt: string;

  preview: string;
  time: string;
  unread?: number;

  messages: EmployeeTaskMessageData[];
}

/* =========================================================
   Helpers
========================================================= */

const getInitials = (
  value?: string | null
): string => {
  if (!value) {
    return "NA";
  }

  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${
    parts[parts.length - 1][0]
  }`.toUpperCase();
};

/* ========================= Message Mapper ========================= */

const mapMessageToViewModel = (
  message: TaskMessage
): EmployeeTaskMessageData => {
  const senderName =
    message.sender?.email ||
    (message.sender_type === "ADMIN"
      ? "Admin"
      : "Employee");

  return {
    id: message.id,

    senderId: message.sender_id,

    senderName,

    senderType:
      message.sender_type === "ADMIN"
        ? "ADMIN"
        : "EMPLOYEE",

    senderInitials:
      message.sender_type === "ADMIN"
        ? "AD"
        : getInitials(senderName),

    message: message.message,

    time: new Date(
      message.createdAt
    ).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    }),

    type:
      message.message_type === "TASK"
        ? "TASK"
        : message.message_type === "SYSTEM"
        ? "SYSTEM"
        : "TEXT",

    isRead: true,

    attachments:
      message.attachments?.map(
        (attachment) => ({
          id: attachment.id,
          fileUrl: attachment.file_url,
          fileName: attachment.file_name,
          fileType: attachment.file_type,
          fileSize: attachment.file_size,
          resourceType: attachment.resource_type,
        })
      ),
  };
};

/* ========================= Task Mapper ========================= */

const mapTaskToViewModel = (
  task: Task
): EmployeeTaskViewModel => {
  const messages =
    task.messages?.map(
      mapMessageToViewModel
    ) || [];

  const latestMessage =
    messages.length > 0
      ? messages[messages.length - 1]
      : undefined;

  return {
    id: task.id,

    uuid: task.uuid,

    taskCode: task.task_code,

    title: task.title,

    description: task.description || "",

    clientId: task.client_id,

    clientName:
      task.client?.name ||
      "Unknown Client",

    status: task.status as TaskStatus,

    priority: task.priority,

    startDate: task.start_date || "",

    dueDate: task.due_date || "",

    estimatedHours: Number(
      task.estimated_hours || 0
    ),

    progress: Number(
      task.progress || 0
    ),

    createdAt: task.createdAt,

    updatedAt: task.updatedAt,

    preview:
      latestMessage?.message ||
      task.description ||
      "No messages yet.",

    time:
      latestMessage?.time ||
      new Date(
        task.updatedAt
      ).toLocaleDateString(),

    messages,
  };
};

/* =========================================================
   Page
========================================================= */

export default function EmployeeTasksPage() {
  /* =======================================================
     Task Hook
  ======================================================== */

const {
  getTasks,
  getTask,
  createMessage,
  uploadAttachment,
  isLoading,
} = useTask();
  /* =======================================================
     State
  ======================================================== */

  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedTaskId, setSelectedTaskId] =
    useState<number | null>(null);

  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);

  const [search, setSearch] =
    useState("");

  const [filters, setFilters] =
    useState<EmployeeTaskFiltersValue>(
      DEFAULT_TASK_FILTERS
    );

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize] = useState(10);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalCount, setTotalCount] =
    useState(0);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  /* =======================================================
     Load Tasks
  ======================================================== */

  const loadTasks = useCallback(
    async (
      showLoader = true
    ) => {
      if (showLoader) {
        setPageLoading(true);
      }

      try {
        /*
         * Important:
         * Backend should return only tasks assigned
         * to the authenticated employee.
         */
        const data = await getTasks({
          page: currentPage,
          limit: pageSize,

          search:
            search.trim() ||
            undefined,

          status:
            filters.status !== "ALL"
              ? filters.status
              : undefined,

          priority:
            filters.priority !== "ALL"
              ? filters.priority
              : undefined,

          client_id:
            filters.clientId !== "ALL"
              ? filters.clientId
              : undefined,
        });

        if (!data) {
          setTasks([]);
          setSelectedTaskId(null);
          setSelectedTask(null);
          setTotalPages(1);
          setTotalCount(0);
          return;
        }

        const rows = data.rows || [];

        setTasks(rows);

        setTotalPages(
          data.totalPages || 1
        );

        setTotalCount(
          data.count || 0
        );

        setSelectedTaskId(
          (currentSelectedId) => {
            const exists = rows.some(
              (task) =>
                task.id === currentSelectedId
            );

            if (exists) {
              return currentSelectedId;
            }

            return rows[0]?.id ?? null;
          }
        );
      } finally {
        if (showLoader) {
          setPageLoading(false);
        }
      }
    },
    [
      getTasks,
      currentPage,
      pageSize,
      search,
      filters,
    ]
  );

  /* =======================================================
     Initial / Filter Load
  ======================================================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTasks();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [loadTasks]);

  /* =======================================================
     Load Selected Task
  ======================================================== */

  const loadSelectedTask = useCallback(
    async (
      taskId: number | null
    ) => {
      if (!taskId) {
        setSelectedTask(null);
        return;
      }

      const taskFromList = tasks.find(
        (task) => task.id === taskId
      );

      if (!taskFromList) {
        setSelectedTask(null);
        return;
      }

      const detail = await getTask(
        taskFromList.uuid
      );

      setSelectedTask(
        detail || taskFromList
      );
    },
    [tasks, getTask]
  );

  /* =======================================================
     Selected Task Effect
  ======================================================== */

  useEffect(() => {
    loadSelectedTask(selectedTaskId);
  }, [
    selectedTaskId,
    loadSelectedTask,
  ]);

  /* =======================================================
     View Models
  ======================================================== */

  const taskViewModels = useMemo(() => {
    return tasks.map(
      mapTaskToViewModel
    );
  }, [tasks]);

  const selectedTaskViewModel =
    useMemo(() => {
      if (!selectedTask) {
        return null;
      }

      return mapTaskToViewModel(
        selectedTask
      );
    }, [selectedTask]);

  /* =======================================================
     Sidebar Data
  ======================================================== */

  const sidebarTasks: EmployeeTaskSidebarItemData[] =
    useMemo(() => {
      return taskViewModels.map((task) => ({
        id: task.id,

        title: task.title,

        employeeNames: [],

        employeeDesignations: [],

        employeeInitials: [],

        employeeProfileImages: [],

        employeeStatuses: [],

        preview: task.preview,

        time: task.time,

        status:
          task.status as EmployeeTaskSidebarItemStatus,

        unread: task.unread,
      }));
    }, [taskViewModels]);

  /* =======================================================
     Select Task
  ======================================================== */

  const handleSelectTask = useCallback(
    (taskId: number) => {
      setSelectedTaskId(taskId);
    },
    []
  );

  /* =======================================================
     Send Message / Attachment
  ======================================================== */

  /* =========================================================
     Send Message / Attachment
  ========================================================= */

  const handleSendMessage = useCallback(
    async (
      messageText: string,
      file?: File | null
    ) => {
      if (!selectedTask) {
        return;
      }

      const trimmedMessage = messageText.trim();

      if (!trimmedMessage && !file) {
        return;
      }

      try {
        setActionLoading(true);

        /*
         * First create the message.
         * Attachment must be linked with message UUID.
         */
        const createdMessage =
          await createMessage(
            selectedTask.uuid,
            {
              message:
                trimmedMessage ||
                "Attachment",
              message_type: "TEXT",
            }
          );

        if (!createdMessage?.uuid) {
          console.error(
            "Task message UUID is missing:",
            createdMessage
          );

          return;
        }

        /*
         * Upload attachment against the created
         * message UUID, not numeric message ID.
         */
        if (file) {
          await uploadAttachment(
            selectedTask.uuid,
            file,
            createdMessage.uuid
          );
        }

        /*
         * Refresh selected task after message
         * and attachment upload.
         */
        const refreshedTask =
          await getTask(
            selectedTask.uuid
          );

        if (refreshedTask) {
          setSelectedTask(refreshedTask);

          setTasks((currentTasks) =>
            currentTasks.map((task) =>
              task.id === refreshedTask.id
                ? refreshedTask
                : task
            )
          );
        }
      } catch (error) {
        console.error(
          "Failed to send task message:",
          error
        );
      } finally {
        setActionLoading(false);
      }
    },
    [
      selectedTask,
      createMessage,
      uploadAttachment,
      getTask,
    ]
  );

  /* =======================================================
     Refresh
  ======================================================== */

  const handleRefresh = useCallback(
    async () => {
      await loadTasks();
    },
    [loadTasks]
  );

  /* =======================================================
     Chat Header Data
  ======================================================== */

  const chatHeaderData:
    | EmployeeTaskChatHeaderData
    | undefined =
    selectedTaskViewModel
      ? {
          id: selectedTaskViewModel.id,

          uuid: selectedTaskViewModel.uuid,

          taskCode:
            selectedTaskViewModel.taskCode,

          title:
            selectedTaskViewModel.title,

          employeeNames: [],

          employeeDesignations: [],

          employeeProfileImages: [],

          employeeStatuses: [],

          status:
            selectedTaskViewModel.status,

          priority:
            selectedTaskViewModel.priority,

          dueDate:
            selectedTaskViewModel.dueDate,
        }
      : undefined;

  /* =======================================================
     Chat Data
  ======================================================== */

  const chatData = selectedTaskViewModel
    ? {
        task: chatHeaderData,

        messages:
          selectedTaskViewModel.messages,
      }
    : null;

    /* ========================= Task Status Badge ========================= */

function TaskStatusBadge({
  status,
}: {
  status: TaskStatus;
}) {
  const statusConfig: Record<
    TaskStatus,
    {
      label: string;
      className: string;
      dotClassName: string;
    }
  > = {
    TODO: {
      label: "To Do",
      className: "bg-slate-100 text-slate-600",
      dotClassName: "bg-slate-500",
    },

    IN_PROGRESS: {
      label: "In Progress",
      className: "bg-blue-50 text-blue-600",
      dotClassName: "bg-blue-500",
    },

    IN_REVIEW: {
      label: "In Review",
      className: "bg-amber-50 text-amber-600",
      dotClassName: "bg-amber-500",
    },

    COMPLETED: {
      label: "Completed",
      className: "bg-emerald-50 text-emerald-600",
      dotClassName: "bg-emerald-500",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${config.className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dotClassName}`}
      />

      {config.label}
    </span>
  );
}
  /* =======================================================
     Render
  ======================================================== */

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <EmployeeNavbar />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1800px]">
            {/* ========================= Page Header ========================= */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  My Tasks
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  View your assigned tasks, update progress and communicate with the team.
                </p>
              </div>

              {/* ========================= Refresh ========================= */}

              <button
                type="button"
                onClick={handleRefresh}
                disabled={
                  pageLoading ||
                  isLoading ||
                  actionLoading
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3.5
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-600
                  transition-all
                  duration-200
                  hover:border-indigo-200
                  hover:bg-indigo-50
                  hover:text-[#2E3192]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <RefreshCw
                  size={16}
                  className={
                    pageLoading ||
                    isLoading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>
            </div>

            {/* ========================= Search + Filters ========================= */}

            <div className="mb-5 space-y-4">
              <div className="max-w-xl">
                <TaskSearch
                  value={search}
                  onChange={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search my tasks or clients..."
                  loading={
                    pageLoading ||
                    isLoading
                  }
                />
              </div>

              <TaskFilters
                value={filters}
                onChange={(value) => {
                  setFilters(value);
                  setCurrentPage(1);
                }}
                loading={pageLoading || isLoading}
              />
            </div>

            {/* ========================= Main Workspace ========================= */}

            {pageLoading ? (
              <TaskSkeleton />
            ) : tasks.length === 0 ? (
              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                "
              >
                <TaskEmptyState
                  type="no-results"
                  onResetFilters={() => {
                    setSearch("");
                    setFilters({
                      ...DEFAULT_TASK_FILTERS,
                    });
                    setCurrentPage(1);
                  }}
                />
              </div>
            ) : (
              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                "
              >
                <div
                  className="
                    grid
                    h-[680px]
                    min-h-0
                    overflow-hidden
                    grid-cols-1
                    md:grid-cols-[280px_minmax(0,1fr)]
                    xl:grid-cols-[280px_minmax(0,1fr)_320px]
                  "
                >
                  {/* ========================= Sidebar ========================= */}

                  <TaskSidebar
                    tasks={sidebarTasks}
                    selectedTaskId={selectedTaskId ?? undefined}
                    onTaskSelect={handleSelectTask}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    activeFilter={filters.status}
                    onFilterChange={(filter) => {
                      setFilters((currentFilters) => ({
                        ...currentFilters,
                        status: filter,
                      }));

                      setCurrentPage(1);
                    }}
                  />

                  {/* ========================= Chat ========================= */}

                 <div className="flex h-full min-h-0 min-w-0 flex-col">
                    {!selectedTask ? (
                      <TaskEmptyState
                        type="no-selection"
                      />
                    ) : (
                      <TaskChat
                        task={chatData?.task}
                        messages={chatData?.messages || []}
                        onSendMessage={handleSendMessage}
                      />
                    )}
                  </div>

                  {/* ========================= Task Details ========================= */}

                  <div className="flex h-full min-h-0 min-w-0 flex-col border-t border-slate-200 xl:border-l xl:border-t-0">
                    {!selectedTask ? (
                      <TaskEmptyState
                        type="no-selection"
                      />
                    ) : (
                      <div className="flex h-full min-h-0 flex-col overflow-hidden">
                        {/* ========================= Details Header ========================= */}

                        <div className="shrink-0 border-b border-slate-100 px-5 py-4">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Task Details
                          </p>

                          <h2 className="mt-1 text-base font-semibold text-slate-900">
                            {selectedTask.title}
                          </h2>

                          <p className="mt-1 text-xs text-slate-500">
                            {selectedTask.task_code}
                          </p>
                        </div>

                        {/* ========================= Details Content ========================= */}

                        <div className="space-y-5 px-5 py-5">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Client
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {selectedTask.client?.name ||
                                "Unknown Client"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Description
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                              {selectedTask.description ||
                                "No description available."}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Start Date
                              </p>

                              <p className="mt-1 text-xs text-slate-600">
                                {selectedTask.start_date ||
                                  "Not set"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Due Date
                              </p>

                              <p className="mt-1 text-xs text-slate-600">
                                {selectedTask.due_date ||
                                  "Not set"}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Priority
                            </p>

                            <p className="mt-1 text-sm font-medium capitalize text-slate-700">
                              {String(
                                selectedTask.priority
                              ).toLowerCase()}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Status
                            </p>

                            <div className="mt-2">
                              <TaskStatusBadge
                                status={selectedTask.status}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Progress
                              </p>

                              <p className="text-xs font-semibold text-slate-600">
                                {Number(
                                  selectedTask.progress || 0
                                )}
                                %
                              </p>
                            </div>

                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-[#2E3192] transition-all"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(
                                      0,
                                      Number(
                                        selectedTask.progress || 0
                                      )
                                    )
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Estimated Hours
                              </p>

                              <p className="mt-1 text-sm font-medium text-slate-700">
                                {Number(
                                  selectedTask.estimated_hours || 0
                                )}
                                h
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Messages
                              </p>

                              <p className="mt-1 text-sm font-medium text-slate-700">
                                {selectedTask.messages?.length ||
                                  0}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================= Pagination ========================= */}

            {!pageLoading && tasks.length > 0 && (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Showing {tasks.length} of{" "}
                  {totalCount} tasks
                </p>

                <TaskPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}