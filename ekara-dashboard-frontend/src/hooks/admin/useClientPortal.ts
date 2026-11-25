"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { clientPortalService } from "@/src/services/admin/clientPortal.service";

import {
  ClientPortalAccessData,
} from "@/src/types/admin/clientPortal.types";

interface UseClientPortalReturn {
  createClientPortalAccess: (
    clientUuid: string
  ) => Promise<ClientPortalAccessData | null>;

  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

// Error Helper
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

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

// Hook
const useClientPortal = (): UseClientPortalReturn => {
  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  // Create Client Portal Preview Access
  const createClientPortalAccess = useCallback(
    async (
      clientUuid: string
    ): Promise<ClientPortalAccessData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await clientPortalService.createClientPortalAccess(
            clientUuid
          );

        toast.success(
          "Client portal access created",
          {
            description:
              "Client portal is ready to open.",
          }
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to open client portal. Please try again."
        );

        setError(message);

        toast.error(
          "Failed to open client portal",
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

  // Clear Error
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    createClientPortalAccess,
    isLoading,
    error,
    clearError,
  };
};

export default useClientPortal;