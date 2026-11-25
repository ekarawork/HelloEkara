"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";

import {
  updateEmployeeProfileSchema,
  type UpdateEmployeeProfileFormData,
} from "@/src/validations/employee/settings.validation";

import type {
  EmployeeProfile,
  UpdateEmployeeProfilePayload,
} from "@/src/types/employee/settings.types";

/* =========================================================
   TYPES
========================================================= */

interface EmployeeProfileFormProps {
  profile: EmployeeProfile;
  isUpdating?: boolean;
  onSubmit: (
    payload: UpdateEmployeeProfilePayload
  ) => Promise<void>;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function EmployeeProfileForm({
  profile,
  isUpdating = false,
  onSubmit,
}: EmployeeProfileFormProps) {
  /* =======================================================
     FORM STATE
  ======================================================= */

  const [formData, setFormData] =
    useState<UpdateEmployeeProfileFormData>({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      email: profile.email || "",
    });

  const [errors, setErrors] = useState<
    Partial<
      Record<keyof UpdateEmployeeProfileFormData, string>
    >
  >({});

  const [submitError, setSubmitError] = useState<string | null>(
    null
  );

  const [isSaved, setIsSaved] = useState(false);

  /* =======================================================
     SYNC PROFILE
  ======================================================= */

  useEffect(() => {
    setFormData({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      email: profile.email || "",
    });

    setErrors({});
    setSubmitError(null);
    setIsSaved(false);
  }, [profile]);

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]:
        undefined,
    }));

    setSubmitError(null);
    setIsSaved(false);
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = (): boolean => {
    const result =
      updateEmployeeProfileSchema.safeParse(formData);

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: Partial<
      Record<keyof UpdateEmployeeProfileFormData, string>
    > = {};

    result.error.issues.forEach((issue) => {
      const field =
        issue.path[0] as keyof UpdateEmployeeProfileFormData;

      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });

    setErrors(fieldErrors);

    return false;
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitError(null);
    setIsSaved(false);

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      const payload: UpdateEmployeeProfilePayload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name?.trim() || null,
        email: formData.email.trim().toLowerCase(),
      };

      await onSubmit(payload);

      setIsSaved(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update employee profile.";

      setSubmitError(message);
    }
  };

  /* =======================================================
     RESET FORM
  ======================================================= */

  const handleCancel = () => {
    setFormData({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      email: profile.email || "",
    });

    setErrors({});
    setSubmitError(null);
    setIsSaved(false);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-base font-semibold text-gray-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Update your name and email address.
        </p>
      </div>

      {/* ===================================================
          FORM
      =================================================== */}

      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-6 py-6">
          {/* =================================================
              FIRST NAME
          ================================================= */}

          <div>
            <label
              htmlFor="first_name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              First Name
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              disabled={isUpdating}
              placeholder="Enter first name"
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                errors.first_name
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />

            {errors.first_name && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.first_name}
              </p>
            )}
          </div>

          {/* =================================================
              LAST NAME
          ================================================= */}

          <div>
            <label
              htmlFor="last_name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>

            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name || ""}
              onChange={handleChange}
              disabled={isUpdating}
              placeholder="Enter last name"
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                errors.last_name
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />

            {errors.last_name && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.last_name}
              </p>
            )}
          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isUpdating}
              placeholder="Enter email address"
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                errors.email
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />

            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          {/* =================================================
              SUBMIT ERROR
          ================================================= */}

          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">
                {submitError}
              </p>
            </div>
          )}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {isSaved && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm text-green-700">
                Employee profile updated successfully.
              </p>
            </div>
          )}
        </div>

        {/* =================================================
            FOOTER ACTIONS
        ================================================= */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isUpdating}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isUpdating}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2E3192] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#27297f] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : (
              <>
                <Save size={16} />

                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}