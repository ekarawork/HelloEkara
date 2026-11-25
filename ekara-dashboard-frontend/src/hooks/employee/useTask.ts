"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import { taskService } from "@/src/services/employee/task.service";

import {
  Task,
  TaskAttachment,
  TaskAttachmentListQuery,
  TaskAttachmentListResponseData,
  TaskListItem,
  TaskListQuery,
  TaskListResponseData,
  TaskMessage,
  TaskMessageCreatePayload,
  TaskMessageListQuery,
  TaskMessageListResponseData,
  TaskMessageUpdatePayload,
  TaskProgressUpdatePayload,
  TaskStatusUpdatePayload,
} from "@/src/types/employee/task.types";

/* ========================= Hook Return Type ========================= */

interface UseTaskReturn {
  /* Task */

  getTasks: (
    query?: TaskListQuery
  ) => Promise<TaskListResponseData | null>;

  getTask: (
    uuid: string
  ) => Promise<Task | null>;

  updateTaskStatus: (
    uuid: string,
    payload: TaskStatusUpdatePayload
  ) => Promise<Task | null>;

  updateTaskProgress: (
    uuid: string,
    payload: TaskProgressUpdatePayload
  ) => Promise<Task | null>;

  /* Messages */

  createMessage: (
    taskUuid: string,
    payload: TaskMessageCreatePayload
  ) => Promise<TaskMessage | null>;

  getMessages: (
    taskUuid: string,
    query?: TaskMessageListQuery
  ) => Promise<TaskMessageListResponseData | null>;

  getAllMessages: (
    taskUuid: string
  ) => Promise<TaskMessage[] | null>;

  getLatestMessage: (
    taskUuid: string
  ) => Promise<TaskMessage | null>;

  getLatestMessages: (
    taskUuid: string
  ) => Promise<TaskMessage[] | null>;

  getMessage: (
    taskUuid: string,
    messageUuid: string
  ) => Promise<TaskMessage | null>;

  updateMessage: (
    taskUuid: string,
    messageUuid: string,
    payload: TaskMessageUpdatePayload
  ) => Promise<TaskMessage | null>;

  deleteMessage: (
    taskUuid: string,
    messageUuid: string
  ) => Promise<boolean>;

  getMessageCount: (
    taskUuid: string
  ) => Promise<number | null>;

  getMessageCountByType: (
    taskUuid: string
  ) => Promise<Record<string, number> | null>;

  /* Attachments */

  uploadAttachment: (
    taskUuid: string,
    file: File,
    messageUuid?: string | null
  ) => Promise<TaskAttachment | null>;

  getAttachments: (
    taskUuid: string,
    query?: TaskAttachmentListQuery
  ) => Promise<TaskAttachmentListResponseData | null>;

  getDirectAttachments: (
    taskUuid: string,
    query?: TaskAttachmentListQuery
  ) => Promise<TaskAttachmentListResponseData | null>;

  getMessageAttachments: (
    taskUuid: string,
    messageUuid: string
  ) => Promise<TaskAttachment[] | null>;

  getAttachment: (
    taskUuid: string,
    attachmentUuid: string
  ) => Promise<TaskAttachment | null>;

  getLatestAttachment: (
    taskUuid: string
  ) => Promise<TaskAttachment | null>;

  getAttachmentIds: (
    taskUuid: string
  ) => Promise<
    Array<{
      id: number;
      uuid: string;
    }> | null
  >;

  getAttachmentCount: (
    taskUuid: string
  ) => Promise<number | null>;

  getDirectAttachmentCount: (
    taskUuid: string
  ) => Promise<number | null>;

getMessageAttachmentCount: (
  taskUuid: string,
  messageUuid: string
) => Promise<number | null>;

  deleteAttachment: (
    taskUuid: string,
    attachmentUuid: string
  ) => Promise<boolean>;

  /* State */

  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/* ========================= Error Helper ========================= */

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string
): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallbackMessage;
};

/* ========================= Hook ========================= */

const useTask = (): UseTaskReturn => {
  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  /* ========================= Get Tasks ========================= */

  const getTasks = useCallback(
    async (
      query?: TaskListQuery
    ): Promise<TaskListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.getTasks(query);

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch tasks."
        );

        setError(message);

        toast.error(
          "Failed to load tasks",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Task Details ========================= */

  const getTask = useCallback(
    async (
      uuid: string
    ): Promise<Task | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.getTask(uuid);

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch task details."
        );

        setError(message);

        toast.error(
          "Failed to load task",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Update Task Status ========================= */

  const updateTaskStatus = useCallback(
    async (
      uuid: string,
      payload: TaskStatusUpdatePayload
    ): Promise<Task | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.updateTaskStatus(
            uuid,
            payload
          );

        toast.success(
          "Task status updated",
          {
            description:
              "The task status has been updated successfully.",
          }
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to update task status."
        );

        setError(message);

        toast.error(
          "Status update failed",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Update Task Progress ========================= */

  const updateTaskProgress = useCallback(
    async (
      uuid: string,
      payload: TaskProgressUpdatePayload
    ): Promise<Task | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.updateTaskProgress(
            uuid,
            payload
          );

        toast.success(
          "Task progress updated",
          {
            description:
              "The task progress has been updated successfully.",
          }
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to update task progress."
        );

        setError(message);

        toast.error(
          "Progress update failed",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Create Task Message ========================= */

  const createMessage = useCallback(
    async (
      taskUuid: string,
      payload: TaskMessageCreatePayload
    ): Promise<TaskMessage | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.createMessage(
            taskUuid,
            payload
          );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to send task message."
        );

        setError(message);

        toast.error(
          "Message sending failed",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Task Messages ========================= */

  const getMessages = useCallback(
    async (
      taskUuid: string,
      query?: TaskMessageListQuery
    ): Promise<TaskMessageListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.getMessages(
            taskUuid,
            query
          );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch task messages."
        );

        setError(message);

        toast.error(
          "Failed to load task messages",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get All Task Messages ========================= */

  const getAllMessages = useCallback(
    async (
      taskUuid: string
    ): Promise<TaskMessage[] | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.getAllMessages(
            taskUuid
          );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch task messages."
        );

        setError(message);

        toast.error(
          "Failed to load task messages",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Latest Message ========================= */

  const getLatestMessage = useCallback(
    async (
      taskUuid: string
    ): Promise<TaskMessage | null> => {
      try {
        setIsLoading(true);
        setError(null);

        return await taskService.getLatestMessage(
          taskUuid
        );
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch latest task message."
        );

        setError(message);

        toast.error(
          "Failed to load latest message",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Latest Messages ========================= */

  const getLatestMessages = useCallback(
    async (
      taskUuid: string
    ): Promise<TaskMessage[] | null> => {
      try {
        setIsLoading(true);
        setError(null);

        return await taskService.getLatestMessages(
          taskUuid
        );
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch latest task messages."
        );

        setError(message);

        toast.error(
          "Failed to load latest messages",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Single Message ========================= */

  const getMessage = useCallback(
    async (
      taskUuid: string,
      messageUuid: string
    ): Promise<TaskMessage | null> => {
      try {
        setIsLoading(true);
        setError(null);

        return await taskService.getMessage(
          taskUuid,
          messageUuid
        );
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch task message."
        );

        setError(message);

        toast.error(
          "Failed to load message",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Update Message ========================= */

  const updateMessage = useCallback(
    async (
      taskUuid: string,
      messageUuid: string,
      payload: TaskMessageUpdatePayload
    ): Promise<TaskMessage | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.updateMessage(
            taskUuid,
            messageUuid,
            payload
          );

        toast.success(
          "Message updated successfully",
          {
            description:
              "The task message has been updated.",
          }
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to update task message."
        );

        setError(message);

        toast.error(
          "Message update failed",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Delete Message ========================= */

  const deleteMessage = useCallback(
    async (
      taskUuid: string,
      messageUuid: string
    ): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        await taskService.deleteMessage(
          taskUuid,
          messageUuid
        );

        toast.success(
          "Message deleted",
          {
            description:
              "The task message has been deleted successfully.",
          }
        );

        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to delete task message."
        );

        setError(message);

        toast.error(
          "Message deletion failed",
          {
            description: message,
          }
        );

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Message Count ========================= */

  const getMessageCount = useCallback(
    async (
      taskUuid: string
    ): Promise<number | null> => {
      try {
        setIsLoading(true);
        setError(null);

        return await taskService.getMessageCount(
          taskUuid
        );
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch task message count."
        );

        setError(message);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Message Count By Type ========================= */

  const getMessageCountByType = useCallback(
    async (
      taskUuid: string
    ): Promise<Record<string, number> | null> => {
      try {
        setIsLoading(true);
        setError(null);

        return await taskService.getMessageCountByType(
          taskUuid
        );
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch task message count by type."
        );

        setError(message);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

/* ========================= Upload Task Attachment ========================= */

const uploadAttachment = useCallback(
  async (
    taskUuid: string,
    file: File,
    messageUuid?: string | null
  ): Promise<TaskAttachment | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const data =
        await taskService.uploadAttachment(
          taskUuid,
          file,
          messageUuid
        );

      toast.success(
        "Attachment uploaded successfully",
        {
          description:
            "The task attachment has been uploaded successfully.",
        }
      );

      return data;
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Unable to upload task attachment."
      );

      setError(message);

      toast.error(
        "Attachment upload failed",
        {
          description: message,
        }
      );

      return null;
    } finally {
      setIsLoading(false);
    }
  },
  []
);

  /* ========================= Get Task Attachments ========================= */

  const getAttachments = useCallback(
    async (
      taskUuid: string,
      query?: TaskAttachmentListQuery
    ): Promise<TaskAttachmentListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.getAttachments(
            taskUuid,
            query
          );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch task attachments."
        );

        setError(message);

        toast.error(
          "Failed to load task attachments",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Direct Task Attachments ========================= */

  const getDirectAttachments = useCallback(
    async (
      taskUuid: string,
      query?: TaskAttachmentListQuery
    ): Promise<TaskAttachmentListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.getDirectAttachments(
            taskUuid,
            query
          );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch direct task attachments."
        );

        setError(message);

        toast.error(
          "Failed to load direct attachments",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Message Attachments ========================= */

  const getMessageAttachments = useCallback(
    async (
      taskUuid: string,
      messageUuid: string
    ): Promise<TaskAttachment[] | null> => {
      try {
        setIsLoading(true);
        setError(null);

        return await taskService.getMessageAttachments(
          taskUuid,
          messageUuid
        );
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch message attachments."
        );

        setError(message);

        toast.error(
          "Failed to load message attachments",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Task Attachment ========================= */

  const getAttachment = useCallback(
    async (
      taskUuid: string,
      attachmentUuid: string
    ): Promise<TaskAttachment | null> => {
      try {
        setIsLoading(true);
        setError(null);

        return await taskService.getAttachment(
          taskUuid,
          attachmentUuid
        );
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch task attachment."
        );

        setError(message);

        toast.error(
          "Failed to load attachment",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Latest Attachment ========================= */

  const getLatestAttachment = useCallback(
    async (
      taskUuid: string
    ): Promise<TaskAttachment | null> => {
      try {
        setIsLoading(true);
        setError(null);

        return await taskService.getLatestAttachment(
          taskUuid
        );
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch latest task attachment."
        );

        setError(message);

        toast.error(
          "Failed to load latest attachment",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Attachment IDs ========================= */

  const getAttachmentIds = useCallback(
    async (
      taskUuid: string
    ): Promise<
      Array<{
        id: number;
        uuid: string;
      }> | null
    > => {
      try {
        setIsLoading(true);
        setError(null);

        return await taskService.getAttachmentIds(
          taskUuid
        );
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch task attachment IDs."
        );

        setError(message);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Attachment Count ========================= */

  const getAttachmentCount = useCallback(
    async (
      taskUuid: string
    ): Promise<number | null> => {
      try {
        setIsLoading(true);
        setError(null);

        return await taskService.getAttachmentCount(
          taskUuid
        );
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch task attachment count."
        );

        setError(message);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Direct Attachment Count ========================= */

  const getDirectAttachmentCount = useCallback(
    async (
      taskUuid: string
    ): Promise<number | null> => {
      try {
        setIsLoading(true);
        setError(null);

        return await taskService.getDirectAttachmentCount(
          taskUuid
        );
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch direct attachment count."
        );

        setError(message);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Get Message Attachment Count ========================= */

/* ========================= Get Message Attachment Count ========================= */

const getMessageAttachmentCount = useCallback(
  async (
    taskUuid: string,
    messageUuid: string
  ): Promise<number | null> => {
    try {
      setIsLoading(true);
      setError(null);

      return await taskService.getMessageAttachmentCount(
        taskUuid,
        messageUuid
      );
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Unable to fetch message attachment count."
      );

      setError(message);

      return null;
    } finally {
      setIsLoading(false);
    }
  },
  []
);

  /* ========================= Delete Task Attachment ========================= */

  const deleteAttachment = useCallback(
    async (
      taskUuid: string,
      attachmentUuid: string
    ): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        await taskService.deleteAttachment(
          taskUuid,
          attachmentUuid
        );

        toast.success(
          "Attachment deleted",
          {
            description:
              "The task attachment has been deleted successfully.",
          }
        );

        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to delete task attachment."
        );

        setError(message);

        toast.error(
          "Attachment deletion failed",
          {
            description: message,
          }
        );

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ========================= Clear Error ========================= */

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  /* ========================= Return ========================= */

  return {
    /* Task */

    getTasks,
    getTask,
    updateTaskStatus,
    updateTaskProgress,

    /* Messages */

    createMessage,
    getMessages,
    getAllMessages,
    getLatestMessage,
    getLatestMessages,
    getMessage,
    updateMessage,
    deleteMessage,
    getMessageCount,
    getMessageCountByType,

    /* Attachments */

    uploadAttachment,
    getAttachments,
    getDirectAttachments,
    getMessageAttachments,
    getAttachment,
    getLatestAttachment,
    getAttachmentIds,
    getAttachmentCount,
    getDirectAttachmentCount,
    getMessageAttachmentCount,
    deleteAttachment,

    /* State */

    isLoading,
    error,
    clearError,
  };
};

export default useTask;


/* ========================= Employee Tasks Hook ========================= */

export const useEmployeeTasks = () => {
  const {
    getTasks,
    isLoading,
    error,
    clearError,
  } = useTask();

  const [tasks, setTasks] = useState<TaskListItem[]>([]);
  const [pagination, setPagination] =
    useState<TaskListResponseData | null>(null);

  const fetchTasks = useCallback(
    async (query?: TaskListQuery) => {
      const response = await getTasks(query);

      if (response) {
        setTasks(response.rows || []);
        setPagination(response);
      } else {
        setTasks([]);
        setPagination(null);
      }

      return response;
    },
    [getTasks]
  );

  return {
    tasks,
    pagination,
    isLoading,
    error,
    fetchTasks,
    clearError,
  };
};