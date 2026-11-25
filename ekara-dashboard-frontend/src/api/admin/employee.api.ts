import axiosInstance from "@/src/lib/axios";

import {
  CreateEmployeePayload,
  CreateEmployeeResponse,
  GetEmployeeResponse,
  GetEmployeesResponse,
  GetTrashEmployeesResponse,
  UpdateEmployeePayload,
  UpdateEmployeeResponse,
  UpdateEmployeeStatusPayload,
  UpdateEmployeeStatusResponse,
  DeleteEmployeeResponse,
  RestoreEmployeeResponse,
  ForceDeleteEmployeeResponse,
  EmployeeListQuery,
} from "@/src/types/admin/employee.types";

/* ========================= Create Employee FormData ========================= */

const createEmployeeFormData = (
  payload: CreateEmployeePayload
): FormData => {
  const formData = new FormData();

  // Basic Employee Fields
  formData.append("first_name", payload.first_name);
  formData.append("last_name", payload.last_name);
  formData.append("email", payload.email);

  // Phone
  formData.append("phone", payload.phone ?? "");

  // Employment Information
  formData.append(
    "employee_code",
    payload.employee_code
  );

  formData.append(
    "department",
    payload.department ?? ""
  );

  formData.append(
    "designation",
    payload.designation ?? ""
  );

  formData.append(
    "joining_date",
    payload.joining_date ?? ""
  );

  formData.append(
    "employment_type",
    payload.employment_type
  );

  // Employee Role
  formData.append(
    "role",
    payload.role ?? "EMPLOYEE"
  );

  // Login Password
  formData.append(
    "password",
    payload.password
  );

  // Status
  formData.append(
    "status",
    payload.status ?? "ACTIVE"
  );

  // Profile Image
  if (payload.profile_image) {
    formData.append(
      "profile_image",
      payload.profile_image
    );
  }

  return formData;
};

/* ========================= Update Employee FormData ========================= */

const updateEmployeeFormData = (
  payload: UpdateEmployeePayload
): FormData => {
  const formData = new FormData();

  // Basic Employee Fields
  if (payload.first_name !== undefined) {
    formData.append(
      "first_name",
      payload.first_name
    );
  }

  if (payload.last_name !== undefined) {
    formData.append(
      "last_name",
      payload.last_name
    );
  }

  if (payload.email !== undefined) {
    formData.append(
      "email",
      payload.email
    );
  }

  // Phone
  if (payload.phone !== undefined) {
    formData.append(
      "phone",
      payload.phone
    );
  }

  // Employment Information
  if (payload.employee_code !== undefined) {
    formData.append(
      "employee_code",
      payload.employee_code
    );
  }

  if (payload.department !== undefined) {
    formData.append(
      "department",
      payload.department
    );
  }

  if (payload.designation !== undefined) {
    formData.append(
      "designation",
      payload.designation
    );
  }

  if (payload.joining_date !== undefined) {
    formData.append(
      "joining_date",
      payload.joining_date
    );
  }

  if (payload.employment_type !== undefined) {
    formData.append(
      "employment_type",
      payload.employment_type
    );
  }

  // Employee Role
  if (payload.role !== undefined) {
    formData.append(
      "role",
      payload.role
    );
  }

  // Password
  if (
    payload.password !== undefined &&
    payload.password !== ""
  ) {
    formData.append(
      "password",
      payload.password
    );
  }

  // Status
  if (payload.status !== undefined) {
    formData.append(
      "status",
      payload.status
    );
  }

  // Profile Image
  if (payload.profile_image) {
    formData.append(
      "profile_image",
      payload.profile_image
    );
  }

  return formData;
};

/* ========================= Create Employee ========================= */

const createEmployee = async (
  payload: CreateEmployeePayload
): Promise<CreateEmployeeResponse> => {
  const formData =
    createEmployeeFormData(payload);

  try {
    const response =
      await axiosInstance.post<CreateEmployeeResponse>(
        "/admin/employee/create",
        formData
      );

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/* ========================= Get Employees ========================= */

const getEmployees = async (
  query: EmployeeListQuery = {}
): Promise<GetEmployeesResponse> => {
  const response =
    await axiosInstance.get<GetEmployeesResponse>(
      "/admin/employee/list",
      {
        params: query,
      }
    );

  return response.data;
};

/* ========================= Get Employee Details ========================= */

const getEmployee = async (
  uuid: string
): Promise<GetEmployeeResponse> => {
  const response =
    await axiosInstance.get<GetEmployeeResponse>(
      `/admin/employee/list/${uuid}`
    );

  return response.data;
};

/* ========================= Update Employee ========================= */

const updateEmployee = async (
  uuid: string,
  payload: UpdateEmployeePayload
): Promise<UpdateEmployeeResponse> => {
  const formData =
    updateEmployeeFormData(payload);

  const response =
    await axiosInstance.patch<UpdateEmployeeResponse>(
      `/admin/employee/update/${uuid}`,
      formData
    );

  return response.data;
};

/* ========================= Update Employee Status ========================= */

const updateEmployeeStatus = async (
  uuid: string,
  payload: UpdateEmployeeStatusPayload
): Promise<UpdateEmployeeStatusResponse> => {
  const response =
    await axiosInstance.patch<UpdateEmployeeStatusResponse>(
      `/admin/employee/status/${uuid}`,
      payload
    );

  return response.data;
};

/* ========================= Soft Delete Employee ========================= */

const deleteEmployee = async (
  uuid: string
): Promise<DeleteEmployeeResponse> => {
  const response =
    await axiosInstance.delete<DeleteEmployeeResponse>(
      `/admin/employee/trash/${uuid}`
    );

  return response.data;
};

/* ========================= Restore Employee ========================= */

const restoreEmployee = async (
  uuid: string
): Promise<RestoreEmployeeResponse> => {
  const response =
    await axiosInstance.patch<RestoreEmployeeResponse>(
      `/admin/employee/restore/${uuid}`
    );

  return response.data;
};

/* ========================= Force Delete Employee ========================= */

const forceDeleteEmployee = async (
  uuid: string
): Promise<ForceDeleteEmployeeResponse> => {
  const response =
    await axiosInstance.delete<ForceDeleteEmployeeResponse>(
      `/admin/employee/force-delete/${uuid}`
    );

  return response.data;
};

/* ========================= Get Trash Employees ========================= */

const getTrashEmployees = async (
  query: EmployeeListQuery = {}
): Promise<GetTrashEmployeesResponse> => {
  const response =
    await axiosInstance.get<GetTrashEmployeesResponse>(
      "/admin/employee/trash",
      {
        params: query,
      }
    );

  return response.data;
};

/* ========================= Export ========================= */

export const employeeApi = {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
  restoreEmployee,
  forceDeleteEmployee,
  getTrashEmployees,
};