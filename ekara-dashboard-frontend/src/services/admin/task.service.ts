
import { taskApi } from "@/src/api/admin/task.api";

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

/* ========================= Create Task ========================= */

const createTask = async (
  payload: TaskCreatePayload
): Promise<Task> => {
  const response =
    await taskApi.createTask(payload);

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Task creation failed."
    );
  }

  return response.data;
};

/* ========================= Get Tasks ========================= */

const getTasks = async (
  query?: TaskListQuery
): Promise<TaskListResponseData> => {
  const response =
    await taskApi.getTasks(query);

  if (!response.success || !response.data) {
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

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch task details."
    );
  }

  return response.data;
};

/* ========================= Update Task ========================= */

const updateTask = async (
  uuid: string,
  payload: TaskUpdatePayload
): Promise<Task> => {
  const response =
    await taskApi.updateTask(
      uuid,
      payload
    );

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Task update failed."
    );
  }

  return response.data;
};

/* ========================= Update Task Priority ========================= */

const updateTaskPriority = async (
  uuid: string,
  payload: TaskPriorityUpdatePayload
): Promise<Task> => {
  const response =
    await taskApi.updateTaskPriority(
      uuid,
      payload
    );

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Task priority update failed."
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

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Task status update failed."
    );
  }

  return response.data;
};

/* ========================= Soft Delete Task ========================= */

const deleteTask = async (
  uuid: string
): Promise<boolean> => {
  const response =
    await taskApi.deleteTask(uuid);

  if (!response.success) {
    throw new Error(
      response.message ||
        "Task deletion failed."
    );
  }

  return true;
};

/* ========================= Restore Task ========================= */

const restoreTask = async (
  uuid: string
): Promise<Task> => {
  const response =
    await taskApi.restoreTask(uuid);

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Task restore failed."
    );
  }

  return response.data;
};

/* ========================= Force Delete Task ========================= */

const forceDeleteTask = async (
  uuid: string
): Promise<boolean> => {
  const response =
    await taskApi.forceDeleteTask(uuid);

  if (!response.success) {
    throw new Error(
      response.message ||
        "Task permanent deletion failed."
    );
  }

  return true;
};

/* ========================= Get Trash Tasks ========================= */

const getTrashTasks = async (
  query?: TaskListQuery
): Promise<TaskListResponseData> => {
  const response =
    await taskApi.getTrashTasks(query);

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch deleted tasks."
    );
  }

  return response.data;
};

/* ========================= Assign Employee ========================= */

const assignEmployee = async (
  taskUuid: string,
  employeeId: number
): Promise<TaskAssignment> => {
  const response =
    await taskApi.assignEmployee(
      taskUuid,
      employeeId
    );

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Employee assignment failed."
    );
  }

  return response.data;
};

/* ========================= Remove Employee ========================= */

const removeEmployee = async (
  taskUuid: string,
  employeeId: number
): Promise<boolean> => {
  const response =
    await taskApi.removeEmployee(
      taskUuid,
      employeeId
    );

  if (!response.success) {
    throw new Error(
      response.message ||
        "Employee removal failed."
    );
  }

  return true;
};

/* ========================= Get Task Assignments ========================= */

const getAssignments = async (
  taskUuid: string
): Promise<TaskAssignment[]> => {
  const response =
    await taskApi.getAssignments(
      taskUuid
    );

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch task assignments."
    );
  }

  return response.data;
};

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

  if (!response.success || !response.data) {
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

  if (!response.success || !response.data) {
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

  if (!response.success || !response.data) {
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

  return response.data;
};

/* ========================= Get Latest Task Messages ========================= */

const getLatestMessages = async (
  taskUuid: string
): Promise<TaskMessage[]> => {
  const response =
    await taskApi.getLatestMessages(
      taskUuid
    );

  if (!response.success || !response.data) {
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

  if (!response.success || !response.data) {
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

  if (!response.success || !response.data) {
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

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch message count by type."
    );
  }

  return response.data;
};

/* ========================= Upload Task Attachment ========================= */

const uploadAttachment = async (
  taskUuid: string,
  file: File,
  messageId?: number | null
): Promise<TaskAttachment> => {
  const response =
    await taskApi.uploadAttachment(
      taskUuid,
      file,
      messageId
    );

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Task attachment upload failed."
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

  if (!response.success || !response.data) {
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

  if (!response.success || !response.data) {
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
  messageId: number
): Promise<TaskAttachment[]> => {
  const response =
    await taskApi.getMessageAttachments(
      taskUuid,
      messageId
    );

  if (!response.success || !response.data) {
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

  if (!response.success || !response.data) {
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

  return response.data;
};

/* ========================= Get Task Attachment IDs ========================= */

const getAttachmentIds = async (
  taskUuid: string
) => {
  const response =
    await taskApi.getAttachmentIds(
      taskUuid
    );

  if (!response.success || !response.data) {
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
  messageId: number
): Promise<number> => {
  const response =
    await taskApi.getMessageAttachmentCount(
      taskUuid,
      messageId
    );

  if (!response.success) {
    throw new Error(
      response.message ||
        "Failed to fetch message attachment count."
    );
  }

  return response.data ?? 0;
};

/* ========================= Update Task Attachment ========================= */

const updateAttachment = async (
  taskUuid: string,
  attachmentUuid: string,
  payload: {
    file_name?: string;
    file_type?: string;
  }
): Promise<TaskAttachment> => {
  const response =
    await taskApi.updateAttachment(
      taskUuid,
      attachmentUuid,
      payload
    );

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Task attachment update failed."
    );
  }

  return response.data;
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

  assignEmployee,
  removeEmployee,
  getAssignments,

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
  updateAttachment,
  deleteAttachment,
};

export default taskService;
