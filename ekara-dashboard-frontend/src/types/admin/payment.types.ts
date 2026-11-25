/* =========================================================
   PAYMENT STATUS
========================================================= */

export type PaymentStatus =
  | "due"
  | "paid"
  | "overdue";


/* =========================================================
   PAYMENT REMINDER TYPE
========================================================= */

export type PaymentReminderType =
  | "before"
  | "due_day"
  | "after";


/* =========================================================
   PAYMENT CLIENT
========================================================= */

export interface PaymentClient {
  id: number;
  uuid: string;
  name: string;
  email: string;
  login_id: string;
}


/* =========================================================
   PAYMENT USER
========================================================= */

export interface PaymentUser {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
}


/* =========================================================
   PAYMENT REMINDER
========================================================= */

export interface PaymentReminder {
  id: number;
  uuid: string;

  payment_id: number;

  reminder_type: PaymentReminderType;

  enabled: boolean;

  /*
   * before:
   *   number of days before due date
   *
   * due_day:
   *   null
   *
   * after:
   *   number of days after due date
   */
  days_offset: number | null;

  message: string;

  created_by: number | null;
  updated_by: number | null;

  createdAt: string;
  updatedAt: string;

  creator?: PaymentUser;
  updater?: PaymentUser;
}


/* =========================================================
   PAYMENT
========================================================= */

export interface Payment {
  id: number;
  uuid: string;

  client_id: number;

  payment_month: string;

  /*
   * Sequelize DECIMAL may come as string
   * depending on configuration.
   */
  amount: number | string;

  due_date: string;

  status: PaymentStatus;

  paid_at: string | null;

  enable_reminders: boolean;

  created_by: number | null;
  updated_by: number | null;

  createdAt: string;
  updatedAt: string;

  /*
   * Included in payment list/details
   */
  client?: PaymentClient;

  /*
   * Included in payment details
   */
  reminders?: PaymentReminder[];

  creator?: PaymentUser;
  updater?: PaymentUser;
}


/* =========================================================
   CREATE PAYMENT REMINDER PAYLOAD
========================================================= */

export interface CreatePaymentReminderPayload {
  reminder_type: PaymentReminderType;

  enabled?: boolean;

  days_offset?: number | null;

  message: string;
}


/* =========================================================
   UPDATE PAYMENT REMINDER PAYLOAD
========================================================= */

export interface UpdatePaymentReminderPayload {
  /*
   * Optional because backend supports
   * partial reminder updates.
   */
  payment_id?: number;

  reminder_type?: PaymentReminderType;

  enabled?: boolean;

  days_offset?: number | null;

  message?: string;
}


/* =========================================================
   UPDATE REMINDER STATUS PAYLOAD
========================================================= */

export interface UpdatePaymentReminderStatusPayload {
  enabled: boolean;
}


/* =========================================================
   CREATE PAYMENT PAYLOAD
========================================================= */

export interface CreatePaymentPayload {
  client_id: number;

  payment_month: string;

  amount: number;

  due_date: string;

  status?: PaymentStatus;

  /*
   * false:
   *   payment will be created without reminders
   *
   * true:
   *   reminders must be provided
   */
  enable_reminders?: boolean;

  reminders?: CreatePaymentReminderPayload[];
}


/* =========================================================
   UPDATE PAYMENT PAYLOAD
========================================================= */

export interface UpdatePaymentPayload {
  client_id?: number;

  payment_month?: string;

  amount?: number;

  due_date?: string;

  status?: PaymentStatus;

  enable_reminders?: boolean;

  reminders?: UpdatePaymentReminderPayload[];
}


/* =========================================================
   UPDATE PAYMENT STATUS PAYLOAD
========================================================= */

export interface UpdatePaymentStatusPayload {
  status: PaymentStatus;
}


/* =========================================================
   PAYMENT LIST QUERY
========================================================= */

export interface PaymentListQuery {
  /*
   * Pagination
   */
  page?: number;
  limit?: number;

  /*
   * Search
   *
   * Backend searches client name/email.
   */
  search?: string;

  /*
   * Filter by client
   */
  client_id?: number;

  /*
   * Filter by payment status
   */
  status?: PaymentStatus;

  /*
   * Filter by payment month
   */
  payment_month?: string;

  /*
   * Filter by due date
   */
  due_date?: string;
}


/* =========================================================
   PAYMENT LIST RESPONSE DATA
========================================================= */

export interface PaymentListResponseData {
  count: number;

  rows: Payment[];

  page: number;

  limit: number;

  totalPages: number;
}


/* =========================================================
   CLIENT PAYMENTS QUERY
========================================================= */

export interface ClientPaymentsQuery {
  page?: number;

  limit?: number;
}


/* =========================================================
   REMINDER LIST QUERY
========================================================= */

export interface PaymentReminderListQuery {
  page?: number;

  limit?: number;

  payment_id?: number;

  reminder_type?: PaymentReminderType;

  enabled?: boolean;
}


/* =========================================================
   REMINDER LIST RESPONSE
========================================================= */

export interface PaymentReminderListResponseData {
  count: number;

  rows: PaymentReminder[];

  page: number;

  limit: number;

  totalPages: number;
}


/* =========================================================
   DASHBOARD PAYMENT STATS
========================================================= */

export interface PaymentDashboardStats {
  /*
   * Total amount of payments
   * having status = due or overdue.
   */
  totalDue: number | string;

  /*
   * Total amount of payments
   * having status = paid.
   */
  paidAmount: number | string;

  /*
   * Total number of payments
   * having status = due or overdue.
   */
  totalDuePayments: number;

  /*
   * Total number of payments
   * having status = paid.
   */
  totalPaidPayments: number;
}


/* =========================================================
   GENERIC API RESPONSE
========================================================= */

export interface ApiResponse<T> {
  success: boolean;

  statusCode: number;

  message: string;

  data: T | null;

  errors: unknown;

  timestamp: string;
}


/* =========================================================
   PAYMENT API RESPONSES
========================================================= */

export type CreatePaymentResponse =
  ApiResponse<Payment>;


export type GetPaymentResponse =
  ApiResponse<Payment>;


export type GetPaymentsResponse =
  ApiResponse<PaymentListResponseData>;


export type UpdatePaymentResponse =
  ApiResponse<Payment>;


export type UpdatePaymentStatusResponse =
  ApiResponse<Payment>;


export type DeletePaymentResponse =
  ApiResponse<null>;


export type GetClientPaymentsResponse =
  ApiResponse<PaymentListResponseData>;


/* =========================================================
   REMINDER API RESPONSES
========================================================= */

export type CreatePaymentReminderResponse =
  ApiResponse<PaymentReminder>;


export type GetPaymentReminderResponse =
  ApiResponse<PaymentReminder>;


export type GetPaymentRemindersResponse =
  ApiResponse<PaymentReminderListResponseData>;


export type UpdatePaymentReminderResponse =
  ApiResponse<PaymentReminder>;


export type UpdatePaymentReminderStatusResponse =
  ApiResponse<Payment>;


/* =========================================================
   DASHBOARD STATS RESPONSE
========================================================= */

export type GetPaymentDashboardStatsResponse =
  ApiResponse<PaymentDashboardStats>;