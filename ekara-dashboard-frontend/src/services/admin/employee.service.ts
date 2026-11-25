import { employeeApi } from "@/src/api/admin/employee.api";

import {
  CreateEmployeePayload,
  Employee,
  EmployeeListQuery,
  EmployeeListResponseData,
  UpdateEmployeePayload,
  UpdateEmployeeStatusPayload,
} from "@/src/types/admin/employee.types";

/* ========================= Create Employee ========================= */

const createEmployee = async (
  payload: CreateEmployeePayload
): Promise<Employee> => {
  const response =
    await employeeApi.createEmployee(payload);

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Employee creation failed."
    );
  }

  return response.data;
};

/* ========================= Get Employees ========================= */

const getEmployees = async (
  query?: EmployeeListQuery
): Promise<EmployeeListResponseData> => {
  const response =
    await employeeApi.getEmployees(query);

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch employees."
    );
  }

  return response.data;
};

/* ========================= Get Employee Details ========================= */

const getEmployee = async (
  uuid: string
): Promise<Employee> => {
  const response =
    await employeeApi.getEmployee(uuid);

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch employee details."
    );
  }

  return response.data;
};

/* ========================= Update Employee ========================= */

const updateEmployee = async (
  uuid: string,
  payload: UpdateEmployeePayload
): Promise<Employee> => {
  const response =
    await employeeApi.updateEmployee(
      uuid,
      payload
    );

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Employee update failed."
    );
  }

  return response.data;
};

/* ========================= Update Employee Status ========================= */

const updateEmployeeStatus = async (
  uuid: string,
  payload: UpdateEmployeeStatusPayload
): Promise<Employee> => {
  const response =
    await employeeApi.updateEmployeeStatus(
      uuid,
      payload
    );

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Employee status update failed."
    );
  }

  return response.data;
};

/* ========================= Soft Delete Employee ========================= */

const deleteEmployee = async (
  uuid: string
): Promise<boolean> => {
  const response =
    await employeeApi.deleteEmployee(uuid);

  if (!response.success) {
    throw new Error(
      response.message ||
        "Employee deletion failed."
    );
  }

  return true;
};

/* ========================= Restore Employee ========================= */

const restoreEmployee = async (
  uuid: string
): Promise<Employee> => {
  const response =
    await employeeApi.restoreEmployee(uuid);

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Employee restore failed."
    );
  }

  return response.data;
};

/* ========================= Force Delete Employee ========================= */

const forceDeleteEmployee = async (
  uuid: string
): Promise<boolean> => {
  const response =
    await employeeApi.forceDeleteEmployee(uuid);

  if (!response.success) {
    throw new Error(
      response.message ||
        "Employee permanent deletion failed."
    );
  }

  return true;
};

/* ========================= Get Trash Employees ========================= */

const getTrashEmployees = async (
  query?: EmployeeListQuery
): Promise<EmployeeListResponseData> => {
  const response =
    await employeeApi.getTrashEmployees(query);

  if (!response.success || !response.data) {
    throw new Error(
      response.message ||
        "Failed to fetch deleted employees."
    );
  }

  return response.data;
};

/* ========================= Export ========================= */

export const employeeService = {
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