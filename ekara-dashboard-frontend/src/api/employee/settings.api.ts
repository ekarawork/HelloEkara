"use client";

import axiosInstance from "@/src/lib/axios";

import type {
  EmployeeProfile,
  UpdateEmployeeProfilePayload,
  ChangeEmployeePasswordPayload,
} from "@/src/types/employee/settings.types";

/* =========================================================
   GET EMPLOYEE PROFILE
========================================================= */

export const getEmployeeProfileApi =
  async (): Promise<EmployeeProfile> => {
    const response = await axiosInstance.get<{
      data: EmployeeProfile;
    }>("/employee/settings/profile");

    return response.data.data;
  };

/* =========================================================
   UPDATE EMPLOYEE PROFILE
========================================================= */

export const updateEmployeeProfileApi = async (
  payload: UpdateEmployeeProfilePayload
): Promise<EmployeeProfile> => {
  const response = await axiosInstance.put<{
    data: EmployeeProfile;
  }>("/employee/settings/profile", payload);

  return response.data.data;
};

/* =========================================================
   CHANGE EMPLOYEE PASSWORD
========================================================= */

export const changeEmployeePasswordApi = async (
  payload: ChangeEmployeePasswordPayload
): Promise<void> => {
  await axiosInstance.put(
    "/employee/settings/change-password",
    payload
  );
};