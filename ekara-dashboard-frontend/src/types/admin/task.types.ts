"use client";

/* ========================= Task Status ========================= */

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "COMPLETED";

/* ========================= Task Priority ========================= */

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

/* ========================= Task Message Sender Type ========================= */

export type TaskMessageSenderType =
  | "ADMIN"
  | "EMPLOYEE";

/* ========================= Task Message Type ========================= */

export type TaskMessageType =
  | "TEXT"
  | "TASK"
  | "SYSTEM"
  | "ATTACHMENT";

/* ========================= Task Employee Status ========================= */

export type TaskEmployeeStatus =
  | "ACTIVE"
  | "INACTIVE";

/* ========================= Task Client ========================= */

export interface TaskClient {
  id: number;
  uuid: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}

/* ========================= Task Employee ========================= */

export interface TaskEmployee {
  id: number;
  uuid?: string;

  first_name?: string;
  last_name?: string;

  name: string;

  email?: string | null;
  phone?: string | null;

  employee_code?: string | null;
  department?: string | null;
  designation?: string | null;

  profile_image?: string | null;

  status?: TaskEmployeeStatus;
}

/* ========================= Task User ========================= */

export interface TaskUser {
  id: number;
  uuid?: string;

  email: string;

  role?: string;

  status?: string;
}

/* ========================= Task Assignment ========================= */

export interface TaskAssignment {
  id: number;
  uuid: string;

  task_id: number;
  employee_id: number;

  assigned_by: number | null;

  assigned_at: string;

  createdAt: string;
  updatedAt: string;

  employee?: TaskEmployee;

  assignedBy?: TaskUser | null;
}

/* ========================= Task Message Attachment ========================= */

export interface TaskMessageAttachment {
  id: number;
  uuid: string;

  task_id: number;
  message_id: number | null;

  uploaded_by: number;

  file_url: string;
  file_name: string;
  file_type: string;

  file_size: number | null;

  resource_type: string | null;

  createdAt: string;
  updatedAt: string;

  uploadedBy?: TaskUser | null;
}

/* ========================= Task Message ========================= */

export interface TaskMessage {
  id: number;
  uuid: string;

  task_id: number;

  sender_id: number;

  sender_type: TaskMessageSenderType;

  message: string;

  message_type: TaskMessageType;

  createdAt: string;
  updatedAt: string;

  sender?: TaskUser | null;

  attachments?: TaskMessageAttachment[];
}

/* ========================= Task Attachment ========================= */

export interface TaskAttachment {
  id: number;
  uuid: string;

  task_id: number;

  message_id: number | null;

  uploaded_by: number;

  file_url: string;
  file_name: string;
  file_type: string;

  file_size: number | null;

  resource_type: string | null;

  createdAt: string;
  updatedAt: string;

  message?: TaskMessage | null;

  uploadedBy?: TaskUser | null;
}

/* ========================= Task ========================= */

export interface Task {
  id: number;
  uuid: string;

  task_code: string;

  title: string;

  description: string | null;

  client_id: number;

  priority: TaskPriority;

  status: TaskStatus;

  start_date: string | null;

  due_date: string | null;

  estimated_hours: number | null;

  progress: number;

  completed_at: string | null;

  created_by: number | null;
  updated_by: number | null;

  deleted_at?: string | null;

  createdAt: string;
  updatedAt: string;

  client?: TaskClient | null;

  createdBy?: TaskUser | null;
  updatedBy?: TaskUser | null;

  assignments?: TaskAssignment[];

  messages?: TaskMessage[];

  attachments?: TaskAttachment[];
}

/* ========================= Task List Item ========================= */

export interface TaskListItem {
  id: number;
  uuid: string;

  task_code: string;

  title: string;

  client_id: number;

  client_name?: string | null;

  priority: TaskPriority;

  status: TaskStatus;

  due_date: string | null;

  progress: number;

  employee_id?: number | null;

  employee_name?: string | null;

  employee_designation?: string | null;

  employee_profile_image?: string | null;

  latest_message?: TaskMessage | null;

  unread_count?: number;

  createdAt: string;
  updatedAt: string;
}

/* ========================= Create Task Payload ========================= */

/* ========================= Create Task Payload ========================= */

export interface TaskCreatePayload {
  title: string;

  description?: string | null;

  client_id: number;

  employee_ids: number[];

  priority?: TaskPriority;

  status?: TaskStatus;

  start_date?: string | null;

  due_date?: string | null;

  estimated_hours?: number | null;

  progress?: number;
}

/* ========================= Update Task Payload ========================= */

/* ========================= Update Task Payload ========================= */

export interface TaskUpdatePayload {
  title?: string;

  description?: string | null;

  client_id?: number;

  employee_ids?: number[];

  priority?: TaskPriority;

  status?: TaskStatus;

  start_date?: string | null;

  due_date?: string | null;

  estimated_hours?: number | null;

  progress?: number;
}

/* ========================= Update Task Priority ========================= */

export interface TaskPriorityUpdatePayload {
  priority: TaskPriority;
}

/* ========================= Update Task Status ========================= */

export interface TaskStatusUpdatePayload {
  status: TaskStatus;
}

/* ========================= Task Assignment Payload ========================= */

export interface TaskAssignmentPayload {
  employee_id: number;
}

/* ========================= Create Task Message Payload ========================= */

export interface TaskMessageCreatePayload {
  message: string;

  message_type?: TaskMessageType;
}

/* ========================= Update Task Message Payload ========================= */

export interface TaskMessageUpdatePayload {
  message: string;
}

/* ========================= Task Filters ========================= */

export interface TaskFilters {
  search: string;

  status: TaskStatus | "";

  priority: TaskPriority | "";

  client_id: number | "";

  employee_id: number | "";
}

/* ========================= Default Task Filters ========================= */

export const DEFAULT_TASK_FILTERS: TaskFilters = {
  search: "",
  status: "",
  priority: "",
  client_id: "",
  employee_id: "",
};

/* ========================= Task Pagination ========================= */

export interface TaskPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

/* ========================= Task List Query ========================= */

export interface TaskListQuery {
  page?: number;

  limit?: number;

  search?: string;

  status?: TaskStatus | "";

  priority?: TaskPriority | "";

  client_id?: number | "";

  employee_id?: number | "";
}

/* ========================= Task List Response Data ========================= */

export interface TaskListResponseData {
  count: number;

  rows: Task[];

  page: number;

  limit: number;

  totalPages: number;
}

/* ========================= Task Message List Query ========================= */

export interface TaskMessageListQuery {
  page?: number;

  limit?: number;

  search?: string;
}

/* ========================= Task Message Pagination ========================= */

export interface TaskMessagePagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

/* ========================= Task Message List Response Data ========================= */

export interface TaskMessageListResponseData {
  count: number;

  rows: TaskMessage[];

  page: number;

  limit: number;

  totalPages: number;
}

/* ========================= Task Attachment List Query ========================= */

export interface TaskAttachmentListQuery {
  page?: number;

  limit?: number;
}

/* ========================= Task Attachment Pagination ========================= */

export interface TaskAttachmentPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

/* ========================= Task Attachment List Response Data ========================= */

export interface TaskAttachmentListResponseData {
  count: number;

  rows: TaskAttachment[];

  page: number;

  limit: number;

  totalPages: number;
}

/* ========================= Task Attachment Upload Data ========================= */

export interface TaskAttachmentUploadData {
  taskUuid: string;

  message_id?: number | null;

  file: File;
}

/* ========================= Task Summary ========================= */

export interface TaskSummary {
  total: number;

  todo: number;

  in_progress: number;

  in_review: number;

  completed: number;

  overdue: number;
}

/* ========================= Task Status Option ========================= */

export interface TaskStatusOption {
  value: TaskStatus;

  label: string;
}

/* ========================= Task Priority Option ========================= */

export interface TaskPriorityOption {
  value: TaskPriority;

  label: string;
}

/* ========================= Task Employee Option ========================= */

export interface TaskEmployeeOption {
  id: number;

  name: string;

  designation?: string | null;

  department?: string | null;

  profile_image?: string | null;

  status?: TaskEmployeeStatus;
}

/* ========================= Task Client Option ========================= */

export interface TaskClientOption {
  id: number;

  name: string;
}

/* ========================= Generic API Response ========================= */

export interface ApiResponse<T> {
  success: boolean;

  statusCode: number;

  message: string;

  data: T | null;

  errors: unknown;

  timestamp: string;
}

/* ========================= Task API Responses ========================= */

export type CreateTaskResponse =
  ApiResponse<Task>;

export type GetTaskResponse =
  ApiResponse<Task>;

export type GetTasksResponse =
  ApiResponse<TaskListResponseData>;

export type UpdateTaskResponse =
  ApiResponse<Task>;

export type UpdateTaskPriorityResponse =
  ApiResponse<Task>;

export type UpdateTaskStatusResponse =
  ApiResponse<Task>;

export type DeleteTaskResponse =
  ApiResponse<null>;

export type RestoreTaskResponse =
  ApiResponse<Task>;

export type ForceDeleteTaskResponse =
  ApiResponse<boolean>;

export type GetTrashTasksResponse =
  ApiResponse<TaskListResponseData>;

/* ========================= Task Assignment Responses ========================= */

export type AssignTaskEmployeeResponse =
  ApiResponse<TaskAssignment>;

export type RemoveTaskEmployeeResponse =
  ApiResponse<null>;

export type GetTaskAssignmentsResponse =
  ApiResponse<TaskAssignment[]>;

/* ========================= Task Message Responses ========================= */

export type CreateTaskMessageResponse =
  ApiResponse<TaskMessage>;

export type GetTaskMessagesResponse =
  ApiResponse<TaskMessageListResponseData>;

export type GetAllTaskMessagesResponse =
  ApiResponse<TaskMessage[]>;

export type GetLatestTaskMessageResponse =
  ApiResponse<TaskMessage | null>;

export type GetTaskMessageResponse =
  ApiResponse<TaskMessage>;

export type UpdateTaskMessageResponse =
  ApiResponse<TaskMessage>;

export type DeleteTaskMessageResponse =
  ApiResponse<null>;

export type GetTaskMessageCountResponse =
  ApiResponse<number>;

export type GetTaskMessageCountByTypeResponse =
  ApiResponse<
    Record<TaskMessageType, number>
  >;

/* ========================= Task Attachment Responses ========================= */

export type UploadTaskAttachmentResponse =
  ApiResponse<TaskAttachment>;

export type GetTaskAttachmentsResponse =
  ApiResponse<TaskAttachmentListResponseData>;

export type GetDirectTaskAttachmentsResponse =
  ApiResponse<TaskAttachmentListResponseData>;

export type GetMessageAttachmentsResponse =
  ApiResponse<TaskAttachment[]>;

export type GetTaskAttachmentResponse =
  ApiResponse<TaskAttachment>;

export type GetLatestTaskAttachmentResponse =
  ApiResponse<TaskAttachment | null>;

export type GetTaskAttachmentIdsResponse =
  ApiResponse<
    Array<{
      id: number;
      uuid: string;
    }>
  >;

export type GetTaskAttachmentCountResponse =
  ApiResponse<number>;

export type GetDirectTaskAttachmentCountResponse =
  ApiResponse<number>;

export type GetMessageAttachmentCountResponse =
  ApiResponse<number>;

export type UpdateTaskAttachmentResponse =
  ApiResponse<TaskAttachment>;

export type DeleteTaskAttachmentResponse =
  ApiResponse<null>;