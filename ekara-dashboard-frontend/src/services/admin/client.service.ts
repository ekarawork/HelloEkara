import { clientApi } from "@/src/api/admin/client.api";

import {
  CreateClientPayload,
  Client,
  ClientListQuery,
  ClientListResponseData,
  UpdateClientPayload,
  UpdateClientStatusPayload,
} from "@/src/types/admin/client.types";

// Create Client
const createClient = async (payload: CreateClientPayload): Promise<Client> => {
  const response = await clientApi.createClient(payload);

  if (!response.success || !response.data) {
    throw new Error(response.message || "Client creation failed.");
  }

  return response.data;
};

// Get Clients
const getClients = async (
  query?: ClientListQuery
): Promise<ClientListResponseData> => {
  const response = await clientApi.getClients(query);

  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to fetch clients.");
  }

  return response.data;
};

// Get Client Details
const getClient = async (uuid: string): Promise<Client> => {
  const response = await clientApi.getClient(uuid);

  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to fetch client details.");
  }

  return response.data;
};

// Update Client
const updateClient = async (
  uuid: string,
  payload: UpdateClientPayload
): Promise<Client> => {
  const response = await clientApi.updateClient(uuid, payload);

  if (!response.success || !response.data) {
    throw new Error(response.message || "Client update failed.");
  }

  return response.data;
};

// Update Client Status
const updateClientStatus = async (
  uuid: string,
  payload: UpdateClientStatusPayload
): Promise<Client> => {
  const response = await clientApi.updateClientStatus(uuid, payload);

  if (!response.success || !response.data) {
    throw new Error(response.message || "Client status update failed.");
  }

  return response.data;
};

// Soft Delete Client
const deleteClient = async (uuid: string): Promise<boolean> => {
  const response = await clientApi.deleteClient(uuid);

  if (!response.success) {
    throw new Error(response.message || "Client deletion failed.");
  }

  return true;
};

// Restore Client
const restoreClient = async (uuid: string): Promise<Client> => {
  const response = await clientApi.restoreClient(uuid);

  if (!response.success || !response.data) {
    throw new Error(response.message || "Client restore failed.");
  }

  return response.data;
};

// Force Delete Client
const forceDeleteClient = async (uuid: string): Promise<boolean> => {
  const response = await clientApi.forceDeleteClient(uuid);

  if (!response.success) {
    throw new Error(response.message || "Client permanent deletion failed.");
  }

  return true;
};

// Get Trash Clients
const getTrashClients = async (
  query?: ClientListQuery
): Promise<ClientListResponseData> => {
  const response = await clientApi.getTrashClients(query);

  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to fetch deleted clients.");
  }

  return response.data;
};

// Get Client Agreement
const getClientAgreement = async (uuid: string): Promise<Blob> => {
  return await clientApi.getClientAgreement(uuid);
};

// Export
export const clientService = {
  createClient,
  getClients,
  getClient,
  updateClient,
  updateClientStatus,
  deleteClient,
  restoreClient,
  forceDeleteClient,
  getTrashClients,
  getClientAgreement,
};