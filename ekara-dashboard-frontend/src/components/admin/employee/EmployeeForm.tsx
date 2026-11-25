"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

import {
  CreateEmployeePayload,
  EmployeeEmploymentType,
  EmployeeStatus,
  UpdateEmployeePayload,
} from "@/src/types/admin/employee.types";

/* ========================= Types ========================= */

export type EmployeeFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  employee_code: string;
  department: string;
  designation: string;
  joining_date: string;
  employment_type: EmployeeEmploymentType;
  role: string;
  password: string;
  status: EmployeeStatus;
  profile_image: File | null;
};

/* ========================= Props ========================= */

interface EmployeeFormProps {
  mode?: "add" | "edit";

  initialData?: Partial<EmployeeFormData> & {
    profile_image_url?: string | null;
  };

  onClose?: () => void;

  onSubmit?: (
    data: EmployeeFormData
  ) => void;

  isLoading?: boolean;

  error?: string | null;
}

/* ========================= Constants ========================= */

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/* ========================= Employment Options ========================= */

const employmentTypeOptions: {
  id: EmployeeEmploymentType;
  label: string;
}[] = [
  {
    id: "FULL_TIME",
    label: "Full Time",
  },
  {
    id: "PART_TIME",
    label: "Part Time",
  },
  {
    id: "INTERN",
    label: "Intern",
  },
  {
    id: "FREELANCER",
    label: "Freelancer",
  },
];

/* ========================= Component ========================= */

export default function EmployeeForm({
  mode = "add",
  initialData,
  onClose,
  onSubmit,
  isLoading = false,
  error = null,
}: EmployeeFormProps) {
  const isEditMode = mode === "edit";

  /* ========================= Form State ========================= */

  const [formData, setFormData] =
    useState<EmployeeFormData>({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      employee_code: "",
      department: "",
      designation: "",
      joining_date: "",
      employment_type: "FULL_TIME",
      role: "EMPLOYEE",
      password: "",
      status: "ACTIVE",
      profile_image: null,
    });

  const [profilePreview, setProfilePreview] =
    useState<string | null>(null);

  const [validationError, setValidationError] =
    useState<string | null>(null);

  /* ========================= Initial Data ========================= */

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      ...initialData,
      profile_image:
        initialData.profile_image ?? null,
    }));

    if (
      initialData.profile_image_url
    ) {
      setProfilePreview(
        initialData.profile_image_url
      );
    }
  }, [initialData]);

  /* ========================= Cleanup Preview ========================= */

  useEffect(() => {
    return () => {
      if (
        profilePreview &&
        profilePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  /* ========================= Input Change ========================= */

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationError(null);
  };

  /* ========================= Select Change ========================= */

  const handleEmploymentTypeChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData((previous) => ({
      ...previous,
      employment_type:
        event.target
          .value as EmployeeEmploymentType,
    }));

    setValidationError(null);
  };

  /* ========================= Status Change ========================= */

  const handleStatusChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData((previous) => ({
      ...previous,
      status:
        event.target
          .value as EmployeeStatus,
    }));

    setValidationError(null);
  };

  /* ========================= Profile Image ========================= */

  const handleProfileImage = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    /* File type validation */

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      setValidationError(
        "Only JPG, PNG and WEBP images are allowed."
      );

      event.target.value = "";
      return;
    }

    /* File size validation */

    if (
      file.size > MAX_IMAGE_SIZE
    ) {
      setValidationError(
        "Profile image must not exceed 10 MB."
      );

      event.target.value = "";
      return;
    }

    setValidationError(null);

    setFormData((previous) => ({
      ...previous,
      profile_image: file,
    }));

    if (
      profilePreview &&
      profilePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        profilePreview
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setProfilePreview(
      previewUrl
    );
  };

  /* ========================= Submit ========================= */

  /* ========================= Submit ========================= */

const handleSubmit = (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  setValidationError(null);

  const firstName =
    formData.first_name.trim();

  const lastName =
    formData.last_name.trim();

  const email =
    formData.email.trim();

  const phone =
    formData.phone.trim();

  const employeeCode =
    formData.employee_code.trim();

  const department =
    formData.department.trim();

  const designation =
    formData.designation.trim();

  const role =
    formData.role.trim();

  /* ========================= Required validation ========================= */

  if (!firstName) {
    setValidationError(
      "First name is required."
    );
    return;
  }

  if (!lastName) {
    setValidationError(
      "Last name is required."
    );
    return;
  }

  if (!email) {
    setValidationError(
      "Employee email is required."
    );
    return;
  }

  if (!employeeCode) {
    setValidationError(
      "Employee code is required."
    );
    return;
  }

  if (!role) {
    setValidationError(
      "Employee role is required."
    );
    return;
  }

  /* ========================= Password validation ========================= */

  if (
    !isEditMode &&
    !formData.password
  ) {
    setValidationError(
      "Password is required."
    );
    return;
  }

  if (
    formData.password &&
    formData.password.length < 8
  ) {
    setValidationError(
      "Password must be at least 8 characters."
    );
    return;
  }

  /* ========================= Submit ========================= */

  onSubmit?.({
    ...formData,

    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    employee_code: employeeCode,
    department,
    designation,
    role,
  });
};

  /* ========================= Render ========================= */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 px-3 py-4 backdrop-blur-[2px] sm:px-5">
      <div className="flex max-h-[calc(100vh-32px)] w-full max-w-[700px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.22)]">

        {/* ========================= Header ========================= */}

        <div className="shrink-0 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">

            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                {isEditMode
                  ? "Edit Employee"
                  : "Add New Employee"}
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400 sm:text-[11px]">
                {isEditMode
                  ? "Update the employee profile, employment information and account access."
                  : "Create the employee profile, employment information and login account."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              disabled={isLoading}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X
                size={16}
                strokeWidth={1.8}
              />
            </button>

          </div>
        </div>

        {/* ========================= Error ========================= */}

        {(validationError ||
          error) && (
          <div className="shrink-0 border-b border-red-100 bg-red-50 px-5 py-2.5 text-[10px] text-red-600 sm:px-6">
            {validationError ||
              error}
          </div>
        )}

        {/* ========================= Form ========================= */}

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-3.5 px-5 py-4 sm:px-6">

            {/* ========================= First Name + Last Name ========================= */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="First name"
                name="first_name"
                placeholder="John"
                value={
                  formData.first_name
                }
                onChange={
                  handleChange
                }
              />

              <FormField
                label="Last name"
                name="last_name"
                placeholder="Doe"
                value={
                  formData.last_name
                }
                onChange={
                  handleChange
                }
              />
            </div>

            {/* ========================= Email + Phone ========================= */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Employee email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
              />

              <FormField
                label="Phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
              />
            </div>

            {/* ========================= Employee Code + Department ========================= */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Employee code"
                name="employee_code"
                placeholder="EMP-001"
                value={
                  formData.employee_code
                }
                onChange={
                  handleChange
                }
              />

              <FormField
                label="Department"
                name="department"
                placeholder="Design"
                value={
                  formData.department
                }
                onChange={
                  handleChange
                }
              />
            </div>

            {/* ========================= Designation + Joining Date ========================= */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Designation"
                name="designation"
                placeholder="Graphic Designer"
                value={
                  formData.designation
                }
                onChange={
                  handleChange
                }
              />

              <FormField
                label="Joining date"
                name="joining_date"
                type="date"
                value={
                  formData.joining_date
                }
                onChange={
                  handleChange
                }
              />
            </div>

            {/* ========================= Employment Type + Role ========================= */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* Employment Type */}

              <div className="min-w-0">
                <FormLabel>
                  Employment type
                </FormLabel>

                <select
                  name="employment_type"
                  value={
                    formData.employment_type
                  }
                  onChange={
                    handleEmploymentTypeChange
                  }
                  disabled={
                    isLoading
                  }
                  className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] text-slate-700 outline-none transition-all focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  {employmentTypeOptions.map(
                    (option) => (
                      <option
                        key={
                          option.id
                        }
                        value={
                          option.id
                        }
                      >
                        {
                          option.label
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Role */}

              <FormField
                label="Employee role"
                name="role"
                placeholder="EMPLOYEE"
                value={
                  formData.role
                }
                onChange={
                  handleChange
                }
              />

            </div>

            {/* ========================= Password + Status ========================= */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <FormField
                label={
                  isEditMode
                    ? "New password (optional)"
                    : "Temporary password"
                }
                name="password"
                type="password"
                placeholder="••••••••••"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                autoComplete="new-password"
              />

              {/* Status */}

              <div className="min-w-0">
                <FormLabel>
                  Account status
                </FormLabel>

                <select
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleStatusChange
                  }
                  disabled={
                    isLoading
                  }
                  className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] text-slate-700 outline-none transition-all focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>

            </div>

            {/* ========================= Profile Image ========================= */}

            <div>
              <FormLabel>
                Profile image
              </FormLabel>

              <div className="mt-1.5 flex min-h-[56px] items-center gap-3 rounded-lg border border-slate-200 px-2.5 py-2">

                {/* Preview */}

                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-[9px] font-medium text-slate-400">

                  {profilePreview ? (
                    <img
                      src={
                        profilePreview
                      }
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon
                      size={15}
                      strokeWidth={
                        1.6
                      }
                    />
                  )}

                </div>

                {/* Choose File */}

                <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50">

                  <Upload
                    size={13}
                    strokeWidth={
                      1.7
                    }
                  />

                  <span>
                    Choose file
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={
                      handleProfileImage
                    }
                    className="hidden"
                  />

                </label>

                {/* File Name */}

                <span className="min-w-0 truncate text-[10px] text-slate-400">
                  {formData
                    .profile_image
                    ?.name ||
                    (initialData
                      ?.profile_image_url
                      ? "Current profile image"
                      : "No file chosen")}
                </span>

              </div>

              <p className="mt-1 text-[8px] text-slate-400">
                JPG, PNG or WebP · max 10 MB
              </p>
            </div>

          </div>

          {/* ========================= Footer ========================= */}

          <div className="sticky bottom-0 border-t border-slate-100 bg-white px-5 py-3 sm:px-6">
            <div className="flex items-center justify-end gap-2">

              {/* Cancel */}

              <button
                type="button"
                onClick={
                  onClose
                }
                disabled={
                  isLoading
                }
                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Submit */}

              <button
                type="submit"
                disabled={
                  isLoading
                }
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[#2E3192] px-3.5 text-[10px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#27297f] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Employee"
                  : "Create Employee"}
              </button>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ========================= Form Field ========================= */

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}

function FormField({
  label,
  name,
  value,
  placeholder,
  type = "text",
  autoComplete,
  onChange,
}: FormFieldProps) {
  return (
    <div className="min-w-0">
      <FormLabel>
        {label}
      </FormLabel>

      <input
        type={type}
        name={name}
        value={value}
        placeholder={
          placeholder
        }
        autoComplete={
          autoComplete
        }
        onChange={
          onChange
        }
        className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10"
      />
    </div>
  );
}

/* ========================= Form Label ========================= */

function FormLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <label className="block text-[9px] font-medium text-slate-500">
      {children}
    </label>
  );
}