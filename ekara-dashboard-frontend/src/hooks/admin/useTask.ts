"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { taskService } from "@/src/services/admin/task.service";

import {
  Task,
  TaskAssignment,
  TaskAttachment,
  TaskAttachmentListQuery,
  TaskAttachmentListResponseData,
  TaskCreatePayload,
  TaskListQuery,
  TaskListResponseData,
  TaskMessage,
  TaskMessageCreatePayload,
  TaskMessageListQuery,
  TaskMessageListResponseData,
  TaskMessageUpdatePayload,
  TaskPriorityUpdatePayload,
  TaskStatusUpdatePayload,
  TaskUpdatePayload,
} from "@/src/types/admin/task.types";

/* ========================= Hook Return Type ========================= */

interface UseTaskReturn {
  /* Task */

  createTask: (
    payload: TaskCreatePayload
  ) => Promise<Task | null>;

  getTasks: (
    query?: TaskListQuery
  ) => Promise<TaskListResponseData | null>;

  getTask: (
    uuid: string
  ) => Promise<Task | null>;

  updateTask: (
    uuid: string,
    payload: TaskUpdatePayload
  ) => Promise<Task | null>;

  updateTaskPriority: (
    uuid: string,
    payload: TaskPriorityUpdatePayload
  ) => Promise<Task | null>;

  updateTaskStatus: (
    uuid: string,
    payload: TaskStatusUpdatePayload
  ) => Promise<Task | null>;

  deleteTask: (
    uuid: string
  ) => Promise<boolean>;

  restoreTask: (
    uuid: string
  ) => Promise<Task | null>;

  forceDeleteTask: (
    uuid: string
  ) => Promise<boolean>;

  getTrashTasks: (
    query?: TaskListQuery
  ) => Promise<TaskListResponseData | null>;

  /* Assignment */

  assignEmployee: (
    taskUuid: string,
    employeeId: number
  ) => Promise<TaskAssignment | null>;

  removeEmployee: (
    taskUuid: string,
    employeeId: number
  ) => Promise<boolean>;

  getAssignments: (
    taskUuid: string
  ) => Promise<TaskAssignment[] | null>;

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
    messageId?: number | null
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
    messageId: number
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
    messageId: number
  ) => Promise<number | null>;

  updateAttachment: (
    taskUuid: string,
    attachmentUuid: string,
    payload: {
      file_name?: string;
      file_type?: string;
    }
  ) => Promise<TaskAttachment | null>;

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

  /* ========================= Create Task ========================= */

  const createTask = useCallback(
    async (
      payload: TaskCreatePayload
    ): Promise<Task | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.createTask(
            payload
          );

        toast.success(
          "Task created successfully",
          {
            description:
              "The new task has been created successfully.",
          }
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to create task. Please try again."
        );

        setError(message);

        toast.error(
          "Task creation failed",
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

  /* ========================= Get Tasks ========================= */

  const getTasks = useCallback(
    async (
      query?: TaskListQuery
    ): Promise<TaskListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.getTasks(
            query
          );

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
          await taskService.getTask(
            uuid
          );

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

  /* ========================= Update Task ========================= */

  const updateTask = useCallback(
    async (
      uuid: string,
      payload: TaskUpdatePayload
    ): Promise<Task | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.updateTask(
            uuid,
            payload
          );

        toast.success(
          "Task updated successfully",
          {
            description:
              "The task information has been updated.",
          }
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to update task."
        );

        setError(message);

        toast.error(
          "Task update failed",
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

  /* ========================= Update Task Priority ========================= */

  const updateTaskPriority = useCallback(
    async (
      uuid: string,
      payload: TaskPriorityUpdatePayload
    ): Promise<Task | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.updateTaskPriority(
            uuid,
            payload
          );

        toast.success(
          "Task priority updated",
          {
            description:
              "The task priority has been updated successfully.",
          }
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to update task priority."
        );

        setError(message);

        toast.error(
          "Priority update failed",
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

  /* ========================= Soft Delete Task ========================= */

  const deleteTask = useCallback(
    async (
      uuid: string
    ): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        await taskService.deleteTask(
          uuid
        );

        toast.success(
          "Task moved to trash",
          {
            description:
              "The task has been moved to trash successfully.",
          }
        );

        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to delete task."
        );

        setError(message);

        toast.error(
          "Task deletion failed",
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

  /* ========================= Restore Task ========================= */

  const restoreTask = useCallback(
    async (
      uuid: string
    ): Promise<Task | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.restoreTask(
            uuid
          );

        toast.success(
          "Task restored successfully",
          {
            description:
              "The task has been restored successfully.",
          }
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to restore task."
        );

        setError(message);

        toast.error(
          "Task restore failed",
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

  /* ========================= Force Delete Task ========================= */

  const forceDeleteTask = useCallback(
    async (
      uuid: string
    ): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        await taskService.forceDeleteTask(
          uuid
        );

        toast.success(
          "Task permanently deleted",
          {
            description:
              "The task has been permanently deleted.",
          }
        );

        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to permanently delete task."
        );

        setError(message);

        toast.error(
          "Permanent deletion failed",
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

  /* ========================= Get Trash Tasks ========================= */

  const getTrashTasks = useCallback(
    async (
      query?: TaskListQuery
    ): Promise<TaskListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.getTrashTasks(
            query
          );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch deleted tasks."
        );

        setError(message);

        toast.error(
          "Failed to load trash tasks",
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

  /* ========================= Assign Employee ========================= */

  const assignEmployee = useCallback(
    async (
      taskUuid: string,
      employeeId: number
    ): Promise<TaskAssignment | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.assignEmployee(
            taskUuid,
            employeeId
          );

        toast.success(
          "Employee assigned successfully",
          {
            description:
              "The employee has been assigned to the task.",
          }
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to assign employee."
        );

        setError(message);

        toast.error(
          "Employee assignment failed",
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

  /* ========================= Remove Employee ========================= */

  const removeEmployee = useCallback(
    async (
      taskUuid: string,
      employeeId: number
    ): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        await taskService.removeEmployee(
          taskUuid,
          employeeId
        );

        toast.success(
          "Employee removed",
          {
            description:
              "The employee has been removed from the task.",
          }
        );

        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to remove employee."
        );

        setError(message);

        toast.error(
          "Employee removal failed",
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

  /* ========================= Get Task Assignments ========================= */

  const getAssignments = useCallback(
    async (
      taskUuid: string
    ): Promise<TaskAssignment[] | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.getAssignments(
            taskUuid
          );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch task assignments."
        );

        setError(message);

        toast.error(
          "Failed to load task assignments",
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
      messageId?: number | null
    ): Promise<TaskAttachment | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.uploadAttachment(
            taskUuid,
            file,
            messageId
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
      messageId: number
    ): Promise<TaskAttachment[] | null> => {
      try {
        setIsLoading(true);
        setError(null);

        return await taskService.getMessageAttachments(
          taskUuid,
          messageId
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

  const getMessageAttachmentCount = useCallback(
    async (
      taskUuid: string,
      messageId: number
    ): Promise<number | null> => {
      try {
        setIsLoading(true);
        setError(null);

        return await taskService.getMessageAttachmentCount(
          taskUuid,
          messageId
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

  /* ========================= Update Task Attachment ========================= */

  const updateAttachment = useCallback(
    async (
      taskUuid: string,
      attachmentUuid: string,
      payload: {
        file_name?: string;
        file_type?: string;
      }
    ): Promise<TaskAttachment | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await taskService.updateAttachment(
            taskUuid,
            attachmentUuid,
            payload
          );

        toast.success(
          "Attachment updated successfully",
          {
            description:
              "The task attachment information has been updated.",
          }
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to update task attachment."
        );

        setError(message);

        toast.error(
          "Attachment update failed",
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

    createTask,
    getTasks,
    getTask,
    updateTask,
    updateTaskPriority,
    updateTaskStatus,
    deleteTask,
    restoreTask,
    forceDeleteTask,
    getTrashTasks,

    /* Assignment */

    assignEmployee,
    removeEmployee,
    getAssignments,

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
    updateAttachment,
    deleteAttachment,

    /* State */

    isLoading,
    error,
    clearError,
  };
};

export default useTask;