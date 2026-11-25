"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  RotateCcw,
  Trash2,
} from "lucide-react";

import ProtectedRoute from "@/src/components/admin/auth/ProtectedRoute";
import AdminNavbar from "@/src/components/admin/AdminNavbar";

import EmployeeSearch from "@/src/components/admin/employee/EmployeeSearch";
import EmployeeTable from "@/src/components/admin/employee/EmployeeTable";
import EmployeeForm, {
  EmployeeFormData,
} from "@/src/components/admin/employee/EmployeeForm";
import EmployeeModal from "@/src/components/admin/employee/EmployeeModal";
import EmployeeSkeleton from "@/src/components/admin/employee/EmployeeSkeleton";
import EmployeeDetails from "@/src/components/admin/employee/EmployeeDetails";
import EmployeePagination from "@/src/components/admin/employee/EmployeePagination";

import useEmployee from "@/src/hooks/admin/useEmployee";

import {
  Employee,
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from "@/src/types/admin/employee.types";

/* ========================= Page ========================= */

export default function AdminEmployeePage() {
  /* ========================= Employee Form ========================= */

  const [
    isEmployeeFormOpen,
    setIsEmployeeFormOpen,
  ] = useState(false);

  const [
    isEditMode,
    setIsEditMode,
  ] = useState(false);

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] = useState<Employee | null>(null);

  /* ========================= Employee List ========================= */

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const [
    employees,
    setEmployees,
  ] = useState<Employee[]>([]);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [pageSize] =
    useState(10);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    totalCount,
    setTotalCount,
  ] = useState(0);

  const [
    hasLoadedEmployees,
    setHasLoadedEmployees,
  ] = useState(false);

  /* ========================= Employee Details ========================= */

  const [
    viewEmployee,
    setViewEmployee,
  ] = useState<Employee | null>(
    null
  );

  const [
    isEmployeeDetailsOpen,
    setIsEmployeeDetailsOpen,
  ] = useState(false);

  /* ========================= Trash ========================= */

  const [
    trashEmployees,
    setTrashEmployees,
  ] = useState<Employee[]>([]);

  const [
    isTrashOpen,
    setIsTrashOpen,
  ] = useState(false);

  const [
    isTrashLoading,
    setIsTrashLoading,
  ] = useState(false);

  /* ========================= Trash Pagination ========================= */

  const [
    trashCurrentPage,
    setTrashCurrentPage,
  ] = useState(1);

  const [trashPageSize] =
    useState(10);

  const [
    trashTotalPages,
    setTrashTotalPages,
  ] = useState(1);

  const [
    trashTotalCount,
    setTrashTotalCount,
  ] = useState(0);

  /* ========================= Employee Hook ========================= */

  const {
    createEmployee,
    getEmployees,
    getEmployee,
    updateEmployee,
    updateEmployeeStatus,
    deleteEmployee,
    getTrashEmployees,
    restoreEmployee,
    forceDeleteEmployee,
    isLoading,
    error,
    clearError,
  } = useEmployee();

  /* ========================= Load Employees ========================= */

  const loadEmployees =
    useCallback(async () => {
      const data =
        await getEmployees({
          page: currentPage,
          limit: pageSize,
          search:
            search.trim() ||
            undefined,
          status:
            filter !== "All"
              ? filter ===
                "Active"
                ? "ACTIVE"
                : "INACTIVE"
              : undefined,
        });

      if (data) {
        setEmployees(
          data.rows
        );

        setTotalPages(
          data.totalPages
        );

        setTotalCount(
          data.count
        );
      }

      setHasLoadedEmployees(
        true
      );
    }, [
      getEmployees,
      currentPage,
      pageSize,
      search,
      filter,
    ]);

  /* ========================= Initial Load ========================= */

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  /* ========================= Add Employee ========================= */

  const handleAddEmployee =
    useCallback(() => {
      clearError();

      setSelectedEmployee(
        null
      );

      setIsEditMode(false);

      setIsEmployeeFormOpen(
        true
      );
    }, [clearError]);

  /* ========================= Load Trash Employees ========================= */

  const loadTrashEmployees =
    useCallback(
      async (
        page = trashCurrentPage
      ) => {
        setIsTrashLoading(
          true
        );

        try {
          const data =
            await getTrashEmployees(
              {
                page,
                limit:
                  trashPageSize,
              }
            );

          if (data) {
            setTrashEmployees(
              data.rows
            );

            setTrashTotalPages(
              data.totalPages
            );

            setTrashTotalCount(
              data.count
            );
          }
        } finally {
          setIsTrashLoading(
            false
          );
        }
      },
      [
        getTrashEmployees,
        trashCurrentPage,
        trashPageSize,
      ]
    );

  /* ========================= View Trash ========================= */

  const handleViewTrash =
    useCallback(() => {
      setTrashCurrentPage(1);
      setIsTrashOpen(true);
    }, []);

  /* ========================= Trash Load Effect ========================= */

  useEffect(() => {
    if (!isTrashOpen) {
      return;
    }

    loadTrashEmployees();
  }, [
    isTrashOpen,
    trashCurrentPage,
    loadTrashEmployees,
  ]);

  /* ========================= Restore Employee ========================= */

  const handleRestoreEmployee =
    useCallback(
      async (
        employee: Employee
      ) => {
        if (!employee.uuid) {
          return;
        }

        const restoredEmployee =
          await restoreEmployee(
            employee.uuid
          );

        if (!restoredEmployee) {
          return;
        }

        /* Refresh normal employee list */

        await loadEmployees();

        /* If last item was removed from current trash page */

        if (
          trashEmployees.length ===
            1 &&
          trashCurrentPage > 1
        ) {
          setTrashCurrentPage(
            (prev) => prev - 1
          );

          return;
        }

        /* Refresh current trash page */

        await loadTrashEmployees();
      },
      [
        restoreEmployee,
        loadEmployees,
        trashEmployees.length,
        trashCurrentPage,
        loadTrashEmployees,
      ]
    );

  /* ========================= Force Delete Employee ========================= */

  const handleForceDeleteEmployee =
    useCallback(
      async (
        employee: Employee
      ) => {
        if (!employee.uuid) {
          return;
        }

        const deleted =
          await forceDeleteEmployee(
            employee.uuid
          );

        if (!deleted) {
          return;
        }

        /* If last item was removed from current trash page */

        if (
          trashEmployees.length ===
            1 &&
          trashCurrentPage > 1
        ) {
          setTrashCurrentPage(
            (prev) => prev - 1
          );

          return;
        }

        /* Refresh current trash page */

        await loadTrashEmployees();
      },
      [
        forceDeleteEmployee,
        trashEmployees.length,
        trashCurrentPage,
        loadTrashEmployees,
      ]
    );

  /* ========================= Edit Employee ========================= */

  const handleEditEmployee =
    useCallback(
      async (
        employee: Employee
      ) => {
        clearError();

        const uuid =
          employee.uuid;

        if (!uuid) {
          return;
        }

        /* Get latest employee details */

        const latestEmployee =
          await getEmployee(
            uuid
          );

        if (!latestEmployee) {
          return;
        }

        setSelectedEmployee(
          latestEmployee
        );

        setIsEditMode(true);

        setIsEmployeeFormOpen(
          true
        );
      },
      [
        clearError,
        getEmployee,
      ]
    );

  /* ========================= View Employee ========================= */

  const handleViewEmployee =
    useCallback(
      async (
        employee: Employee
      ) => {
        clearError();

        if (!employee.uuid) {
          return;
        }

        const latestEmployee =
          await getEmployee(
            employee.uuid
          );

        if (!latestEmployee) {
          return;
        }

        setViewEmployee(
          latestEmployee
        );

        setIsEmployeeDetailsOpen(
          true
        );
      },
      [
        clearError,
        getEmployee,
      ]
    );

  /* ========================= Close Employee Details ========================= */

  const handleCloseEmployeeDetails =
    useCallback(() => {
      setIsEmployeeDetailsOpen(
        false
      );

      setViewEmployee(null);
    }, []);

  /* ========================= Toggle Employee Status ========================= */

  const handleToggleEmployeeStatus =
    useCallback(
      async (
        employee: Employee
      ) => {
        if (!employee.uuid) {
          return;
        }

        const nextStatus =
          employee.status ===
          "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE";

        const updatedEmployee =
          await updateEmployeeStatus(
            employee.uuid,
            {
              status:
                nextStatus,
            }
          );

        if (!updatedEmployee) {
          return;
        }

        /* Refresh employee list */

        await loadEmployees();
      },
      [
        updateEmployeeStatus,
        loadEmployees,
      ]
    );

  /* ========================= Delete Employee ========================= */

  const handleDeleteEmployee =
    useCallback(
      async (
        employee: Employee
      ) => {
        if (!employee.uuid) {
          return;
        }

        const deleted =
          await deleteEmployee(
            employee.uuid
          );

        if (!deleted) {
          return;
        }

        /* Refresh employee list */

        await loadEmployees();
      },
      [
        deleteEmployee,
        loadEmployees,
      ]
    );

  /* ========================= Close Employee Modal ========================= */

  const handleCloseEmployeeModal =
    useCallback(() => {
      clearError();

      setIsEmployeeFormOpen(
        false
      );

      setSelectedEmployee(
        null
      );

      setIsEditMode(false);
    }, [clearError]);

  /* ========================= Create Employee ========================= */

  const handleCreateEmployee =
    async (
      data: EmployeeFormData
    ) => {
      const payload: CreateEmployeePayload =
        {
          first_name:
            data.first_name.trim(),

          last_name:
            data.last_name.trim(),

          email:
            data.email.trim(),

          phone:
            data.phone.trim() ||
            undefined,

          employee_code:
            data.employee_code.trim(),

          department:
            data.department.trim() ||
            undefined,

          designation:
            data.designation.trim() ||
            undefined,

          joining_date:
            data.joining_date ||
            undefined,

          employment_type:
            data.employment_type,

          role:
            data.role.trim() ||
            "EMPLOYEE",

          password:
            data.password,

          status:
            data.status,

          profile_image:
            data.profile_image ||
            null,
        };

      const createdEmployee =
        await createEmployee(
          payload
        );

      if (!createdEmployee) {
        return;
      }

      setIsEmployeeFormOpen(
        false
      );

      setSelectedEmployee(
        null
      );

      setIsEditMode(false);

      await loadEmployees();
    };

  /* ========================= Update Employee ========================= */

  const handleUpdateEmployee =
    async (
      data: EmployeeFormData
    ) => {
      if (
        !selectedEmployee?.uuid
      ) {
        return;
      }

      const payload: UpdateEmployeePayload =
        {
          first_name:
            data.first_name.trim(),

          last_name:
            data.last_name.trim(),

          email:
            data.email.trim(),

          phone:
            data.phone.trim(),

          employee_code:
            data.employee_code.trim(),

          department:
            data.department.trim(),

          designation:
            data.designation.trim(),

          joining_date:
            data.joining_date ||
            undefined,

          employment_type:
            data.employment_type,

          role:
            data.role.trim() ||
            "EMPLOYEE",

          status:
            data.status,

          profile_image:
            data.profile_image ||
            null,
        };

      /* Only send password if user entered a new one */

      if (
        data.password.trim()
      ) {
        payload.password =
          data.password.trim();
      }

      const updatedEmployee =
        await updateEmployee(
          selectedEmployee.uuid,
          payload
        );

      if (!updatedEmployee) {
        return;
      }

      /* Close edit modal */

      setIsEmployeeFormOpen(
        false
      );

      setSelectedEmployee(
        null
      );

      setIsEditMode(false);

      /* Reload employee list */

      await loadEmployees();
    };

  /* ========================= Form Submit ========================= */

  const handleEmployeeSubmit =
    async (
      data: EmployeeFormData
    ) => {
      if (isEditMode) {
        await handleUpdateEmployee(
          data
        );

        return;
      }

      await handleCreateEmployee(
        data
      );
    };

  /* ========================= Convert Employee -> Form Data ========================= */

const getEditInitialData =
  useCallback(
    (
      employee: Employee
    ): Partial<EmployeeFormData> & {
      profile_image_url?: string | null;
    } => {
        return {
          first_name:
            employee.first_name ||
            "",

          last_name:
            employee.last_name ||
            "",

          email:
            employee.email || "",

          phone:
            employee.phone || "",

          employee_code:
            employee.employee_code ||
            "",

          department:
            employee.department ||
            "",

          designation:
            employee.designation ||
            "",

          joining_date:
            employee.joining_date ||
            "",

          employment_type:
            employee.employment_type,

          role:
            employee.role ||
            "EMPLOYEE",

          /* Password intentionally empty during edit */

          password: "",

          status:
            employee.status,

          profile_image: null,

          profile_image_url:
            employee.profile_image ||
            null,
        };
      },
      []
    );

  /* ========================= Search ========================= */

  const handleSearch =
    useCallback(
      (value: string) => {
        setSearch(value);
        setCurrentPage(1);
      },
      []
    );

  /* ========================= Filter ========================= */

  const handleFilterChange =
    useCallback(
      (value: string) => {
        setFilter(value);
        setCurrentPage(1);
      },
      []
    );

  /* ========================= Render ========================= */

  return (
    <ProtectedRoute
      allowedRoles={[
        "SUPER_ADMIN",
        "ADMIN",
      ]}
    >
      <div className="min-h-screen bg-slate-50">

        {/* ========================= Navbar ========================= */}

        <AdminNavbar />

        {/* ========================= Main ========================= */}

        <main className="w-full">
          <div className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-5 lg:px-6 xl:px-8">

            {!hasLoadedEmployees ? (
              <EmployeeSkeleton />
            ) : (
              <>
                {/* ========================= Search ========================= */}

                <EmployeeSearch
                  search={search}
                  filter={filter}
                  onAddEmployee={
                    handleAddEmployee
                  }
                  onClearEmployees={
                    handleViewTrash
                  }
                  onSearch={
                    handleSearch
                  }
                  onFilterChange={
                    handleFilterChange
                  }
                />

                {/* ========================= Employee Table ========================= */}

                <EmployeeTable
                  employees={
                    employees
                  }
                  onView={
                    handleViewEmployee
                  }
                  onEdit={
                    handleEditEmployee
                  }
                  onDisable={
                    handleToggleEmployeeStatus
                  }
                  onDelete={
                    handleDeleteEmployee
                  }
                />

                {/* ========================= Employee Pagination ========================= */}

                <EmployeePagination
                  currentPage={
                    currentPage
                  }
                  totalPages={
                    totalPages
                  }
                  onPageChange={
                    setCurrentPage
                  }
                />
              </>
            )}
          </div>
        </main>

        {/* ================================================================ */}
        {/* EMPLOYEE FORM MODAL */}
        {/* ================================================================ */}

        <EmployeeModal
          isOpen={
            isEmployeeFormOpen
          }
          onClose={
            handleCloseEmployeeModal
          }
          title={
            isEditMode
              ? "Edit Employee"
              : "Add New Employee"
          }
          description={
            isEditMode
              ? "Update the employee profile, employment information and login account."
              : "Create the employee profile, employment information and login account."
          }
        >
          <EmployeeForm
            key={
              selectedEmployee?.uuid ||
              "new-employee"
            }
            mode={
              isEditMode
                ? "edit"
                : "add"
            }
            initialData={
              selectedEmployee
                ? getEditInitialData(
                    selectedEmployee
                  )
                : undefined
            }
            onClose={
              handleCloseEmployeeModal
            }
            onSubmit={
              handleEmployeeSubmit
            }
            isLoading={
              isLoading
            }
            error={error}
          />
        </EmployeeModal>

        {/* ================================================================ */}
        {/* EMPLOYEE DETAILS MODAL */}
        {/* ================================================================ */}

        <EmployeeModal
          isOpen={
            isEmployeeDetailsOpen
          }
          onClose={
            handleCloseEmployeeDetails
          }
          title="Employee Details"
          description={
            viewEmployee
              ? `Complete profile details for ${
                  viewEmployee.first_name
                } ${
                  viewEmployee.last_name
                }`
              : "Employee details"
          }
        >
          {viewEmployee && (
            <EmployeeDetails
              employee={
                viewEmployee
              }
            />
          )}
        </EmployeeModal>

        {/* ================================================================ */}
        {/* SOFT DELETED EMPLOYEES MODAL */}
        {/* ================================================================ */}

        <EmployeeModal
          isOpen={isTrashOpen}
          onClose={() =>
            setIsTrashOpen(false)
          }
          title="Deleted Employees"
          description="Employees that have been moved to trash."
        >
          {/* ========================= Loading ========================= */}

          {isTrashLoading ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500">
                Loading deleted employees...
              </p>
            </div>
          ) : trashEmployees.length ===
            0 ? (
            /* ========================= Empty ========================= */

            <div className="py-10 text-center">
              <p className="text-sm font-medium text-slate-600">
                Trash is empty
              </p>

              <p className="mt-1 text-xs text-slate-400">
                No soft-deleted employees found.
              </p>
            </div>
          ) : (
            /* ========================= Trash Employees ========================= */

            <div className="space-y-2">
              {trashEmployees.map(
                (employee) => {
                  const employeeName =
                    `${employee.first_name || ""} ${
                      employee.last_name || ""
                    }`.trim() ||
                    "Unnamed Employee";

                  const initials =
                    `${employee.first_name?.[0] || ""}${
                      employee.last_name?.[0] || ""
                    }`.toUpperCase();

                  return (
                    <div
                      key={
                        employee.uuid
                      }
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-3"
                    >

                      {/* ========================= Employee ========================= */}

                      <div className="flex min-w-0 items-center gap-3">

                        {/* Avatar */}

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600">
                          {employee.profile_image ? (
                            <img
                              src={
                                employee.profile_image
                              }
                              alt={
                                employeeName
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initials ||
                            "EM"
                          )}
                        </div>

                        {/* Information */}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {
                              employeeName
                            }
                          </p>

                          <p className="truncate text-xs text-slate-400">
                            {
                              employee.email
                            }
                          </p>

                          <p className="mt-0.5 truncate text-[11px] text-slate-400">
                            {
                              employee.employee_code
                            }
                          </p>
                        </div>
                      </div>

                      {/* ========================= Actions ========================= */}

                      <div className="flex shrink-0 items-center gap-1.5">

                        {/* Restore */}

                        <button
                          type="button"
                          onClick={() =>
                            handleRestoreEmployee(
                              employee
                            )
                          }
                          title="Restore employee"
                          aria-label={`Restore ${employeeName}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#B9BAFF] hover:bg-[#F8F8FF] hover:text-[#2E3192]"
                        >
                          <RotateCcw
                            size={15}
                            strokeWidth={
                              1.8
                            }
                          />
                        </button>

                        {/* Permanent Delete */}

                        <button
                          type="button"
                          onClick={() =>
                            handleForceDeleteEmployee(
                              employee
                            )
                          }
                          title="Permanently delete"
                          aria-label={`Permanently delete ${employeeName}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2
                            size={15}
                            strokeWidth={
                              1.8
                            }
                          />
                        </button>

                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* ========================= Trash Pagination ========================= */}

          <EmployeePagination
            currentPage={
              trashCurrentPage
            }
            totalPages={
              trashTotalPages
            }
            onPageChange={
              setTrashCurrentPage
            }
          />
        </EmployeeModal>
      </div>
    </ProtectedRoute>
  );
}