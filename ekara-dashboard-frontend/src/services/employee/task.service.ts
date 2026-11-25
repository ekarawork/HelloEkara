import { taskApi } from "@/src/api/employee/task.api";

import {
  Task,
  TaskAttachment,
  TaskAttachmentListQuery,
  TaskAttachmentListResponseData,
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

/* =========================================================
   Task Service
========================================================= */

/* ========================= Get Tasks ========================= */

const getTasks = async (
  query?: TaskListQuery
): Promise<TaskListResponseData> => {
  const response =
    await taskApi.getTasks(query);

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Failed to fetch tasks."
    );
  }

  return response.data;
};

/* ========================= Get Task Details ========================= */

const getTask = async (
  uuid: string
): Promise<Task> => {
  const response =
    await taskApi.getTask(uuid);

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Failed to fetch task details."
    );
  }

  return response.data;
};

/* ========================= Update Task Status ========================= */

const updateTaskStatus = async (
  uuid: string,
  payload: TaskStatusUpdatePayload
): Promise<Task> => {
  const response =
    await taskApi.updateTaskStatus(
      uuid,
      payload
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Task status update failed."
    );
  }

  return response.data;
};

/* ========================= Update Task Progress ========================= */

const updateTaskProgress = async (
  uuid: string,
  payload: TaskProgressUpdatePayload
): Promise<Task> => {
  const response =
    await taskApi.updateTaskProgress(
      uuid,
      payload
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Task progress update failed."
    );
  }

  return response.data;
};

/* =========================================================
   Task Message Service
========================================================= */

/* ========================= Create Task Message ========================= */

const createMessage = async (
  taskUuid: string,
  payload: TaskMessageCreatePayload
): Promise<TaskMessage> => {
  const response =
    await taskApi.createMessage(
      taskUuid,
      payload
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Message creation failed."
    );
  }

  return response.data;
};

/* ========================= Get Task Messages ========================= */

const getMessages = async (
  taskUuid: string,
  query?: TaskMessageListQuery
): Promise<TaskMessageListResponseData> => {
  const response =
    await taskApi.getMessages(
      taskUuid,
      query
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Failed to fetch task messages."
    );
  }

  return response.data;
};

/* ========================= Get All Task Messages ========================= */

const getAllMessages = async (
  taskUuid: string
): Promise<TaskMessage[]> => {
  const response =
    await taskApi.getAllMessages(
      taskUuid
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Failed to fetch all task messages."
    );
  }

  return response.data;
};

/* ========================= Get Latest Task Message ========================= */

const getLatestMessage = async (
  taskUuid: string
): Promise<TaskMessage | null> => {
  const response =
    await taskApi.getLatestMessage(
      taskUuid
    );

  if (!response.success) {
    throw new Error(
      response.message ||
        "Failed to fetch latest task message."
    );
  }

  return response.data ?? null;
};

/* ========================= Get Latest Task Messages ========================= */

const getLatestMessages = async (
  taskUuid: string
): Promise<TaskMessage[]> => {
  const response =
    await taskApi.getLatestMessages(
      taskUuid
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Failed to fetch latest task messages."
    );
  }

  return response.data;
};

/* ========================= Get Single Task Message ========================= */

const getMessage = async (
  taskUuid: string,
  messageUuid: string
): Promise<TaskMessage> => {
  const response =
    await taskApi.getMessage(
      taskUuid,
      messageUuid
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Failed to fetch task message."
    );
  }

  return response.data;
};

/* ========================= Update Task Message ========================= */

const updateMessage = async (
  taskUuid: string,
  messageUuid: string,
  payload: TaskMessageUpdatePayload
): Promise<TaskMessage> => {
  const response =
    await taskApi.updateMessage(
      taskUuid,
      messageUuid,
      payload
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Task message update failed."
    );
  }

  return response.data;
};

/* ========================= Delete Task Message ========================= */

const deleteMessage = async (
  taskUuid: string,
  messageUuid: string
): Promise<boolean> => {
  const response =
    await taskApi.deleteMessage(
      taskUuid,
      messageUuid
    );

  if (!response.success) {
    throw new Error(
      response.message ||
        "Task message deletion failed."
    );
  }

  return true;
};

/* ========================= Get Message Count ========================= */

const getMessageCount = async (
  taskUuid: string
): Promise<number> => {
  const response =
    await taskApi.getMessageCount(
      taskUuid
    );

  if (!response.success) {
    throw new Error(
      response.message ||
        "Failed to fetch message count."
    );
  }

  return response.data ?? 0;
};

/* ========================= Get Message Count By Type ========================= */

const getMessageCountByType = async (
  taskUuid: string
) => {
  const response =
    await taskApi.getMessageCountByType(
      taskUuid
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Failed to fetch message count by type."
    );
  }

  return response.data;
};

/* =========================================================
   Task Attachment Service
========================================================= */

/* ========================= Upload Task Attachment ========================= */

/* ========================= Upload Task Attachment ========================= */

const uploadAttachment = async (
  taskUuid: string,
  file: File,
  messageUuid?: string | null
): Promise<TaskAttachment> => {
  const response =
    await taskApi.uploadAttachment(
      taskUuid,
      file,
      messageUuid
    );

  if (!response?.success || !response?.data) {
    throw new Error(
      response?.message ||
        "Unable to upload task attachment."
    );
  }

  return response.data;
};

/* ========================= Get Task Attachments ========================= */

const getAttachments = async (
  taskUuid: string,
  query?: TaskAttachmentListQuery
): Promise<TaskAttachmentListResponseData> => {
  const response =
    await taskApi.getAttachments(
      taskUuid,
      query
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Failed to fetch task attachments."
    );
  }

  return response.data;
};

/* ========================= Get Direct Task Attachments ========================= */

const getDirectAttachments = async (
  taskUuid: string,
  query?: TaskAttachmentListQuery
): Promise<TaskAttachmentListResponseData> => {
  const response =
    await taskApi.getDirectAttachments(
      taskUuid,
      query
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Failed to fetch direct task attachments."
    );
  }

  return response.data;
};

/* ========================= Get Message Attachments ========================= */

const getMessageAttachments = async (
  taskUuid: string,
  messageUuid: string
): Promise<TaskAttachment[]> => {
  const response =
    await taskApi.getMessageAttachments(
      taskUuid,
      messageUuid
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Failed to fetch message attachments."
    );
  }

  return response.data;
};

/* ========================= Get Single Task Attachment ========================= */

const getAttachment = async (
  taskUuid: string,
  attachmentUuid: string
): Promise<TaskAttachment> => {
  const response =
    await taskApi.getAttachment(
      taskUuid,
      attachmentUuid
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Failed to fetch task attachment."
    );
  }

  return response.data;
};

/* ========================= Get Latest Task Attachment ========================= */

const getLatestAttachment = async (
  taskUuid: string
): Promise<TaskAttachment | null> => {
  const response =
    await taskApi.getLatestAttachment(
      taskUuid
    );

  if (!response.success) {
    throw new Error(
      response.message ||
        "Failed to fetch latest task attachment."
    );
  }

  return response.data ?? null;
};

/* ========================= Get Task Attachment IDs ========================= */

const getAttachmentIds = async (
  taskUuid: string
) => {
  const response =
    await taskApi.getAttachmentIds(
      taskUuid
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Failed to fetch attachment IDs."
    );
  }

  return response.data;
};

/* ========================= Get Task Attachment Count ========================= */

const getAttachmentCount = async (
  taskUuid: string
): Promise<number> => {
  const response =
    await taskApi.getAttachmentCount(
      taskUuid
    );

  if (!response.success) {
    throw new Error(
      response.message ||
        "Failed to fetch attachment count."
    );
  }

  return response.data ?? 0;
};

/* ========================= Get Direct Attachment Count ========================= */

const getDirectAttachmentCount = async (
  taskUuid: string
): Promise<number> => {
  const response =
    await taskApi.getDirectAttachmentCount(
      taskUuid
    );

  if (!response.success) {
    throw new Error(
      response.message ||
        "Failed to fetch direct attachment count."
    );
  }

  return response.data ?? 0;
};

/* ========================= Get Message Attachment Count ========================= */

const getMessageAttachmentCount = async (
  taskUuid: string,
  messageUuid: string
): Promise<number> => {
  const response =
    await taskApi.getMessageAttachmentCount(
      taskUuid,
      messageUuid
    );

  if (!response.success) {
    throw new Error(
      response.message ||
        "Failed to fetch message attachment count."
    );
  }

  return response.data ?? 0;
};

/* ========================= Delete Task Attachment ========================= */

const deleteAttachment = async (
  taskUuid: string,
  attachmentUuid: string
): Promise<boolean> => {
  const response =
    await taskApi.deleteAttachment(
      taskUuid,
      attachmentUuid
    );

  if (!response.success) {
    throw new Error(
      response.message ||
        "Task attachment deletion failed."
    );
  }

  return true;
};

/* ========================= Export ========================= */

export const taskService = {
  getTasks,
  getTask,
  updateTaskStatus,
  updateTaskProgress,

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
};

export default taskService;