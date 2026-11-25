"use client";

import {
  CheckCircle2,
  FileText,
  Info,
  Upload,
} from "lucide-react";

/* =========================================================
   COMPONENT
========================================================= */

export default function ContractSettings() {
  return (
    <div className="space-y-6">
      {/* ===================================================
          CONTRACT HEADER
      =================================================== */}

      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <div className="flex items-start gap-3">
            {/* Icon */}

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#2E3192] shadow-sm">
              <FileText
                size={20}
                strokeWidth={1.8}
              />
            </div>

            {/* Content */}

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Contracts
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage default contract settings and documents
                used for clients.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            CURRENT STATUS
        ================================================= */}

        <div className="px-6 py-6">
          <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-green-600"
                strokeWidth={1.8}
              />

              <div>
                <p className="text-sm font-medium text-gray-900">
                  Contract management
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Configure and manage contracts for your
                  clients.
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Ready
            </span>
          </div>
        </div>
      </section>

      {/* ===================================================
          DEFAULT CONTRACT
      =================================================== */}

      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900">
            Default Contract
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Set the default contract document that can be used
            when creating client contracts.
          </p>
        </div>

        <div className="px-6 py-6">
          {/* =================================================
              EMPTY CONTRACT STATE
          ================================================= */}

          <div className="rounded-xl border border-dashed border-gray-300 px-6 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF0FF] text-[#2E3192] shadow-sm">
              <FileText
                size={23}
                strokeWidth={1.7}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No default contract uploaded
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm leading-5 text-gray-500">
              Upload a contract template to use as the default
              document for new client contracts.
            </p>

            {/* Upload button */}

            <button
              type="button"
              disabled
              className="mt-5 inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-[#2E3192] px-4 py-2.5 text-sm font-medium text-white opacity-60"
            >
              <Upload
                size={16}
                strokeWidth={1.8}
              />

              Upload Contract
            </button>

            <p className="mt-3 text-xs text-gray-400">
              Contract upload will be available once contract
              management is configured.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          CONTRACT INFORMATION
      =================================================== */}

      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900">
            Contract Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Information about how contracts will be managed.
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="flex gap-3 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-4">
            <Info
              size={19}
              className="mt-0.5 shrink-0 text-indigo-600"
              strokeWidth={1.8}
            />

            <div>
              <p className="text-sm font-medium text-[#2E3192]">
                Contract management is coming next
              </p>

              <p className="mt-1 text-sm leading-5 text-[#4A4C9A]">
                Contract templates, client-specific contracts,
                signing status, and document management will be
                connected here once the contract backend is
                finalized.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}