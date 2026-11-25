"use client";

import {
  Mail,
  User,
  LogIn,
  Globe,
  FileText,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

import { Client } from "@/src/types/admin/client.types";
import { clientApi } from "@/src/api/admin/client.api";

interface ClientDetailsProps {
  client: Client;
}

export default function ClientDetails({
  client,
}: ClientDetailsProps) {
  const getStatusLabel = () => {
    return client.status === "ACTIVE" ? "Active" : "Inactive";
  };

  const getStatusClass = () => {
    return client.status === "ACTIVE"
      ? "bg-[#F0F0FF] text-[#2E3192]"
      : "bg-slate-100 text-slate-500";
  };

  const handleViewAgreement = async () => {
    if (!client.uuid) {
      return;
    }

    try {
      const responseBlob = await clientApi.getClientAgreement(client.uuid);

      // Force the browser to treat the response as a PDF document.
      const pdfBlob = new Blob([responseBlob], {
        type: "application/pdf",
      });

      const pdfUrl = URL.createObjectURL(pdfBlob);

      window.open(pdfUrl, "_blank", "noopener,noreferrer");

      // Keep the blob alive long enough for the browser PDF viewer to load it.
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 5 * 60 * 1000);
    } catch (error) {
      console.error("Failed to open agreement:", error);
    }
  };

  return (
    <div className="space-y-5">
      {/* Profile */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
          {client.profile_photo ? (
            <img
              src={client.profile_photo}
              alt={client.name}
              className="h-full w-full object-cover"
            />
          ) : (
            client.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {client.name}
          </h3>
          <p className="truncate text-xs text-slate-400">{client.email}</p>
        </div>

        <span
          className={`ml-auto rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClass()}`}
        >
          {getStatusLabel()}
        </span>
      </div>

      {/* Basic Information */}
      <DetailSection title="Basic Information">
        <DetailItem
          icon={<User size={15} />}
          label="Client name"
          value={client.name}
        />
        <DetailItem
          icon={<Mail size={15} />}
          label="Email"
          value={client.email}
        />
        <DetailItem
          icon={<LogIn size={15} />}
          label="Login ID"
          value={client.login_id}
        />
        <DetailItem
          label="Monthly service fee"
          value={`₹${Number(client.monthly_service_fee || 0).toLocaleString("en-IN")}`}
        />
      </DetailSection>

      {/* Services */}
      <DetailSection title="Services">
        {client.clientServices?.length > 0 ? (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {client.clientServices.map((service) => (
              <div
                key={service.uuid}
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition hover:border-[#DCDDFB] hover:bg-[#F8F8FF]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-slate-800">
                      {service.service_name}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Monthly budget
                    </p>
                  </div>
                  <div className="shrink-0 rounded-md bg-[#F0F0FF] px-2 py-1 text-[11px] font-semibold text-[#2E3192]">
                    ₹{Number(service.monthly_budget || 0).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center">
            <p className="text-xs text-slate-400">No services assigned.</p>
          </div>
        )}
      </DetailSection>

      {/* Links */}
      <DetailSection title="Links">
        <DetailItem
          icon={<Globe size={15} />}
          label="Website"
          value={client.website_url || "Not added"}
          href={client.website_url}
        />
        <DetailItem
          icon={<FaInstagram size={15} />}
          label="Instagram"
          value={client.instagram_url || "Not added"}
          href={client.instagram_url}
        />
        <DetailItem
          icon={<FaFacebook size={15} />}
          label="Facebook"
          value={client.facebook_url || "Not added"}
          href={client.facebook_url}
        />
        <DetailItem
          icon={<FaLinkedin size={15} />}
          label="LinkedIn"
          value={client.linkedin_url || "Not added"}
          href={client.linkedin_url}
        />
        <DetailItem
          icon={<FaYoutube size={15} />}
          label="YouTube"
          value={client.youtube_url || "Not added"}
          href={client.youtube_url}
        />
      </DetailSection>

      {/* Agreement */}
      <DetailSection title="Agreement">
        {client.agreement_contract ? (
          <button
            type="button"
            onClick={handleViewAgreement}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <FileText size={15} />
            View agreement contract
          </button>
        ) : (
          <p className="text-xs text-slate-400">
            No agreement contract uploaded.
          </p>
        )}
      </DetailSection>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        {title}
      </h4>
      <div className="space-y-2 rounded-xl border border-slate-100 bg-white">
        {children}
      </div>
    </section>
  );
}

function DetailItem({
  icon,
  label,
  value,
  href,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  href?: string | null;
}) {
  const content = (
    <>
      {icon && <div className="shrink-0 text-slate-400">{icon}</div>}
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400">{label}</p>
        <p
          className={`mt-0.5 truncate text-xs font-medium ${
            href ? "text-[#2E3192] hover:underline" : "text-slate-700"
          }`}
        >
          {value}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 border-b border-slate-50 px-3.5 py-3 transition hover:bg-slate-50 last:border-b-0"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 border-b border-slate-50 px-3.5 py-3 last:border-b-0">
      {content}
    </div>
  );
}