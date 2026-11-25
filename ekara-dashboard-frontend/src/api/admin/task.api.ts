import axiosInstance from "@/src/lib/axios";

import {
  AssignTaskEmployeeResponse,
  CreateTaskMessageResponse,
  CreateTaskResponse,
  DeleteTaskAttachmentResponse,
  DeleteTaskMessageResponse,
  DeleteTaskResponse,
  ForceDeleteTaskResponse,
  GetAllTaskMessagesResponse,
  GetDirectTaskAttachmentCountResponse,
  GetDirectTaskAttachmentsResponse,
  GetLatestTaskAttachmentResponse,
  GetLatestTaskMessageResponse,
  GetMessageAttachmentCountResponse,
  GetMessageAttachmentsResponse,
  GetTaskAttachmentCountResponse,
  GetTaskAttachmentIdsResponse,
  GetTaskAttachmentResponse,
  GetTaskAssignmentsResponse,
  GetTaskMessageCountByTypeResponse,
  GetTaskMessageCountResponse,
  GetTaskMessageResponse,
  GetTaskMessagesResponse,
  GetTaskResponse,
  GetTaskAttachmentsResponse,
  GetTasksResponse,
  GetTrashTasksResponse,
  RemoveTaskEmployeeResponse,
  RestoreTaskResponse,
  TaskAssignment,
  TaskAttachment,
  TaskAttachmentListQuery,
  TaskCreatePayload,
  TaskListQuery,
  TaskMessage,
  TaskMessageCreatePayload,
  TaskMessageListQuery,
  TaskMessageUpdatePayload,
  TaskPriorityUpdatePayload,
  TaskStatusUpdatePayload,
  TaskUpdatePayload,
  UpdateTaskAttachmentResponse,
  UpdateTaskMessageResponse,
  UpdateTaskPriorityResponse,
  UpdateTaskResponse,
  UpdateTaskStatusResponse,
  UploadTaskAttachmentResponse,
} from "@/src/types/admin/task.types";

/* ========================= Create Task ========================= */

const createTask = async (
  payload: TaskCreatePayload
): Promise<CreateTaskResponse> => {
  const response =
    await axiosInstance.post<CreateTaskResponse>(
      "/admin/task/create",
      payload
    );

  return response.data;
};

/* ========================= Get Tasks ========================= */

const getTasks = async (
  query: TaskListQuery = {}
): Promise<GetTasksResponse> => {
  const response =
    await axiosInstance.get<GetTasksResponse>(
      "/admin/task/list",
      {
        params: query,
      }
    );

  return response.data;
};

/* ========================= Get Task Details ========================= */

const getTask = async (
  uuid: string
): Promise<GetTaskResponse> => {
  const response =
    await axiosInstance.get<GetTaskResponse>(
      `/admin/task/list/${uuid}`
    );

  return response.data;
};

/* ========================= Update Task ========================= */

const updateTask = async (
  uuid: string,
  payload: TaskUpdatePayload
): Promise<UpdateTaskResponse> => {
  const response =
    await axiosInstance.patch<UpdateTaskResponse>(
      `/admin/task/update/${uuid}`,
      payload
    );

  return response.data;
};

/* ========================= Update Task Priority ========================= */

const updateTaskPriority = async (
  uuid: string,
  payload: TaskPriorityUpdatePayload
): Promise<UpdateTaskPriorityResponse> => {
  const response =
    await axiosInstance.patch<UpdateTaskPriorityResponse>(
      `/admin/task/priority/${uuid}`,
      payload
    );

  return response.data;
};

/* ========================= Update Task Status ========================= */

const updateTaskStatus = async (
  uuid: string,
  payload: TaskStatusUpdatePayload
): Promise<UpdateTaskStatusResponse> => {
  const response =
    await axiosInstance.patch<UpdateTaskStatusResponse>(
      `/admin/task/status/${uuid}`,
      payload
    );

  return response.data;
};

/* ========================= Soft Delete Task ========================= */

const deleteTask = async (
  uuid: string
): Promise<DeleteTaskResponse> => {
  const response =
    await axiosInstance.delete<DeleteTaskResponse>(
      `/admin/task/trash/${uuid}`
    );

  return response.data;
};

/* ========================= Restore Task ========================= */

const restoreTask = async (
  uuid: string
): Promise<RestoreTaskResponse> => {
  const response =
    await axiosInstance.patch<RestoreTaskResponse>(
      `/admin/task/restore/${uuid}`
    );

  return response.data;
};

/* ========================= Force Delete Task ========================= */

const forceDeleteTask = async (
  uuid: string
): Promise<ForceDeleteTaskResponse> => {
  const response =
    await axiosInstance.delete<ForceDeleteTaskResponse>(
      `/admin/task/force-delete/${uuid}`
    );

  return response.data;
};

/* ========================= Get Trash Tasks ========================= */

const getTrashTasks = async (
  query: TaskListQuery = {}
): Promise<GetTrashTasksResponse> => {
  const response =
    await axiosInstance.get<GetTrashTasksResponse>(
      "/admin/task/trash",
      {
        params: query,
      }
    );

  return response.data;
};

/* =========================================================
   Task Assignment API
========================================================= */

/* ========================= Assign Employee To Task ========================= */

const assignEmployee = async (
  taskUuid: string,
  employeeId: number
): Promise<AssignTaskEmployeeResponse> => {
  const response =
    await axiosInstance.post<AssignTaskEmployeeResponse>(
      `/admin/task/${taskUuid}/assign`,
      {
        employee_id: employeeId,
      }
    );

  return response.data;
};

/* ========================= Remove Employee From Task ========================= */

const removeEmployee = async (
  taskUuid: string,
  employeeId: number
): Promise<RemoveTaskEmployeeResponse> => {
  const response =
    await axiosInstance.delete<RemoveTaskEmployeeResponse>(
      `/admin/task/${taskUuid}/assign/${employeeId}`
    );

  return response.data;
};

/* ========================= Get Task Assignments ========================= */

const getAssignments = async (
  taskUuid: string
): Promise<GetTaskAssignmentsResponse> => {
  const response =
    await axiosInstance.get<GetTaskAssignmentsResponse>(
      `/admin/task/${taskUuid}/assignments`
    );

  return response.data;
};

/* =========================================================
   Task Message API
========================================================= */

/* ========================= Create Task Message ========================= */

const createMessage = async (
  taskUuid: string,
  payload: TaskMessageCreatePayload
): Promise<CreateTaskMessageResponse> => {
  const response =
    await axiosInstance.post<CreateTaskMessageResponse>(
      `/admin/task/${taskUuid}/messages`,
      payload
    );

  return response.data;
};

/* ========================= Get Task Messages ========================= */

const getMessages = async (
  taskUuid: string,
  query: TaskMessageListQuery = {}
): Promise<GetTaskMessagesResponse> => {
  const response =
    await axiosInstance.get<GetTaskMessagesResponse>(
      `/admin/task/${taskUuid}/messages`,
      {
        params: query,
      }
    );

  return response.data;
};

/* ========================= Get All Task Messages ========================= */

const getAllMessages = async (
  taskUuid: string
): Promise<GetAllTaskMessagesResponse> => {
  const response =
    await axiosInstance.get<GetAllTaskMessagesResponse>(
      `/admin/task/${taskUuid}/messages/all`
    );

  return response.data;
};

/* ========================= Get Latest Task Message ========================= */

const getLatestMessage = async (
  taskUuid: string
): Promise<GetLatestTaskMessageResponse> => {
  const response =
    await axiosInstance.get<GetLatestTaskMessageResponse>(
      `/admin/task/${taskUuid}/messages/latest`
    );

  return response.data;
};

/* ========================= Get Latest Task Messages ========================= */

const getLatestMessages = async (
  taskUuid: string
): Promise<GetAllTaskMessagesResponse> => {
  const response =
    await axiosInstance.get<GetAllTaskMessagesResponse>(
      `/admin/task/${taskUuid}/messages/latest/list`
    );

  return response.data;
};

/* ========================= Get Single Task Message ========================= */

const getMessage = async (
  taskUuid: string,
  messageUuid: string
): Promise<GetTaskMessageResponse> => {
  const response =
    await axiosInstance.get<GetTaskMessageResponse>(
      `/admin/task/${taskUuid}/messages/${messageUuid}`
    );

  return response.data;
};

/* ========================= Update Task Message ========================= */

const updateMessage = async (
  taskUuid: string,
  messageUuid: string,
  payload: TaskMessageUpdatePayload
): Promise<UpdateTaskMessageResponse> => {
  const response =
    await axiosInstance.patch<UpdateTaskMessageResponse>(
      `/admin/task/${taskUuid}/messages/${messageUuid}`,
      payload
    );

  return response.data;
};

/* ========================= Delete Task Message ========================= */

const deleteMessage = async (
  taskUuid: string,
  messageUuid: string
): Promise<DeleteTaskMessageResponse> => {
  const response =
    await axiosInstance.delete<DeleteTaskMessageResponse>(
      `/admin/task/${taskUuid}/messages/${messageUuid}`
    );

  return response.data;
};

/* ========================= Get Task Message Count ========================= */

const getMessageCount = async (
  taskUuid: string
): Promise<GetTaskMessageCountResponse> => {
  const response =
    await axiosInstance.get<GetTaskMessageCountResponse>(
      `/admin/task/${taskUuid}/messages/count`
    );

  return response.data;
};

/* ========================= Get Task Message Count By Type ========================= */

const getMessageCountByType = async (
  taskUuid: string
): Promise<GetTaskMessageCountByTypeResponse> => {
  const response =
    await axiosInstance.get<GetTaskMessageCountByTypeResponse>(
      `/admin/task/${taskUuid}/messages/count/type`
    );

  return response.data;
};

/* =========================================================
   Task Attachment API
========================================================= */

/* ========================= Upload Task Attachment ========================= */

/**
 * Supports:
 * - Direct task attachment
 * - Message attachment
 */

const uploadAttachment = async (
  taskUuid: string,
  file: File,
  messageId?: number | null
): Promise<UploadTaskAttachmentResponse> => {
  if (!(file instanceof File)) {
    throw new Error("Invalid attachment file.");
  }

  if (file.size <= 0) {
    throw new Error("Selected attachment is empty.");
  }

  const formData = new FormData();

  formData.append(
    "attachment",
    file,
    file.name
  );

  if (
    messageId !== undefined &&
    messageId !== null
  ) {
    formData.append(
      "message_id",
      String(messageId)
    );
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/task/${taskUuid}/attachments`,
    {
      method: "POST",

      headers: {
        Accept: "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },

      body: formData,
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        "Attachment upload failed."
    );
  }

  return data as UploadTaskAttachmentResponse;
};

/* ========================= Get Task Attachments ========================= */

const getAttachments = async (
  taskUuid: string,
  query: TaskAttachmentListQuery = {}
): Promise<GetTaskAttachmentsResponse> => {
  const response =
    await axiosInstance.get<GetTaskAttachmentsResponse>(
      `/admin/task/${taskUuid}/attachments`,
      {
        params: query,
      }
    );

  return response.data;
};

/* ========================= Get Direct Task Attachments ========================= */

const getDirectAttachments = async (
  taskUuid: string,
  query: TaskAttachmentListQuery = {}
): Promise<GetDirectTaskAttachmentsResponse> => {
  const response =
    await axiosInstance.get<GetDirectTaskAttachmentsResponse>(
      `/admin/task/${taskUuid}/attachments/direct`,
      {
        params: query,
      }
    );

  return response.data;
};

/* ========================= Get Message Attachments ========================= */

const getMessageAttachments = async (
  taskUuid: string,
  messageId: number
): Promise<GetMessageAttachmentsResponse> => {
  const response =
    await axiosInstance.get<GetMessageAttachmentsResponse>(
      `/admin/task/${taskUuid}/attachments/message/${messageId}`
    );

  return response.data;
};

/* ========================= Get Single Task Attachment ========================= */

const getAttachment = async (
  taskUuid: string,
  attachmentUuid: string
): Promise<GetTaskAttachmentResponse> => {
  const response =
    await axiosInstance.get<GetTaskAttachmentResponse>(
      `/admin/task/${taskUuid}/attachments/${attachmentUuid}`
    );

  return response.data;
};

/* ========================= Get Latest Task Attachment ========================= */

const getLatestAttachment = async (
  taskUuid: string
): Promise<GetLatestTaskAttachmentResponse> => {
  const response =
    await axiosInstance.get<GetLatestTaskAttachmentResponse>(
      `/admin/task/${taskUuid}/attachments/latest`
    );

  return response.data;
};

/* ========================= Get Task Attachment IDs ========================= */

const getAttachmentIds = async (
  taskUuid: string
): Promise<GetTaskAttachmentIdsResponse> => {
  const response =
    await axiosInstance.get<GetTaskAttachmentIdsResponse>(
      `/admin/task/${taskUuid}/attachments/ids`
    );

  return response.data;
};

/* ========================= Get Task Attachment Count ========================= */

const getAttachmentCount = async (
  taskUuid: string
): Promise<GetTaskAttachmentCountResponse> => {
  const response =
    await axiosInstance.get<GetTaskAttachmentCountResponse>(
      `/admin/task/${taskUuid}/attachments/count`
    );

  return response.data;
};

/* ========================= Get Direct Attachment Count ========================= */

const getDirectAttachmentCount = async (
  taskUuid: string
): Promise<GetDirectTaskAttachmentCountResponse> => {
  const response =
    await axiosInstance.get<GetDirectTaskAttachmentCountResponse>(
      `/admin/task/${taskUuid}/attachments/count/direct`
    );

  return response.data;
};

/* ========================= Get Message Attachment Count ========================= */

const getMessageAttachmentCount = async (
  taskUuid: string,
  messageId: number
): Promise<GetMessageAttachmentCountResponse> => {
  const response =
    await axiosInstance.get<GetMessageAttachmentCountResponse>(
      `/admin/task/${taskUuid}/attachments/count/message/${messageId}`
    );

  return response.data;
};

/* ========================= Update Task Attachment Metadata ========================= */

const updateAttachment = async (
  taskUuid: string,
  attachmentUuid: string,
  payload: {
    file_name?: string;
    file_type?: string;
  }
): Promise<UpdateTaskAttachmentResponse> => {
  const response =
    await axiosInstance.patch<UpdateTaskAttachmentResponse>(
      `/admin/task/${taskUuid}/attachments/${attachmentUuid}`,
      payload
    );

  return response.data;
};

/* ========================= Delete Task Attachment ========================= */

const deleteAttachment = async (
  taskUuid: string,
  attachmentUuid: string
): Promise<DeleteTaskAttachmentResponse> => {
  const response =
    await axiosInstance.delete<DeleteTaskAttachmentResponse>(
      `/admin/task/${taskUuid}/attachments/${attachmentUuid}`
    );

  return response.data;
};

/* ========================= Export ========================= */

export const taskApi = {
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

export default taskApi;
