/* ========================= Employee Status ========================= */

export type EmployeeStatus = "ACTIVE" | "INACTIVE";

/* ========================= Employment Type ========================= */

export type EmployeeEmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "INTERN"
  | "FREELANCER";

/* ========================= Employee ========================= */

export interface Employee {
  id: number;
  uuid: string;
  user_id: number;

  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;

  employee_code: string;
  department: string | null;
  designation: string | null;
  joining_date: string | null;

  employment_type: EmployeeEmploymentType;
  role: string;

  profile_image: string | null;

  status: EmployeeStatus;

  created_by: number | null;
  updated_by: number | null;

  createdAt: string;
  updatedAt: string;

  user?: EmployeeUser;
}

/* ========================= Employee Login User ========================= */

export interface EmployeeUser {
  id: number;
  uuid: string;
  email: string;
  role: string;
  status: EmployeeStatus;
  last_login: string | null;
}

/* ========================= Create Employee Payload ========================= */

export interface CreateEmployeePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;

  employee_code: string;
  department?: string;
  designation?: string;
  joining_date?: string;

  employment_type: EmployeeEmploymentType;
  role?: string;

  password: string;

  status?: EmployeeStatus;

  profile_image?: File | null;
}

/* ========================= Update Employee Payload ========================= */

export interface UpdateEmployeePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;

  employee_code?: string;
  department?: string;
  designation?: string;
  joining_date?: string;

  employment_type?: EmployeeEmploymentType;
  role?: string;

  password?: string;

  status?: EmployeeStatus;

  profile_image?: File | null;
}

/* ========================= Employee List Query ========================= */

export interface EmployeeListQuery {
  page?: number;
  limit?: number;
  search?: string;

  status?: EmployeeStatus;
  department?: string;
  designation?: string;
  role?: string;
  employment_type?: EmployeeEmploymentType;

  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

/* ========================= Employee List Response Data ========================= */

export interface EmployeeListResponseData {
  count: number;
  rows: Employee[];
  page: number;
  limit: number;
  totalPages: number;
}

/* ========================= Update Employee Status ========================= */

export interface UpdateEmployeeStatusPayload {
  status: EmployeeStatus;
}

/* ========================= Generic API Response ========================= */

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: unknown;
  timestamp: string;
}

/* ========================= API Responses ========================= */

export type CreateEmployeeResponse =
  ApiResponse<Employee>;

export type GetEmployeeResponse =
  ApiResponse<Employee>;

export type GetEmployeesResponse =
  ApiResponse<EmployeeListResponseData>;

export type UpdateEmployeeResponse =
  ApiResponse<Employee>;

export type UpdateEmployeeStatusResponse =
  ApiResponse<Employee>;

export type DeleteEmployeeResponse =
  ApiResponse<null>;

export type RestoreEmployeeResponse =
  ApiResponse<Employee>;

export type ForceDeleteEmployeeResponse =
  ApiResponse<boolean>;

export type GetTrashEmployeesResponse =
  ApiResponse<EmployeeListResponseData>;