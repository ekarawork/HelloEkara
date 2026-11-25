// =========================================================
// Employee Task Priority
// =========================================================

export type EmployeeTaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

// =========================================================
// Employee Task Status
// =========================================================

export type EmployeeTaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "COMPLETED";

// =========================================================
// Dashboard Task Client
// =========================================================

export interface EmployeeDashboardTaskClient {
  id?: number;
  uuid: string;
  name: string;
}

// =========================================================
// Dashboard Task
// =========================================================

export interface EmployeeDashboardTask {
  id?: number;
  uuid: string;
  taskCode: string;
  title: string;
  description?: string | null;
  priority: EmployeeTaskPriority;
  status: EmployeeTaskStatus;
  startDate: string | null;
  dueDate: string | null;
  estimatedHours?: number | null;
  progress: number;
  completedAt?: string | null;
  client: EmployeeDashboardTaskClient | null;
}

// =========================================================
// Task Summary
// =========================================================

export interface EmployeeDashboardSummary {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  inReviewTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

// =========================================================
// Task Status Overview
// =========================================================

export interface EmployeeDashboardStatusOverview {
  status: EmployeeTaskStatus;
  count: number;
}

// =========================================================
// Dashboard Meta
// =========================================================

export interface EmployeeDashboardMeta {
  today: string;
  upcomingUntil: string;
}

// =========================================================
// Dashboard Data
// =========================================================

export interface EmployeeDashboardData {
  summary: EmployeeDashboardSummary;
  recentTasks: EmployeeDashboardTask[];
  upcomingDeadlines: EmployeeDashboardTask[];
  overdueTasks: EmployeeDashboardTask[];
  taskStatusOverview: EmployeeDashboardStatusOverview[];
  meta: EmployeeDashboardMeta;
}

// =========================================================
// Dashboard Query
// =========================================================

export interface EmployeeDashboardQuery {
  recent_limit?: number;
  upcoming_limit?: number;
  overdue_limit?: number;
}

// =========================================================
// Generic API Response
// =========================================================

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

// =========================================================
// Employee Dashboard API Response
// =========================================================

export type GetEmployeeDashboardResponse =
  ApiResponse<EmployeeDashboardData>;