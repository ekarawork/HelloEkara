import axiosInstance from "@/src/lib/axios";

import type {
  CreatePaymentPayload,
  CreatePaymentResponse,
  GetPaymentResponse,
  GetPaymentsResponse,
  UpdatePaymentPayload,
  UpdatePaymentResponse,
  UpdatePaymentStatusPayload,
  UpdatePaymentStatusResponse,
  DeletePaymentResponse,
  GetClientPaymentsResponse,
  PaymentListQuery,
  ClientPaymentsQuery,
  UpdatePaymentReminderStatusPayload,
  UpdatePaymentReminderStatusResponse,
} from "@/src/types/admin/payment.types";


/* =========================================================
   CREATE PAYMENT
   POST /admin/payments/create

   With reminders:
   {
     client_id,
     payment_month,
     amount,
     due_date,
     status,
     enable_reminders: true,
     reminders: [...]
   }

   Without reminders:
   {
     client_id,
     payment_month,
     amount,
     due_date,
     status,
     enable_reminders: false
   }
========================================================= */

const createPayment = async (
  payload: CreatePaymentPayload
): Promise<CreatePaymentResponse> => {
  const response =
    await axiosInstance.post<CreatePaymentResponse>(
      "/admin/payments/create",
      payload
    );

  return response.data;
};


/* =========================================================
   GET PAYMENT LIST
   GET /admin/payments/list

   Supports:
   - search
   - pagination
   - client filter
   - status filter
   - payment month filter
   - due date filter

   Example:
   /admin/payments/list?page=1&limit=10&search=Balaji
========================================================= */

const getPayments = async (
  query: PaymentListQuery = {}
): Promise<GetPaymentsResponse> => {
  const response =
    await axiosInstance.get<GetPaymentsResponse>(
      "/admin/payments/list",
      {
        params: query,
      }
    );

  return response.data;
};


/* =========================================================
   GET PAYMENT DETAILS
   GET /admin/payments/list/:uuid

   Returns:
   - payment
   - client
   - reminders
   - creator
   - updater
========================================================= */

const getPayment = async (
  paymentUuid: string
): Promise<GetPaymentResponse> => {
  const response =
    await axiosInstance.get<GetPaymentResponse>(
      `/admin/payments/list/${paymentUuid}`
    );

  return response.data;
};


/* =========================================================
   GET PAYMENTS BY CLIENT
   GET /admin/payments/client/:clientId

   Supports:
   - pagination
   - limit
========================================================= */

const getPaymentsByClient = async (
  clientId: number,
  query: ClientPaymentsQuery = {}
): Promise<GetClientPaymentsResponse> => {
  const response =
    await axiosInstance.get<GetClientPaymentsResponse>(
      `/admin/payments/client/${clientId}`,
      {
        params: query,
      }
    );

  return response.data;
};


/* =========================================================
   UPDATE PAYMENT
   PATCH /admin/payments/update/:uuid

   Used for:
   - client
   - month
   - amount
   - due date
   - status
   - enable/disable reminders
   - reminder configuration
========================================================= */

const updatePayment = async (
  paymentUuid: string,
  payload: UpdatePaymentPayload
): Promise<UpdatePaymentResponse> => {
  const response =
    await axiosInstance.patch<UpdatePaymentResponse>(
      `/admin/payments/update/${paymentUuid}`,
      payload
    );

  return response.data;
};


/* =========================================================
   UPDATE PAYMENT STATUS
   PATCH /admin/payments/status/:uuid

   Body:
   {
     status: "due" | "paid" | "overdue"
   }

   Backend automatically handles paid_at.
========================================================= */

const updatePaymentStatus = async (
  paymentUuid: string,
  payload: UpdatePaymentStatusPayload
): Promise<UpdatePaymentStatusResponse> => {
  const response =
    await axiosInstance.patch<UpdatePaymentStatusResponse>(
      `/admin/payments/status/${paymentUuid}`,
      payload
    );

  return response.data;
};


/* =========================================================
   DELETE PAYMENT
   DELETE /admin/payments/trash/:uuid

   Backend performs HARD DELETE.

   Even though the route contains "trash",
   the payment is permanently deleted.
========================================================= */

const deletePayment = async (
  paymentUuid: string
): Promise<DeletePaymentResponse> => {
  const response =
    await axiosInstance.delete<DeletePaymentResponse>(
      `/admin/payments/delete/${paymentUuid}`
    );

  return response.data;
};


const updatePaymentReminders = async (
  paymentUuid: string,
  payload: UpdatePaymentReminderStatusPayload
): Promise<UpdatePaymentReminderStatusResponse> => {
  const response =
    await axiosInstance.patch<UpdatePaymentReminderStatusResponse>(
      `/admin/payments/reminders/${paymentUuid}`,
      payload
    );

  return response.data;
};

/* =========================================================
   EXPORT
========================================================= */

export const paymentApi = {
  createPayment,
  getPayments,
  getPayment,
  getPaymentsByClient,
  updatePayment,
  updatePaymentStatus,
  deletePayment,
  updatePaymentReminders
};