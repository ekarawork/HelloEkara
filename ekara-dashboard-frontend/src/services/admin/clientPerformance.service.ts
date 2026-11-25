import { clientPerformanceApi } from "@/src/api/admin/clientPerformance.api";

import {
  CreateClientPerformancePayload,
  ClientPerformance,
  ClientPerformanceListQuery,
  ClientPerformanceListResponseData,
  UpdateClientPerformancePayload,
  ClientPerformanceDashboardQuery,
  ClientPerformanceDashboardData,
} from "@/src/types/admin/clientPerformance.types";

// Create Client Performance
const createPerformance = async (
  payload: CreateClientPerformancePayload
): Promise<ClientPerformance> => {
  const response = await clientPerformanceApi.createPerformance(payload);

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Client performance creation failed."
    );
  }

  return response.data;
};

// Get All Client Performance List
const getPerformances = async (
  query?: ClientPerformanceListQuery
): Promise<ClientPerformanceListResponseData> => {
  const response =
    await clientPerformanceApi.getPerformances(query);

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Failed to fetch client performances."
    );
  }

  return response.data;
};

// Get Client Performance Details
const getPerformance = async (
  performanceUuid: string
): Promise<ClientPerformance> => {
  const response =
    await clientPerformanceApi.getPerformance(performanceUuid);

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Failed to fetch performance details."
    );
  }

  return response.data;
};

// Update Client Performance
const updatePerformance = async (
  performanceUuid: string,
  payload: UpdateClientPerformancePayload
): Promise<ClientPerformance> => {
  const response = await clientPerformanceApi.updatePerformance(
    performanceUuid,
    payload
  );

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Client performance update failed."
    );
  }

  return response.data;
};

// Soft Delete Client Performance
const deletePerformance = async (
  performanceUuid: string
): Promise<boolean> => {
  const response =
    await clientPerformanceApi.deletePerformance(performanceUuid);

  if (!response.success) {
    throw new Error(
      response.message || "Client performance deletion failed."
    );
  }

  return true;
};

// Get Trash Client Performances
// Get Trash Client Performances
const getTrashPerformances = async (
  query?: ClientPerformanceListQuery
): Promise<ClientPerformanceListResponseData> => {
  const response =
    await clientPerformanceApi.getTrashPerformances(
      query
    );

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch deleted client performances."
    );
  }

  return response.data;
};

// Restore Client Performance
const restorePerformance = async (
  performanceUuid: string
): Promise<ClientPerformance> => {
  const response =
    await clientPerformanceApi.restorePerformance(performanceUuid);

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Client performance restore failed."
    );
  }

  return response.data;
};

// Force Delete Client Performance
const forceDeletePerformance = async (
  performanceUuid: string
): Promise<boolean> => {
  const response =
    await clientPerformanceApi.forceDeletePerformance(
      performanceUuid
    );

  if (!response.success) {
    throw new Error(
      response.message ||
        "Client performance permanent deletion failed."
    );
  }

  return true;
};

// Get Client Performance Dashboard
const getDashboardPerformance = async (
  query?: ClientPerformanceDashboardQuery
): Promise<ClientPerformanceDashboardData> => {
  const response =
    await clientPerformanceApi.getDashboardPerformance(query);

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Failed to fetch performance dashboard."
    );
  }

  return response.data;
};

// Export
export const clientPerformanceService = {
  createPerformance,
  getPerformances,
  getPerformance,
  updatePerformance,
  deletePerformance,
  getTrashPerformances,
  restorePerformance,
  forceDeletePerformance,
  getDashboardPerformance
};