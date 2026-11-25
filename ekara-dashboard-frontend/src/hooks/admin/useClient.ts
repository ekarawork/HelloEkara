"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { clientService } from "@/src/services/admin/client.service";

import {
  CreateClientPayload,
  Client,
  ClientListQuery,
  ClientListResponseData,
  UpdateClientPayload,
  UpdateClientStatusPayload,
} from "@/src/types/admin/client.types";

interface UseClientReturn {
  createClient: (payload: CreateClientPayload) => Promise<Client | null>;
  getClients: (query?: ClientListQuery) => Promise<ClientListResponseData | null>;
  getClient: (uuid: string) => Promise<Client | null>;
  updateClient: (uuid: string, payload: UpdateClientPayload) => Promise<Client | null>;
  updateClientStatus: (uuid: string, payload: UpdateClientStatusPayload) => Promise<Client | null>;
  deleteClient: (uuid: string) => Promise<boolean>;
  restoreClient: (uuid: string) => Promise<Client | null>;
  forceDeleteClient: (uuid: string) => Promise<boolean>;
  getTrashClients: (query?: ClientListQuery) => Promise<ClientListResponseData | null>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

// Error Helper
const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
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
const useClient = (): UseClientReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Create Client
  const createClient = useCallback(
    async (payload: CreateClientPayload): Promise<Client | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await clientService.createClient(payload);

        toast.success("Client created successfully", {
          description: "The new client has been added successfully.",
        });

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to create client. Please try again."
        );

        setError(message);

        toast.error("Client creation failed", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get Clients
  const getClients = useCallback(
    async (query?: ClientListQuery): Promise<ClientListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await clientService.getClients(query);

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Unable to fetch clients.");

        setError(message);

        toast.error("Failed to load clients", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get Client Details
  const getClient = useCallback(
    async (uuid: string): Promise<Client | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await clientService.getClient(uuid);

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch client details."
        );

        setError(message);

        toast.error("Failed to load client", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Update Client
  const updateClient = useCallback(
    async (
      uuid: string,
      payload: UpdateClientPayload
    ): Promise<Client | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await clientService.updateClient(uuid, payload);

        toast.success("Client updated successfully", {
          description: "The client information has been updated.",
        });

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Unable to update client.");

        setError(message);

        toast.error("Client update failed", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Update Client Status
  const updateClientStatus = useCallback(
    async (
      uuid: string,
      payload: UpdateClientStatusPayload
    ): Promise<Client | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await clientService.updateClientStatus(uuid, payload);

        toast.success("Client status updated", {
          description: "The client status has been updated successfully.",
        });

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to update client status."
        );

        setError(message);

        toast.error("Status update failed", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Soft Delete Client
  const deleteClient = useCallback(
    async (uuid: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        await clientService.deleteClient(uuid);

        toast.success("Client moved to trash", {
          description: "The client has been moved to trash successfully.",
        });

        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Unable to delete client.");

        setError(message);

        toast.error("Client deletion failed", {
          description: message,
        });

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Restore Client
  const restoreClient = useCallback(
    async (uuid: string): Promise<Client | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await clientService.restoreClient(uuid);

        toast.success("Client restored successfully", {
          description: "The client has been restored successfully.",
        });

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(error, "Unable to restore client.");

        setError(message);

        toast.error("Client restore failed", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Force Delete Client
  const forceDeleteClient = useCallback(
    async (uuid: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        await clientService.forceDeleteClient(uuid);

        toast.success("Client permanently deleted", {
          description: "The client has been permanently deleted.",
        });

        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to permanently delete client."
        );

        setError(message);

        toast.error("Permanent deletion failed", {
          description: message,
        });

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get Trash Clients
  const getTrashClients = useCallback(
    async (query?: ClientListQuery): Promise<ClientListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await clientService.getTrashClients(query);

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch deleted clients."
        );

        setError(message);

        toast.error("Failed to load trash clients", {
          description: message,
        });

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
    createClient,
    getClients,
    getClient,
    updateClient,
    updateClientStatus,
    deleteClient,
    restoreClient,
    forceDeleteClient,
    getTrashClients,
    isLoading,
    error,
    clearError,
  };
};

export default useClient;