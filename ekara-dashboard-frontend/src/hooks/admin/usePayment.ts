"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { paymentService } from "@/src/services/admin/payment.service";

import type {
  CreatePaymentPayload,
  Payment,
  PaymentListQuery,
  PaymentListResponseData,
  ClientPaymentsQuery,
  UpdatePaymentPayload,
  UpdatePaymentStatusPayload,
  UpdatePaymentReminderStatusPayload
} from "@/src/types/admin/payment.types";


/* =========================================================
   TYPES
========================================================= */

interface UsePaymentReturn {
  /* -------------------------------------------------------
     CREATE
  ------------------------------------------------------- */

  createPayment: (
    payload: CreatePaymentPayload
  ) => Promise<Payment | null>;


  /* -------------------------------------------------------
     LIST
  ------------------------------------------------------- */

  getPayments: (
    query?: PaymentListQuery
  ) => Promise<PaymentListResponseData | null>;


  /* -------------------------------------------------------
     DETAILS
  ------------------------------------------------------- */

  getPayment: (
    paymentUuid: string
  ) => Promise<Payment | null>;


  /* -------------------------------------------------------
     CLIENT PAYMENTS
  ------------------------------------------------------- */

  getPaymentsByClient: (
    clientId: number,
    query?: ClientPaymentsQuery
  ) => Promise<PaymentListResponseData | null>;


  /* -------------------------------------------------------
     UPDATE
  ------------------------------------------------------- */

  updatePayment: (
    paymentUuid: string,
    payload: UpdatePaymentPayload
  ) => Promise<Payment | null>;


  /* -------------------------------------------------------
     STATUS
  ------------------------------------------------------- */

  updatePaymentStatus: (
    paymentUuid: string,
    payload: UpdatePaymentStatusPayload
  ) => Promise<Payment | null>;


  updatePaymentReminders: (
  paymentUuid: string,
  payload: UpdatePaymentReminderStatusPayload
) => Promise<Payment | null>;

  /* -------------------------------------------------------
     DELETE
  ------------------------------------------------------- */

  deletePayment: (
    paymentUuid: string
  ) => Promise<boolean>;


  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */

  isLoading: boolean;
  error: string | null;

  clearError: () => void;
}


/* =========================================================
   ERROR HELPER
========================================================= */

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string
): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallbackMessage;
};


/* =========================================================
   HOOK
========================================================= */

const usePayment = (): UsePaymentReturn => {
  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);


  /* =======================================================
     CREATE PAYMENT
  ======================================================= */

  const createPayment = useCallback(
    async (
      payload: CreatePaymentPayload
    ): Promise<Payment | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response  =
          await paymentService.createPayment(
            payload
          );

        toast.success(
          "Payment created successfully",
          {
            description:
              "The payment has been added successfully.",
          }
        );

        return response.data;
      } catch (error: unknown) {
        const message =
          getErrorMessage(
            error,
            "Unable to create payment. Please try again."
          );

        setError(message);

        toast.error(
          "Payment creation failed",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );


  /* =======================================================
     GET PAYMENT LIST
  ======================================================= */

  const getPayments = useCallback(
    async (
      query?: PaymentListQuery
    ): Promise<PaymentListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          await paymentService.getPayments(
            query
          );

        return response.data;
      } catch (error: unknown) {
        const message =
          getErrorMessage(
            error,
            "Unable to fetch payments."
          );

        setError(message);

        toast.error(
          "Failed to load payments",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );


  /* =======================================================
     GET PAYMENT DETAILS
  ======================================================= */

  const getPayment = useCallback(
    async (
      paymentUuid: string
    ): Promise<Payment | null> => {
      try {
        setIsLoading(true);
        setError(null);

        if (!paymentUuid) {
          throw new Error(
            "Payment UUID is required."
          );
        }

        const response =
          await paymentService.getPayment(
            paymentUuid
          );

        return response.data;
      } catch (error: unknown) {
        const message =
          getErrorMessage(
            error,
            "Unable to fetch payment details."
          );

        setError(message);

        toast.error(
          "Failed to load payment",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );


  /* =======================================================
     GET PAYMENTS BY CLIENT
  ======================================================= */

  const getPaymentsByClient = useCallback(
    async (
      clientId: number,
      query?: ClientPaymentsQuery
    ): Promise<PaymentListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        if (!clientId) {
          throw new Error(
            "Client ID is required."
          );
        }

        const response =
          await paymentService.getPaymentsByClient(
            clientId,
            query
          );

        return response.data;
      } catch (error: unknown) {
        const message =
          getErrorMessage(
            error,
            "Unable to fetch client payments."
          );

        setError(message);

        toast.error(
          "Failed to load client payments",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );


  /* =======================================================
     UPDATE PAYMENT
  ======================================================= */

  const updatePayment = useCallback(
    async (
      paymentUuid: string,
      payload: UpdatePaymentPayload
    ): Promise<Payment | null> => {
      try {
        setIsLoading(true);
        setError(null);

        if (!paymentUuid) {
          throw new Error(
            "Payment UUID is required."
          );
        }

        const response =
          await paymentService.updatePayment(
            paymentUuid,
            payload
          );

        toast.success(
          "Payment updated successfully",
          {
            description:
              "The payment has been updated successfully.",
          }
        );

        return response.data;
      } catch (error: unknown) {
        const message =
          getErrorMessage(
            error,
            "Unable to update payment."
          );

        setError(message);

        toast.error(
          "Payment update failed",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );


  /* =======================================================
     UPDATE PAYMENT STATUS
  ======================================================= */

  const updatePaymentStatus = useCallback(
    async (
      paymentUuid: string,
      payload: UpdatePaymentStatusPayload
    ): Promise<Payment | null> => {
      try {
        setIsLoading(true);
        setError(null);

        if (!paymentUuid) {
          throw new Error(
            "Payment UUID is required."
          );
        }

        const response =
          await paymentService.updatePaymentStatus(
            paymentUuid,
            payload
          );

        toast.success(
          "Payment status updated successfully",
          {
            description:
              "The payment status has been updated successfully.",
          }
        );

        return response.data;
      } catch (error: unknown) {
        const message =
          getErrorMessage(
            error,
            "Unable to update payment status."
          );

        setError(message);

        toast.error(
          "Payment status update failed",
          {
            description: message,
          }
        );

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );


  /* =======================================================
     DELETE PAYMENT
     -------------------------------------------------------
     Backend performs HARD DELETE.
  ======================================================= */

  const deletePayment = useCallback(
    async (
      paymentUuid: string
    ): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        if (!paymentUuid) {
          throw new Error(
            "Payment UUID is required."
          );
        }

        await paymentService.deletePayment(
          paymentUuid
        );

        toast.success(
          "Payment deleted successfully",
          {
            description:
              "The payment has been permanently deleted.",
          }
        );

        return true;
      } catch (error: unknown) {
        const message =
          getErrorMessage(
            error,
            "Unable to delete payment."
          );

        setError(message);

        toast.error(
          "Payment deletion failed",
          {
            description: message,
          }
        );

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );


  const updatePaymentReminders = useCallback(
  async (
    paymentUuid: string,
    payload: UpdatePaymentReminderStatusPayload
  ): Promise<Payment | null> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!paymentUuid) {
        throw new Error(
          "Payment UUID is required."
        );
      }

      const response =
        await paymentService.updatePaymentReminders(
          paymentUuid,
          payload
        );

      toast.success(
        payload.enabled
          ? "Payment reminders enabled"
          : "Payment reminders muted",
        {
          description: payload.enabled
            ? "Payment reminders have been enabled successfully."
            : "Payment reminders have been muted successfully.",
        }
      );

      return response.data;
    } catch (error: unknown) {
      const message =
        getErrorMessage(
          error,
          "Unable to update payment reminders."
        );

      setError(message);

      toast.error(
        "Reminder update failed",
        {
          description: message,
        }
      );

      return null;
    } finally {
      setIsLoading(false);
    }
  },
  []
);

  /* =======================================================
     CLEAR ERROR
  ======================================================= */

  const clearError = useCallback((): void => {
    setError(null);
  }, []);


  /* =======================================================
     RETURN
  ======================================================= */

    return {
      createPayment,
      getPayments,
      getPayment,
      getPaymentsByClient,
      updatePayment,
      updatePaymentStatus,
      updatePaymentReminders,
      deletePayment,

      isLoading,
      error,
      clearError,
    };
};


export default usePayment;