import { paymentApi } from "@/src/api/admin/payment.api";

import type {
  CreatePaymentPayload,
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
  UpdatePaymentReminderStatusResponse
} from "@/src/types/admin/payment.types";


/* =========================================================
   PAYMENT SERVICE
========================================================= */

export const paymentService = {
  /* =======================================================
     CREATE PAYMENT
     -------------------------------------------------------
     Creates payment with or without reminders.
  ======================================================= */

  createPayment: async (
    payload: CreatePaymentPayload
  ): Promise<GetPaymentResponse> => {
    const response =
      await paymentApi.createPayment(payload);

    return response;
  },


  /* =======================================================
     GET PAYMENT LIST
     -------------------------------------------------------
     Supports:
     - search
     - pagination
     - client filter
     - status filter
     - payment month
     - due date
  ======================================================= */

  getPayments: async (
    query: PaymentListQuery = {}
  ): Promise<GetPaymentsResponse> => {
    const response =
      await paymentApi.getPayments(query);

    return response;
  },


  /* =======================================================
     GET SINGLE PAYMENT
     -------------------------------------------------------
     Returns complete payment details:
     - client
     - reminders
     - creator
     - updater
  ======================================================= */

  getPayment: async (
    paymentUuid: string
  ): Promise<GetPaymentResponse> => {
    const response =
      await paymentApi.getPayment(paymentUuid);

    return response;
  },


  /* =======================================================
     GET PAYMENTS BY CLIENT
     -------------------------------------------------------
     Used when payment history is required for a
     specific client.
  ======================================================= */

  getPaymentsByClient: async (
    clientId: number,
    query: ClientPaymentsQuery = {}
  ): Promise<GetClientPaymentsResponse> => {
    const response =
      await paymentApi.getPaymentsByClient(
        clientId,
        query
      );

    return response;
  },


  /* =======================================================
     UPDATE PAYMENT
     -------------------------------------------------------
     Updates:
     - client
     - payment month
     - amount
     - due date
     - status
     - reminders
     - reminder enable/disable
  ======================================================= */

  updatePayment: async (
    paymentUuid: string,
    payload: UpdatePaymentPayload
  ): Promise<UpdatePaymentResponse> => {
    const response =
      await paymentApi.updatePayment(
        paymentUuid,
        payload
      );

    return response;
  },


  /* =======================================================
     UPDATE PAYMENT STATUS
     -------------------------------------------------------
     Status:
     - due
     - paid
     - overdue
  ======================================================= */

  updatePaymentStatus: async (
    paymentUuid: string,
    payload: UpdatePaymentStatusPayload
  ): Promise<UpdatePaymentStatusResponse> => {
    const response =
      await paymentApi.updatePaymentStatus(
        paymentUuid,
        payload
      );

    return response;
  },


  /* =======================================================
     DELETE PAYMENT
     -------------------------------------------------------
     Backend performs HARD DELETE.
  ======================================================= */

  deletePayment: async (
    paymentUuid: string
  ): Promise<DeletePaymentResponse> => {
    const response =
      await paymentApi.deletePayment(
        paymentUuid
      );

    return response;
  },


  updatePaymentReminders: async (
    paymentUuid: string,
    payload: UpdatePaymentReminderStatusPayload
  ): Promise<UpdatePaymentReminderStatusResponse> => {
    const response =
      await paymentApi.updatePaymentReminders(
        paymentUuid,
        payload
      );

    return response;
  },
};
