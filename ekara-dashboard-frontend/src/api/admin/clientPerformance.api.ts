import axiosInstance from "@/src/lib/axios";

import {
  CreateClientPerformancePayload,
  CreateClientPerformanceResponse,
  GetClientPerformanceResponse,
  GetClientPerformancesResponse,
  GetTrashClientPerformancesResponse,
  UpdateClientPerformancePayload,
  UpdateClientPerformanceResponse,
  DeleteClientPerformanceResponse,
  RestoreClientPerformanceResponse,
  ForceDeleteClientPerformanceResponse,
  ClientPerformanceListQuery,
  ClientPerformanceDashboardQuery,
  GetClientPerformanceDashboardResponse,
} from "@/src/types/admin/clientPerformance.types";

// Create Client Performance
const createPerformance = async (
  payload: CreateClientPerformancePayload
): Promise<CreateClientPerformanceResponse> => {
  const response =
    await axiosInstance.post<CreateClientPerformanceResponse>(
      "/admin/client-performance/create",
      payload
    );

  return response.data;
};

// Get All Client Performance List
const getPerformances = async (
  query: ClientPerformanceListQuery = {}
): Promise<GetClientPerformancesResponse> => {
  const response =
    await axiosInstance.get<GetClientPerformancesResponse>(
      "/admin/client-performance/list",
      {
        params: query,
      }
    );

  return response.data;
};

// Get Single Client Performance
const getPerformance = async (
  performanceUuid: string
): Promise<GetClientPerformanceResponse> => {
  const response =
    await axiosInstance.get<GetClientPerformanceResponse>(
      `/admin/client-performance/details/${performanceUuid}`
    );

  return response.data;
};

// Update Client Performance
const updatePerformance = async (
  performanceUuid: string,
  payload: UpdateClientPerformancePayload
): Promise<UpdateClientPerformanceResponse> => {
  const response =
    await axiosInstance.patch<UpdateClientPerformanceResponse>(
      `/admin/client-performance/update/${performanceUuid}`,
      payload
    );

  return response.data;
};

// Soft Delete Client Performance
const deletePerformance = async (
  performanceUuid: string
): Promise<DeleteClientPerformanceResponse> => {
  const response =
    await axiosInstance.delete<DeleteClientPerformanceResponse>(
      `/admin/client-performance/trash/${performanceUuid}`
    );

  return response.data;
};

// Get Trash Client Performances
const getTrashPerformances = async (
  query: ClientPerformanceListQuery = {}
): Promise<GetTrashClientPerformancesResponse> => {
  const response =
    await axiosInstance.get<GetTrashClientPerformancesResponse>(
      "/admin/client-performance/trash",
      {
        params: query,
      }
    );

  return response.data;
};

// Restore Client Performance
const restorePerformance = async (
  performanceUuid: string
): Promise<RestoreClientPerformanceResponse> => {
  const response =
    await axiosInstance.patch<RestoreClientPerformanceResponse>(
      `/admin/client-performance/restore/${performanceUuid}`
    );

  return response.data;
};

// Force Delete Client Performance
const forceDeletePerformance = async (
  performanceUuid: string
): Promise<ForceDeleteClientPerformanceResponse> => {
  const response =
    await axiosInstance.delete<ForceDeleteClientPerformanceResponse>(
      `/admin/client-performance/force-delete/${performanceUuid}`
    );

  return response.data;
};

// Get Client Performance Dashboard
const getDashboardPerformance = async (
  query: ClientPerformanceDashboardQuery = {}
): Promise<GetClientPerformanceDashboardResponse> => {
  const response =
    await axiosInstance.get<GetClientPerformanceDashboardResponse>(
      "/admin/client-performance/dashboard",
      {
        params: query,
      }
    );

  return response.data;
};

// Export
export const clientPerformanceApi = {
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