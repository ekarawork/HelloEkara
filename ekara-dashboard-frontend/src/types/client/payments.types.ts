// =========================================================
// Payment Dashboard Summary
// =========================================================

export interface ClientPaymentDashboardSummary {
  totalDue: number;
  paidAmount: number;
  totalDuePayments: number;
  totalPaidPayments: number;
}

// =========================================================
// Payment History
// =========================================================

export interface ClientPaymentHistory {
  uuid: string;
  paymentMonth: string;
  amount: number;
  dueDate: string;
  status: "due" | "paid" | "overdue";
  paidAt: string | null;
  remindersEnabled: boolean;
}

// =========================================================
// Payment Dashboard Response Data
// =========================================================

export interface ClientPaymentDashboardData {
  summary: ClientPaymentDashboardSummary;
  payments: ClientPaymentHistory[];
}

// =========================================================
// Payment Dashboard Query
// =========================================================

export interface ClientPaymentDashboardQuery {
  paymentMonth?: string;
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
// Payment Dashboard API Response
// =========================================================

export type GetClientPaymentDashboardResponse =
  ApiResponse<ClientPaymentDashboardData>;