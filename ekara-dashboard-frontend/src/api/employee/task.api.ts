import axiosInstance from "@/src/lib/axios";

import {
  CreateTaskMessageResponse,
  DeleteTaskAttachmentResponse,
  DeleteTaskMessageResponse,
  GetAllTaskMessagesResponse,
  GetDirectTaskAttachmentsResponse,
  GetLatestTaskAttachmentResponse,
  GetLatestTaskMessageResponse,
  GetMessageAttachmentCountResponse,
  GetMessageAttachmentsResponse,
  GetTaskAttachmentCountResponse,
  GetTaskAttachmentIdsResponse,
  GetTaskAttachmentResponse,
  GetTaskAttachmentsResponse,
  GetTaskMessageCountByTypeResponse,
  GetTaskMessageCountResponse,
  GetTaskMessageResponse,
  GetTaskMessagesResponse,
  GetTaskResponse,
  GetTasksResponse,
  TaskAttachmentListQuery,
  TaskListQuery,
  TaskMessageCreatePayload,
  TaskMessageListQuery,
  TaskMessageUpdatePayload,
  TaskProgressUpdatePayload,
  TaskStatusUpdatePayload,
  UpdateTaskMessageResponse,
  UpdateTaskProgressResponse,
  UpdateTaskStatusResponse,
  UploadTaskAttachmentResponse,
} from "@/src/types/employee/task.types";

/* =========================================================
   Task API
========================================================= */

/* ========================= Get Tasks ========================= */

/* ========================= Get Tasks ========================= */

const getTasks = async (
  query: TaskListQuery = {}
): Promise<GetTasksResponse> => {
  const response =
    await axiosInstance.get<GetTasksResponse>(
      "/employee/tasks",
      {
        params: query,
      }
    );

  return response.data;
};

/* ========================= Get Task Details ========================= */

/* ========================= Get Task Details ========================= */

const getTask = async (
  uuid: string
): Promise<GetTaskResponse> => {
  const response =
    await axiosInstance.get<GetTaskResponse>(
      `/employee/tasks/${uuid}`
    );

  return response.data;
};

/* ========================= Update Task Status ========================= */

/* ========================= Update Task Status ========================= */

const updateTaskStatus = async (
  uuid: string,
  payload: TaskStatusUpdatePayload
): Promise<UpdateTaskStatusResponse> => {
  const response =
    await axiosInstance.patch<UpdateTaskStatusResponse>(
      `/employee/tasks/${uuid}/status`,
      payload
    );

  return response.data;
};

/* ========================= Update Task Progress ========================= */

/* ========================= Update Task Progress ========================= */

const updateTaskProgress = async (
  uuid: string,
  payload: TaskProgressUpdatePayload
): Promise<UpdateTaskProgressResponse> => {
  const response =
    await axiosInstance.patch<UpdateTaskProgressResponse>(
      `/employee/tasks/${uuid}/progress`,
      payload
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
      `/employee/tasks/${taskUuid}/messages`,
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
      `/employee/tasks/${taskUuid}/messages`,
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
      `/employee/tasks/${taskUuid}/messages/all`
    );

  return response.data;
};

/* ========================= Get Latest Task Message ========================= */

const getLatestMessage = async (
  taskUuid: string
): Promise<GetLatestTaskMessageResponse> => {
  const response =
    await axiosInstance.get<GetLatestTaskMessageResponse>(
      `/employee/tasks/${taskUuid}/messages/latest`
    );

  return response.data;
};

/* ========================= Get Latest Task Messages ========================= */

const getLatestMessages = async (
  taskUuid: string
): Promise<GetAllTaskMessagesResponse> => {
  const response =
    await axiosInstance.get<GetAllTaskMessagesResponse>(
      `/employee/tasks/${taskUuid}/messages/latest/list`
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
      `/employee/tasks/${taskUuid}/messages/${messageUuid}`
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
      `/employee/tasks/${taskUuid}/messages/${messageUuid}`,
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
      `/employee/tasks/${taskUuid}/messages/${messageUuid}`
    );

  return response.data;
};

/* ========================= Get Task Message Count ========================= */

const getMessageCount = async (
  taskUuid: string
): Promise<GetTaskMessageCountResponse> => {
  const response =
    await axiosInstance.get<GetTaskMessageCountResponse>(
      `/employee/tasks/${taskUuid}/messages/count`
    );

  return response.data;
};

/* ========================= Get Task Message Count By Type ========================= */

const getMessageCountByType = async (
  taskUuid: string
): Promise<GetTaskMessageCountByTypeResponse> => {
  const response =
    await axiosInstance.get<GetTaskMessageCountByTypeResponse>(
      `/employee/tasks/${taskUuid}/messages/count/type`
    );

  return response.data;
};

/* =========================================================
   Task Attachment API
========================================================= */

/* ========================= Upload Task Attachment ========================= */

const uploadAttachment = async (
  taskUuid: string,
  file: File,
  messageUuid?: string | null
): Promise<UploadTaskAttachmentResponse> => {
  if (!(file instanceof File)) {
    throw new Error("Invalid attachment file.");
  }

  if (file.size <= 0) {
    throw new Error("Selected attachment is empty.");
  }

  const formData = new FormData();

  formData.append("attachment", file, file.name);

  if (messageUuid) {
    formData.append("message_uuid", messageUuid);
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/employee/tasks/${taskUuid}/attachments`,
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

  const data = await response.json();

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
      `/employee/tasks/${taskUuid}/attachments`,
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
      `/employee/tasks/${taskUuid}/attachments/direct`,
      {
        params: query,
      }
    );

  return response.data;
};

/* ========================= Get Message Attachments ========================= */

const getMessageAttachments = async (
  taskUuid: string,
  messageUuid: string
): Promise<GetMessageAttachmentsResponse> => {
  const response =
    await axiosInstance.get<GetMessageAttachmentsResponse>(
      `/employee/tasks/${taskUuid}/messages/${messageUuid}/attachments`
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
      `/employee/tasks/${taskUuid}/attachments/${attachmentUuid}`
    );

  return response.data;
};

/* ========================= Get Latest Task Attachment ========================= */

const getLatestAttachment = async (
  taskUuid: string
): Promise<GetLatestTaskAttachmentResponse> => {
  const response =
    await axiosInstance.get<GetLatestTaskAttachmentResponse>(
      `/employee/tasks/${taskUuid}/attachments/latest`
    );

  return response.data;
};

/* ========================= Get Task Attachment IDs ========================= */

const getAttachmentIds = async (
  taskUuid: string
): Promise<GetTaskAttachmentIdsResponse> => {
  const response =
    await axiosInstance.get<GetTaskAttachmentIdsResponse>(
      `/employee/tasks/${taskUuid}/attachments/ids`
    );

  return response.data;
};

/* ========================= Get Task Attachment Count ========================= */

const getAttachmentCount = async (
  taskUuid: string
): Promise<GetTaskAttachmentCountResponse> => {
  const response =
    await axiosInstance.get<GetTaskAttachmentCountResponse>(
      `/employee/tasks/${taskUuid}/attachments/count`
    );

  return response.data;
};

/* ========================= Get Direct Attachment Count ========================= */

const getDirectAttachmentCount = async (
  taskUuid: string
): Promise<GetTaskAttachmentCountResponse> => {
  const response =
    await axiosInstance.get<GetTaskAttachmentCountResponse>(
      `/employee/tasks/${taskUuid}/attachments/count/direct`
    );

  return response.data;
};

/* ========================= Get Message Attachment Count ========================= */

/* ========================= Get Message Attachment Count ========================= */

const getMessageAttachmentCount = async (
  taskUuid: string,
  messageUuid: string
): Promise<GetMessageAttachmentCountResponse> => {
  const response =
    await axiosInstance.get<GetMessageAttachmentCountResponse>(
      `/employee/tasks/${taskUuid}/messages/${messageUuid}/attachments/count`
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
      `/employee/tasks/${taskUuid}/attachments/${attachmentUuid}`
    );

  return response.data;
};

/* ========================= Export ========================= */

export const taskApi = {
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

export default taskApi;