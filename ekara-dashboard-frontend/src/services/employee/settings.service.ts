"use client";

import {
  getEmployeeProfileApi,
  updateEmployeeProfileApi,
  changeEmployeePasswordApi,
} from "@/src/api/employee/settings.api";

import type {
  EmployeeProfile,
  UpdateEmployeeProfilePayload,
  ChangeEmployeePasswordPayload,
} from "@/src/types/employee/settings.types";

/* =========================================================
   GET EMPLOYEE PROFILE
========================================================= */

export const getEmployeeProfile =
  async (): Promise<EmployeeProfile> => {
    return await getEmployeeProfileApi();
  };

/* =========================================================
   UPDATE EMPLOYEE PROFILE
========================================================= */

export const updateEmployeeProfile = async (
  payload: UpdateEmployeeProfilePayload
): Promise<EmployeeProfile> => {
  return await updateEmployeeProfileApi(payload);
};

/* =========================================================
   CHANGE EMPLOYEE PASSWORD
========================================================= */

export const changeEmployeePassword = async (
  payload: ChangeEmployeePasswordPayload
): Promise<void> => {
  await changeEmployeePasswordApi(payload);
};