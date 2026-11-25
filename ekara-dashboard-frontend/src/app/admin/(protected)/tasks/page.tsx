"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ClipboardList,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
} from "lucide-react";

import ProtectedRoute from "@/src/components/admin/auth/ProtectedRoute";
import AdminNavbar from "@/src/components/admin/AdminNavbar";

import TaskSidebar from "@/src/components/admin/task/TaskSidebar";
import TaskChat from "@/src/components/admin/task/TaskChat";
import TaskDetails from "@/src/components/admin/task/TaskDetails";

import TaskSearch from "@/src/components/admin/task/TaskSearch";
import TaskFilters, {
  DEFAULT_TASK_FILTERS,
  TaskFiltersValue,
} from "@/src/components/admin/task/TaskFilters";

import TaskSkeleton from "@/src/components/admin/task/TaskSkeleton";
import TaskEmptyState from "@/src/components/admin/task/TaskEmptyState";
import TaskModal from "@/src/components/admin/task/TaskModal";
import TaskPagination from "@/src/components/admin/task/TaskPagination";
import TaskForm, {
  TaskFormData,
} from "@/src/components/admin/task/TaskForm";

import TaskDetailsModal, {
  TaskDetailsModalData,
} from "@/src/components/admin/task/TaskDetailsModal";

import {
  TaskSidebarItemData,
  TaskSidebarItemStatus,
} from "@/src/components/admin/task/TaskSidebarItem";

import {
  TaskMessageData,
} from "@/src/components/admin/task/TaskMessage";

import {
  TaskDetailsData,
} from "@/src/components/admin/task/TaskDetails";

import {
  TaskChatHeaderData,
} from "@/src/components/admin/task/TaskChatHeader";

import useTask from "@/src/hooks/admin/useTask";
import useClient from "@/src/hooks/admin/useClient";
import useEmployee from "@/src/hooks/admin/useEmployee";

import type {
  Task,
  TaskEmployeeOption,
  TaskClientOption,
  TaskMessage,
  TaskStatus,
  TaskPriority,
} from "@/src/types/admin/task.types";

import taskApi from "@/src/api/admin/task.api";
/* =========================================================
   Types
========================================================= */

interface TaskPageEmployee {
  id: number;
  name: string;
  designation: string;
  initials: string;
  profileImage?: string | null;
  status?: "ACTIVE" | "INACTIVE";
}

interface TaskPageViewModel {
  id: number;
  uuid: string;
  taskCode: string;
  title: string;
  description: string;

  clientId: number;
  clientName: string;

  employeeIds: number[];

  employees: TaskPageEmployee[];

  employeeName: string;
  employeeDesignation: string;
  employeeInitials: string;
  employeeProfileImage?: string | null;
  employeeCount: number;

  status: TaskStatus;
  priority: TaskPriority;

  startDate: string;
  dueDate: string;

  estimatedHours: number;
  progress: number;

  createdAt: string;
  updatedAt: string;

  preview: string;
  time: string;
  unread?: number;

  messages: TaskMessageData[];
}

/* =========================================================
   Helpers
========================================================= */

const getEmployeeInitials = (
  name?: string | null
): string => {
  if (!name) {
    return "NA";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    `${parts[0][0]}${parts[parts.length - 1][0]}`
  ).toUpperCase();
};

const getEmployeeName = (
  employee?: Task["assignments"] extends
    | Array<infer A>
    | undefined
    ? A extends {
        employee?: infer E;
      }
      ? E
      : never
    : never
): string => {
  if (!employee) {
    return "Unassigned";
  }

  if (
    "name" in employee &&
    employee.name
  ) {
    return employee.name;
  }

  const firstName =
    "first_name" in employee
      ? employee.first_name || ""
      : "";

  const lastName =
    "last_name" in employee
      ? employee.last_name || ""
      : "";

  return (
    `${firstName} ${lastName}`.trim() ||
    "Unassigned"
  );
};

const mapMessageToViewModel = (
  message: TaskMessage
): TaskMessageData => {
  const senderName =
    message.sender?.email ||
    (message.sender_type === "ADMIN"
      ? "Admin"
      : "Employee");

  return {
    id: message.id,

    senderId:
      message.sender_id,

    senderName,

    senderType:
      message.sender_type === "ADMIN"
        ? "ADMIN"
        : "EMPLOYEE",

    senderInitials:
      message.sender_type === "ADMIN"
        ? "AD"
        : getEmployeeInitials(
            senderName
          ),

    message:
      message.message,

    time:
      new Date(
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
          fileUrl:
            attachment.file_url,
          fileName:
            attachment.file_name,
          fileType:
            attachment.file_type,
          fileSize:
            attachment.file_size,
          resourceType:
            attachment.resource_type,
        })
      ),
  };
};

const mapTaskToViewModel = (
  task: Task
): TaskPageViewModel => {
const assignments =
  task.assignments || [];

const employees: TaskPageEmployee[] =
  assignments
    .map((assignment) => {
      const employee =
        assignment.employee;

      if (!employee) {
        return null;
      }

      const name =
        getEmployeeName(employee);

      return {
        id:
          assignment.employee_id,

        name,

        designation:
          employee.designation || "",

        initials:
          getEmployeeInitials(name),

        profileImage:
          employee.profile_image || null,

        status:
          employee.status,
      };
    })
    .filter(
      Boolean
    ) as TaskPageEmployee[];

const firstEmployee =
  employees[0];

const employeeIds =
  employees.map(
    (employee) =>
      employee.id
  );

const employeeName =
  firstEmployee?.name ||
  "Unassigned";

  const messages =
    task.messages?.map(
      mapMessageToViewModel
    ) || [];

  const latestMessage =
    messages.length > 0
      ? messages[messages.length - 1]
      : undefined;

  return {
    id:
      task.id,

    uuid:
      task.uuid,

    taskCode:
      task.task_code,

    title:
      task.title,

    description:
      task.description || "",

    clientId:
      task.client_id,

    clientName:
      task.client?.name ||
      "Unknown Client",

      employeeIds,

      employees,

      employeeName,

      employeeDesignation:
        firstEmployee?.designation || "",

      employeeInitials:
        firstEmployee?.initials || "NA",

      employeeProfileImage:
        firstEmployee?.profileImage || null,

      employeeCount:
        employees.length,

    status:
      task.status as TaskStatus,

    priority:
      task.priority,

    startDate:
      task.start_date || "",

    dueDate:
      task.due_date || "",

    estimatedHours:
      Number(
        task.estimated_hours || 0
      ),

    progress:
      Number(
        task.progress || 0
      ),

    createdAt:
      task.createdAt,

    updatedAt:
      task.updatedAt,

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

export default function AdminTasksPage() {
  /* =======================================================
     Task Hook
  ======================================================== */

const {
  getTasks,
  getTask,
  getMessages,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTrashTasks,
  restoreTask,
  forceDeleteTask,
  createMessage,
  uploadAttachment,
  isLoading,
} = useTask();

  /* =======================================================
     Client Hook
  ======================================================== */

  const {
    getClients,
    isLoading: isClientsLoading,
  } = useClient();

  /* =======================================================
     Employee Hook
  ======================================================== */

  const {
    getEmployees,
    isLoading: isEmployeesLoading,
  } = useEmployee();

  /* =======================================================
     State
  ======================================================== */

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [selectedTaskId, setSelectedTaskId] =
    useState<number | null>(null);
/* =======================================================
   Task Pagination
======================================================== */

const [currentPage, setCurrentPage] =
  useState(1);

const [pageSize] =
  useState(10);

const [totalPages, setTotalPages] =
  useState(1);

const [totalCount, setTotalCount] =
  useState(0);
  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);

  const [search, setSearch] =
    useState("");

  const [filters, setFilters] =
    useState<TaskFiltersValue>(
      DEFAULT_TASK_FILTERS
    );

  const [pageLoading, setPageLoading] =
    useState(true);

const [actionLoading, setActionLoading] =
  useState(false);

const [isDeletingTask, setIsDeletingTask] =
  useState(false);

const [isAssigningEmployee, setIsAssigningEmployee] =
  useState(false);
    /* =======================================================
   Trash
======================================================== */

const [
  trashTasks,
  setTrashTasks,
] = useState<Task[]>([]);

const [
  isTrashOpen,
  setIsTrashOpen,
] = useState(false);

const [
  isTrashLoading,
  setIsTrashLoading,
] = useState(false);

/* =======================================================
   Trash Pagination
======================================================== */

const [
  trashCurrentPage,
  setTrashCurrentPage,
] = useState(1);

const [trashPageSize] =
  useState(10);

const [
  trashTotalPages,
  setTrashTotalPages,
] = useState(1);

const [
  trashTotalCount,
  setTrashTotalCount,
] = useState(0);
  const [createModalOpen, setCreateModalOpen] =
    useState(false);

  const [editModalOpen, setEditModalOpen] =
    useState(false);

  const [detailsModalOpen, setDetailsModalOpen] =
    useState(false);

    
  /* =======================================================
     Master Data State
  ======================================================== */

  const [clientOptions, setClientOptions] =
    useState<TaskClientOption[]>([]);

  const [employeeOptions, setEmployeeOptions] =
    useState<TaskEmployeeOption[]>([]);

  /* =======================================================
     Master Data Loading
  ======================================================== */

  const masterDataLoading =
    isClientsLoading ||
    isEmployeesLoading;

  /* =======================================================
     Load Clients
  ======================================================== */

  const loadClients =
    useCallback(
      async () => {
        const data =
          await getClients({
            page: 1,
            limit: 100,
            status: "ACTIVE",
          });

        if (!data) {
          setClientOptions([]);
          return;
        }

        const options =
          data.rows.map(
            (client) => ({
              id: client.id,
              name: client.name,
            })
          );

        setClientOptions(
          options
        );
      },
      [getClients]
    );

  /* =======================================================
     Load Employees
  ======================================================== */

  const loadEmployees =
    useCallback(
      async () => {
        const data =
          await getEmployees({
            page: 1,
            limit: 100,
            status: "ACTIVE",
          });

        if (!data) {
          setEmployeeOptions([]);
          return;
        }

        const options =
          data.rows.map(
            (employee) => ({
              id: employee.id,

              name:
                `${employee.first_name} ${employee.last_name}`
                  .trim(),

              designation:
                employee.designation ||
                null,

              department:
                employee.department ||
                null,

              profile_image:
                employee.profile_image ||
                null,

              status:
                employee.status,
            })
          );

        setEmployeeOptions(
          options
        );
      },
      [getEmployees]
    );

  /* =======================================================
     Initial Master Data Load
  ======================================================== */

  useEffect(() => {
    const loadMasterData =
      async () => {
        await Promise.all([
          loadClients(),
          loadEmployees(),
        ]);
      };

    loadMasterData();
  }, [
    loadClients,
    loadEmployees,
  ]);

  /* =======================================================
     Load Tasks
  ======================================================== */

  const loadTasks =
    useCallback(
      async (
        showLoader = true
      ) => {
        if (showLoader) {
          setPageLoading(true);
        }

        try {
         const data =
  await getTasks({
    page: currentPage,
    limit: pageSize,

    search:
      search.trim() ||
      undefined,

    status:
      filters.status !==
      "ALL"
        ? filters.status
        : undefined,

    priority:
      filters.priority !==
      "ALL"
        ? filters.priority
        : undefined,

    client_id:
      filters.clientId !==
      "ALL"
        ? filters.clientId
        : undefined,

    employee_id:
      filters.employeeId !==
      "ALL"
        ? filters.employeeId
        : undefined,
  });

          if (!data) {
            setTasks([]);
            setSelectedTaskId(
              null
            );
            setSelectedTask(
              null
            );
            return;
          }

          setTasks(
            data.rows || []
          );

          setTotalPages(
  data.totalPages || 1
);

setTotalCount(
  data.count || 0
);

          setSelectedTaskId(
            (currentSelectedId) => {
              const exists =
                data.rows?.some(
                  (task) =>
                    task.id ===
                    currentSelectedId
                );

              if (exists) {
                return currentSelectedId;
              }

              return (
                data.rows?.[0]?.id ??
                null
              );
            }
          );
        } finally {
          if (showLoader) {
            setPageLoading(
              false
            );
          }
        }
      },
      [
  getTasks,
  search,
  filters,
  currentPage,
  pageSize,
]
    );

  /* =======================================================
     Initial / Filter Load
  ======================================================== */

  useEffect(() => {
    const timer =
      setTimeout(() => {
        loadTasks();
      }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [loadTasks]);

  /* =======================================================
     Load Selected Task Details
  ======================================================== */

  const loadSelectedTask =
    useCallback(
      async (
        taskId: number | null
      ) => {
        if (!taskId) {
          setSelectedTask(
            null
          );
          return;
        }

        const taskFromList =
          tasks.find(
            (task) =>
              task.id === taskId
          );

        if (!taskFromList) {
          setSelectedTask(
            null
          );
          return;
        }

        const detail =
          await getTask(
            taskFromList.uuid
          );

        if (detail) {
          setSelectedTask(
            detail
          );
        } else {
          setSelectedTask(
            taskFromList
          );
        }
      },
      [
        tasks,
        getTask,
      ]
    );

  /* =======================================================
     Selected Task Effect
  ======================================================== */

  useEffect(() => {
    loadSelectedTask(
      selectedTaskId
    );
  }, [
    selectedTaskId,
    loadSelectedTask,
  ]);

  /* =======================================================
     View Model
  ======================================================== */

  const taskViewModels =
    useMemo(() => {
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

const sidebarTasks: TaskSidebarItemData[] = useMemo(() => {
  return taskViewModels.map((task) => ({
    id: task.id,

    title: task.title,

    employeeNames: task.employees.map(
      (employee) => employee.name
    ),

    employeeDesignations: task.employees.map(
      (employee) => employee.designation
    ),

    employeeInitials: task.employees.map(
      (employee) => employee.initials
    ),

    employeeProfileImages: task.employees.map(
      (employee) => employee.profileImage ?? null
    ),

    employeeStatuses: task.employees.map(
      (employee) => employee.status || "ACTIVE"
    ),

    preview: task.preview,

    time: task.time,

    status:
      task.status as TaskSidebarItemStatus,

    unread: task.unread,
  }));
}, [taskViewModels]);

  /* =======================================================
     Select Task
  ======================================================== */

  const handleSelectTask =
    useCallback(
      (taskId: number) => {
        setSelectedTaskId(
          taskId
        );
      },
      []
    );

/* =========================================================
   Send Message / Attachment
========================================================= */

const handleSendMessage = async (
  messageText: string,
  file?: File | null
) => {
  if (!selectedTask) return;

  const trimmedMessage = messageText.trim();

  // Nothing to send
  if (!trimmedMessage && !file) {
    return;
  }

  try {
    let createdMessage = null;

    /*
     * ==========================================
     * 1. CREATE CHAT MESSAGE
     * ==========================================
     *
     * Text hai to wahi message use hoga.
     * Sirf attachment hai to bhi ek real
     * task_message create hoga.
     */
    createdMessage = await createMessage(
      selectedTask.uuid,
      {
        message: trimmedMessage || "Attachment",
        message_type: "TEXT",
      }
    );

    if (!createdMessage?.id) {
      console.error(
        "Task message created but message ID is missing:",
        createdMessage
      );

      return;
    }

    /*
     * ==========================================
     * 2. UPLOAD ATTACHMENT WITH MESSAGE ID
     * ==========================================
     */
    if (file) {
      await uploadAttachment(
        selectedTask.uuid,
        file,
        createdMessage.id
      );
    }

    /*
     * ==========================================
     * 3. REFRESH TASK
     * ==========================================
     */
    const refreshedTask = await getTask(
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
  }
};

/* =======================================================
   Status Change
======================================================== */

const handleStatusChange =
  useCallback(
    async (
      status: TaskStatus
    ) => {
      if (!selectedTask) {
        return;
      }

      const updated =
        await updateTaskStatus(
          selectedTask.uuid,
          {
            status,
          }
        );

      if (!updated) {
        return;
      }

      /*
       * Update selected task immediately
       */
      setSelectedTask(updated);

      /*
       * Update current sidebar task immediately
       */
      setTasks(
        (currentTasks) =>
          currentTasks.map(
            (task) =>
              task.id === updated.id
                ? updated
                : task
          )
      );

      /*
       * Refresh backend pagination/filter state
       *
       * This is important because the task may no longer
       * belong to the currently selected status filter.
       */
      await loadTasks(false);
    },
    [
      selectedTask,
      updateTaskStatus,
      loadTasks,
    ]
  );

/* =======================================================
   Delete Task
======================================================== */

const handleDeleteTask =
  useCallback(
    async () => {
      if (!selectedTask) {
        return;
      }

      setIsDeletingTask(true);

      try {
        const deleted =
          await deleteTask(
            selectedTask.uuid
          );

        if (!deleted) {
          return;
        }

        /*
         * Remove task from current list
         */
        setTasks(
          (currentTasks) =>
            currentTasks.filter(
              (task) =>
                task.id !==
                selectedTask.id
            )
        );

        /*
         * Clear selected task
         */
        setSelectedTask(
          null
        );

        setSelectedTaskId(
          null
        );
      } finally {
        setIsDeletingTask(false);
      }
    },
    [
      selectedTask,
      deleteTask,
    ]
  );

  /* =======================================================
   Load Trash Tasks
======================================================== */

const loadTrashTasks =
  useCallback(
    async (
      page = trashCurrentPage
    ) => {
      setIsTrashLoading(true);

      try {
        const data =
          await getTrashTasks({
            page,
            limit: trashPageSize,
          });

        if (data) {
          setTrashTasks(
            data.rows || []
          );

          setTrashTotalPages(
            data.totalPages || 1
          );

          setTrashTotalCount(
            data.count || 0
          );
        }
      } finally {
        setIsTrashLoading(false);
      }
    },
    [
      getTrashTasks,
      trashCurrentPage,
      trashPageSize,
    ]
  );

/* =======================================================
   Restore Task
======================================================== */

const handleRestoreTask =
  useCallback(
    async (
      task: Task
    ) => {
      if (!task.uuid) {
        return;
      }

      const restoredTask =
        await restoreTask(
          task.uuid
        );

      if (!restoredTask) {
        return;
      }

      /* Refresh normal task list */

      await loadTasks(false);

      /* If last item was removed from current trash page */

      if (
        trashTasks.length === 1 &&
        trashCurrentPage > 1
      ) {
        setTrashCurrentPage(
          (prev) => prev - 1
        );

        return;
      }

      /* Refresh current trash page */

      await loadTrashTasks();
    },
    [
      restoreTask,
      loadTasks,
      trashTasks.length,
      trashCurrentPage,
      loadTrashTasks,
    ]
  );


  /* =======================================================
   Permanently Delete Task
======================================================== */

const handleForceDeleteTask =
  useCallback(
    async (
      task: Task
    ) => {
      if (!task.uuid) {
        return;
      }

      const deleted =
        await forceDeleteTask(
          task.uuid
        );

      if (!deleted) {
        return;
      }

      /* If last item was removed from current trash page */

      if (
        trashTasks.length === 1 &&
        trashCurrentPage > 1
      ) {
        setTrashCurrentPage(
          (prev) => prev - 1
        );

        return;
      }

      /* Refresh current trash page */

      await loadTrashTasks();
    },
    [
      forceDeleteTask,
      trashTasks.length,
      trashCurrentPage,
      loadTrashTasks,
    ]
  );
  /* =======================================================
   View Trash
======================================================== */

const handleViewTrash =
  useCallback(() => {
    setTrashCurrentPage(1);
    setIsTrashOpen(true);
  }, []);


  /* =======================================================
   Trash Load Effect
======================================================== */

useEffect(() => {
  if (!isTrashOpen) {
    return;
  }

  loadTrashTasks();
}, [
  isTrashOpen,
  trashCurrentPage,
  loadTrashTasks,
]);
  /* =======================================================
     Create Task
  ======================================================== */

  const handleCreateTask =
    useCallback(
      async (
        data: TaskFormData
      ) => {
        setActionLoading(
          true
        );

        try {
          const created =
            await createTask({
              title:
                data.title,

              description:
                data.description,

              client_id:
                Number(data.clientId),

              employee_ids:
                data.employeeIds,

              priority:
                data.priority,

              status:
                data.status,

              start_date:
                data.startDate,

              due_date:
                data.dueDate,

              estimated_hours:
                data.estimatedHours === ""
                  ? null
                  : Number(data.estimatedHours),

              progress:
                data.progress,
            });

          if (!created) {
            return;
          }

          setCreateModalOpen(
            false
          );

          await loadTasks(
            false
          );

          setSelectedTaskId(
            created.id
          );

          const detail =
            await getTask(
              created.uuid
            );

          if (detail) {
            setSelectedTask(
              detail
            );

            setTasks(
              (currentTasks) => {
                const exists =
                  currentTasks.some(
                    (task) =>
                      task.id ===
                      detail.id
                  );

                if (exists) {
                  return currentTasks.map(
                    (task) =>
                      task.id ===
                      detail.id
                        ? detail
                        : task
                  );
                }

                return [
                  detail,
                  ...currentTasks,
                ];
              }
            );
          }
        } finally {
          setActionLoading(
            false
          );
        }
      },
      [
        createTask,
        loadTasks,
        getTask,
      ]
    );

  /* =======================================================
     Edit Task
  ======================================================== */

  const handleEditTask =
    useCallback(
      async (
        data: TaskFormData
      ) => {
        if (!selectedTask) {
          return;
        }

        setActionLoading(
          true
        );

        try {
          const updated =
            await updateTask(
              selectedTask.uuid,
              {
                title:
                  data.title,

                description:
                  data.description,

                client_id:
                  Number(data.clientId),

                employee_ids:
                  data.employeeIds,

                priority:
                  data.priority,

                status:
                  data.status,

                start_date:
                  data.startDate,

                due_date:
                  data.dueDate,

                estimated_hours:
                  data.estimatedHours === ""
                    ? null
                    : Number(data.estimatedHours),

                progress:
                  data.progress,
              }
            );

          if (!updated) {
            return;
          }

          setEditModalOpen(
            false
          );

          const detail =
            await getTask(
              updated.uuid
            );

          const latestTask =
            detail || updated;

          setSelectedTask(
            latestTask
          );

          setTasks(
            (currentTasks) =>
              currentTasks.map(
                (task) =>
                  task.id ===
                  latestTask.id
                    ? latestTask
                    : task
              )
          );
        } finally {
          setActionLoading(
            false
          );
        }
      },
      [
        selectedTask,
        updateTask,
        getTask,
      ]
    );


const handleAssignEmployee = async (
  employeeId: number
) => {
  if (!selectedTask) {
    return;
  }

  try {
    setIsAssigningEmployee(true);

    await taskApi.assignEmployee(
      selectedTask.uuid,
      employeeId
    );

    const refreshedTask =
      await getTask(selectedTask.uuid);

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
      "Failed to assign employee:",
      error
    );
  } finally {
    setIsAssigningEmployee(false);
  }
};
  /* =======================================================
     Refresh
  ======================================================== */

  const handleRefresh =
    useCallback(
      async () => {
        await Promise.all([
          loadTasks(),
          loadClients(),
          loadEmployees(),
        ]);
      },
      [
        loadTasks,
        loadClients,
        loadEmployees,
      ]
    );

/* =======================================================
   Details Modal Data
======================================================== */

const detailsModalData:
  | TaskDetailsModalData
  | undefined =
  selectedTaskViewModel
    ? {
        id:
          selectedTaskViewModel.id,

        title:
          selectedTaskViewModel.title,

        description:
          selectedTaskViewModel.description,

        clientId:
          selectedTaskViewModel.clientId,

        clientName:
          selectedTaskViewModel.clientName,

        employeeId:
          selectedTaskViewModel.employeeIds[0] || 0,

        employeeName:
          selectedTaskViewModel.employeeName,

        employeeDesignation:
          selectedTaskViewModel.employeeDesignation,

        employeeInitials:
          selectedTaskViewModel.employeeInitials,

        priority:
          selectedTaskViewModel.priority,

        status:
          selectedTaskViewModel.status,

        startDate:
          selectedTaskViewModel.startDate,

        dueDate:
          selectedTaskViewModel.dueDate,

        estimatedHours:
          selectedTaskViewModel.estimatedHours,

        progress:
          selectedTaskViewModel.progress,

        createdAt:
          selectedTaskViewModel.createdAt,

        updatedAt:
          selectedTaskViewModel.updatedAt,
      }
    : undefined;

  /* =======================================================
     Chat Header Data
  ======================================================== */

/* =======================================================
   Chat Header Data
======================================================== */

const chatHeaderData:
  | TaskChatHeaderData
  | undefined =
  selectedTaskViewModel
    ? {
        id:
          selectedTaskViewModel.id,

        uuid:
          selectedTaskViewModel.uuid,

        taskCode:
          selectedTaskViewModel.taskCode,

        title:
          selectedTaskViewModel.title,

        /* ========================= Employees ========================= */

        employeeNames:
          selectedTaskViewModel.employees.map(
            (employee) => employee.name
          ),

        employeeDesignations:
          selectedTaskViewModel.employees.map(
            (employee) =>
              employee.designation
          ),

        employeeProfileImages:
          selectedTaskViewModel.employees.map(
            (employee) =>
              employee.profileImage ?? null
          ),

        employeeStatuses:
          selectedTaskViewModel.employees.map(
            (employee) =>
              employee.status || "ACTIVE"
          ),

        /* ========================= Task ========================= */

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

  const chatData =
    selectedTaskViewModel
      ? {
          task:
            chatHeaderData,

          messages:
            selectedTaskViewModel.messages,
        }
      : null;

      const editInitialData:
  | Partial<TaskFormData>
  | undefined =
  selectedTaskViewModel
    ? {
        title:
          selectedTaskViewModel.title,

        description:
          selectedTaskViewModel.description,

        clientId:
          selectedTaskViewModel.clientId,

        employeeIds:
          selectedTaskViewModel.employeeIds,

        priority:
          selectedTaskViewModel.priority,

        status:
          selectedTaskViewModel.status,

        startDate:
          selectedTaskViewModel.startDate,

        dueDate:
          selectedTaskViewModel.dueDate,

        estimatedHours:
          selectedTaskViewModel.estimatedHours.toString(),

        progress:
          selectedTaskViewModel.progress,
      }
    : undefined;
/* =======================================================
   Details Data
======================================================== */

const detailsData:
  | TaskDetailsData
  | undefined =
  selectedTaskViewModel
    ? {
        id:
          selectedTaskViewModel.id,

        title:
          selectedTaskViewModel.title,

        description:
          selectedTaskViewModel.description,

        clientName:
          selectedTaskViewModel.clientName,

        /* ========================= Employees ========================= */

        employeeNames:
          selectedTaskViewModel.employees.map(
            (employee) =>
              employee.name
          ),

        employeeDesignations:
          selectedTaskViewModel.employees.map(
            (employee) =>
              employee.designation
          ),

        employeeInitials:
          selectedTaskViewModel.employees.map(
            (employee) =>
              employee.initials
          ),

        employeeProfileImages:
          selectedTaskViewModel.employees.map(
            (employee) =>
              employee.profileImage ?? null
          ),

        employeeStatuses:
          selectedTaskViewModel.employees.map(
            (employee) =>
              employee.status || "ACTIVE"
          ),

        /* ========================= Task ========================= */

        status:
          selectedTaskViewModel.status,

        priority:
          selectedTaskViewModel.priority,

        startDate:
          selectedTaskViewModel.startDate,

        dueDate:
          selectedTaskViewModel.dueDate,

        estimatedHours:
          selectedTaskViewModel.estimatedHours,

        progress:
          selectedTaskViewModel.progress,
      }
    : undefined;

  /* =======================================================
     Render
  ======================================================== */

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <AdminNavbar />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1800px]">

            {/* =================================================
                Page Header
            ================================================== */}

            <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    Task Management
                  </h1>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Manage tasks, assignments and team
                    conversations.
                  </p>
                </div>
              </div>

<div className="flex items-center gap-2">
  <button
    type="button"
    onClick={handleRefresh}
    disabled={
      pageLoading ||
      isLoading ||
      masterDataLoading
    }
    className="
      inline-flex
      items-center
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
      hover:shadow-[0_2px_8px_rgba(46,49,146,0.16)]

      disabled:cursor-not-allowed
      disabled:opacity-50
    "
  >
    <RefreshCw
      size={16}
      className={
        pageLoading ||
        isLoading ||
        masterDataLoading
          ? "animate-spin"
          : ""
      }
    />

    Refresh
  </button>

{/* =================================================
    Trash
================================================== */}

<button
  type="button"
  onClick={
    handleViewTrash
  }
  title="Deleted tasks"
  aria-label="View deleted tasks"
  className="
    inline-flex
    h-10
    w-10
    items-center
    justify-center
    rounded-xl
    border
    border-slate-200
    bg-white
    text-slate-500
    transition
    hover:border-red-100
    hover:bg-red-50
    hover:text-red-500
  "
>
  <Trash2
    size={17}
    strokeWidth={1.8}
  />
</button>

<button
  type="button"
  onClick={() =>
    setCreateModalOpen(true)
  }
  disabled={masterDataLoading}
  className="
    inline-flex
    items-center
    gap-2
    rounded-xl
    bg-[#2E3192]
    px-4
    py-2.5
    text-sm
    font-medium
    text-white
    shadow-sm
    transition-all
    duration-200
    hover:bg-[#27297f]
    hover:shadow-md
    active:scale-[0.98]
    focus:outline-none
    focus:ring-2
    focus:ring-[#2E3192]/20
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
>
  <Plus size={17} />

  New Task
</button>

              </div>
            </div>

            {/* =================================================
                Search + Filters
            ================================================== */}

            <div className="mb-5 space-y-4">
              <div className="max-w-xl">
                <TaskSearch
  value={search}
  onChange={(value) => {
    setSearch(value);
    setCurrentPage(1);
  }}
  placeholder="Search tasks, employees or clients..."
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
  employees={
    employeeOptions.map(
      (employee) => ({
        id:
          employee.id,

        name:
          employee.name,
      })
    )
  }
  clients={
    clientOptions
  }
  loading={
    pageLoading ||
    isLoading ||
    masterDataLoading
  }
/>
            </div>

            {/* =================================================
                Main Task Workspace
            ================================================== */}

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
                    min-h-0
                    overflow-hidden
                    grid-cols-1
                    md:h-[680px]
                    md:grid-cols-[280px_minmax(0,1fr)]
                    xl:grid-cols-[280px_minmax(0,1fr)_320px]
                  "
                >

                  {/* =================================================
                      Sidebar
                  ================================================== */}

                <TaskSidebar
  tasks={sidebarTasks}

  selectedTaskId={
    selectedTaskId ?? undefined
  }

  onTaskSelect={
    handleSelectTask
  }

  onCreateTask={() =>
    setCreateModalOpen(true)
  }

  currentPage={
    currentPage
  }

  totalPages={
    totalPages
  }

  onPageChange={
    setCurrentPage
  }

  /* =========================
     Status Filter
  ========================= */

  activeFilter={
    filters.status
  }

  onFilterChange={(
    filter
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      status: filter,
    }));

    setCurrentPage(1);
  }}
/>

                  {/* =================================================
                      Center
                  ================================================== */}

                  <div className="min-h-0 min-w-0">
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

                  {/* =================================================
                      Right Details
                  ================================================== */}

               <div className="min-h-0 min-w-0">
  {!selectedTask ? (
    <TaskEmptyState
      type="no-selection"
    />
  ) : (
<TaskDetails
  task={selectedTask}
  onEdit={() => {
    setEditModalOpen(true);
  }}
  onDelete={handleDeleteTask}
  onStatusChange={handleStatusChange}
  isUpdatingStatus={actionLoading}
  isDeleting={isDeletingTask}
  availableEmployees={employeeOptions}
  onAssignEmployee={handleAssignEmployee}
  isAssigningEmployee={isAssigningEmployee}
/>
  )}
</div>
                </div>
              </div>
            )}


            {/* ================================================================
    SOFT DELETED TASKS MODAL
================================================================ */}

<TaskModal
  isOpen={isTrashOpen}
  onClose={() =>
    setIsTrashOpen(false)
  }
  title="Deleted Tasks"
  description="Tasks that have been moved to trash."
>
  {/* ========================= Loading ========================= */}

  {isTrashLoading ? (
    <div className="py-10 text-center">
      <p className="text-sm text-slate-500">
        Loading deleted tasks...
      </p>
    </div>
  ) : trashTasks.length === 0 ? (
    /* ========================= Empty ========================= */

    <div className="py-10 text-center">
      <div
        className="
          mx-auto
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          bg-slate-100
          text-slate-400
        "
      >
        <Trash2
          size={18}
        />
      </div>

      <p className="mt-3 text-sm font-medium text-slate-600">
        Trash is empty
      </p>

      <p className="mt-1 text-xs text-slate-400">
        No soft-deleted tasks found.
      </p>
    </div>
  ) : (
/* ========================= Trash Tasks ========================= */
<div className="space-y-2">
  {trashTasks.map((task) => {
    return (
      <div
        key={task.uuid}
        className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-3"
      >
        {/* ========================= Task ========================= */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Task Icon */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ClipboardList size={17} strokeWidth={1.8} />
          </div>
          {/* Information */}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {task.title}
            </p>
            <p className="truncate text-xs text-slate-400">
              {task.task_code}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-slate-400">
              {task.client?.name || "Unknown Client"}
            </p>
          </div>
        </div>

        {/* ========================= Actions ========================= */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* Restore */}
          <button
            type="button"
            onClick={() => handleRestoreTask(task)}
            title="Restore task"
            aria-label={`Restore ${task.title}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#B9BAFF] hover:bg-[#F8F8FF] hover:text-[#2E3192]"
          >
            <RotateCcw size={15} strokeWidth={1.8} />
          </button>
          {/* Permanent Delete */}
          <button
            type="button"
            onClick={() => handleForceDeleteTask(task)}
            title="Permanently delete"
            aria-label={`Permanently delete ${task.title}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={15} strokeWidth={1.8} />
          </button>
        </div>
      </div>
          );
        }
      )}
    </div>
  )}

  {/* ========================= Trash Pagination ========================= */}
  <div className="mt-4">
    <TaskPagination
      currentPage={trashCurrentPage}
      totalPages={trashTotalPages}
      onPageChange={setTrashCurrentPage}
    />
  </div>
</TaskModal>

          {/* No Search / Filter Results */}
            {!pageLoading &&
              tasks.length > 0 &&
              sidebarTasks.length === 0 && (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white">
                  <TaskEmptyState
                    type="no-results"
                    onResetFilters={() => {
                      setSearch("");
                      setFilters({
                        ...DEFAULT_TASK_FILTERS,
                      });
                    }}
                  />
                </div>
              )}
          </div>
        </main>

        {/* =====================================================
            Create Task Modal
        ====================================================== */}

        {createModalOpen && (
          <TaskForm
            mode="add"
            clients={clientOptions}
            employees={employeeOptions}
            isLoading={actionLoading}
            onClose={() => {
              if (!actionLoading) {
                setCreateModalOpen(false);
              }
            }}
            onSubmit={handleCreateTask}
          />
        )}

        {/* Edit Task Modal */}
       {editModalOpen && (
        <TaskForm
          mode="edit"
          initialData={editInitialData}
          clients={clientOptions}
          employees={employeeOptions}
          isLoading={actionLoading}
          onClose={() => {
            if (!actionLoading) {
              setEditModalOpen(false);
            }
          }}
          onSubmit={handleEditTask}
        />
      )}
      {/* Details Modal */}
        <TaskDetailsModal
          open={detailsModalOpen}
          task={detailsModalData}
          isLoading={false}
          onClose={() => setDetailsModalOpen(false)}
          onEdit={() => {setDetailsModalOpen(false);
                        setEditModalOpen(true);
            }}
          onStatusChange={handleStatusChange}
        />
      </div>
    </ProtectedRoute>
  );
}
