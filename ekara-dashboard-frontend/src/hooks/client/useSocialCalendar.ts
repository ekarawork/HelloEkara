"use client";

import {
  useCallback,
  useState,
} from "react";

import { toast } from "sonner";

import {
  socialCalendarService,
} from "@/src/services/client/socialCalendar.service";

import {
  ClientSocialCalendarDashboardQuery,
  ClientSocialCalendarDashboardData,
} from "@/src/types/client/socialCalendar.types";

/* =========================================================
   RETURN TYPE
========================================================= */

interface UseSocialCalendarReturn {
  getSocialCalendarDashboard: (
    query?: ClientSocialCalendarDashboardQuery
  ) => Promise<ClientSocialCalendarDashboardData | null>;

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

const useSocialCalendar =
  (): UseSocialCalendarReturn => {
    const [isLoading, setIsLoading] =
      useState<boolean>(false);

    const [error, setError] =
      useState<string | null>(null);

    /* =======================================================
       GET SOCIAL CALENDAR DASHBOARD
    ======================================================= */

    const getSocialCalendarDashboard =
      useCallback(
        async (
          query?: ClientSocialCalendarDashboardQuery
        ): Promise<ClientSocialCalendarDashboardData | null> => {
          try {
            setIsLoading(true);
            setError(null);

            const data =
              await socialCalendarService.getSocialCalendarDashboard(
                query
              );

            return data;
          } catch (error: unknown) {
            const message =
              getErrorMessage(
                error,
                "Unable to fetch Social Calendar dashboard data."
              );

            setError(message);

            toast.error(
              "Failed to load Social Calendar dashboard",
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

    const clearError = useCallback(
      (): void => {
        setError(null);
      },
      []
    );

    /* =======================================================
       RETURN
    ======================================================= */

    return {
      getSocialCalendarDashboard,
      isLoading,
      error,
      clearError,
    };
  };

export default useSocialCalendar;