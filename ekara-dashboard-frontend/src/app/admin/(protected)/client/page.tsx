"use client";

import { useCallback, useEffect, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import ProtectedRoute from "@/src/components/admin/auth/ProtectedRoute";
import AdminNavbar from "@/src/components/admin/AdminNavbar";
import ClientSearch from "@/src/components/admin/client/ClientSearch";
import ClientTable from "@/src/components/admin/client/ClientTable";
import ClientForm, { ClientFormData } from "@/src/components/admin/client/ClientForm";
import ClientModal from "@/src/components/admin/client/ClientModal";
import ClientSkeleton from "@/src/components/admin/client/ClientSkeleton";
import ClientDetails from "@/src/components/admin/client/ClientDetails";
import ClientPagination from "@/src/components/admin/client/ClientPagination";
import useClient from "@/src/hooks/admin/useClient";
import useClientPortal from "@/src/hooks/admin/useClientPortal";
import {
  Client,
  CreateClientPayload,
  UpdateClientPayload,
} from "@/src/types/admin/client.types";

export default function AdminClientPage() {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [clients, setClients] = useState<Client[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasLoadedClients, setHasLoadedClients] = useState(false);

  // Selected Client For Edit
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false);
  const [trashClients, setTrashClients] = useState<Client[]>([]);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isTrashLoading, setIsTrashLoading] = useState(false);

  // Trash Pagination
  const [trashCurrentPage, setTrashCurrentPage] = useState(1);
  const [trashPageSize] = useState(10);
  const [trashTotalPages, setTrashTotalPages] = useState(1);
  const [trashTotalCount, setTrashTotalCount] = useState(0);

  // Edit Mode
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    createClient,
    getClients,
    getClient,
    updateClient,
    updateClientStatus,
    deleteClient,
    getTrashClients,
    restoreClient,
    forceDeleteClient,
    isLoading,
    error,
    clearError,
  } = useClient();

  const {
    createClientPortalAccess,
    isLoading: isClientPortalLoading,
  } = useClientPortal();

  // Load Clients
  const loadClients = useCallback(async () => {
    const data = await getClients({
      page: currentPage,
      limit: pageSize,
      search: search.trim() || undefined,
      status:
        filter !== "All"
          ? filter === "Active"
            ? "ACTIVE"
            : "INACTIVE"
          : undefined,
    });

    if (data) {
      setClients(data.rows);
      setTotalPages(data.totalPages);
      setTotalCount(data.count);
    }

    setHasLoadedClients(true);
  }, [getClients, currentPage, pageSize, search, filter]);

  // Initial Load
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // Add Client
  const handleAddClient = useCallback(() => {
    clearError();
    setSelectedClient(null);
    setIsEditMode(false);
    setIsClientFormOpen(true);
  }, [clearError]);

  // Load Trash Clients
  const loadTrashClients = useCallback(
    async (page = trashCurrentPage) => {
      setIsTrashLoading(true);

      try {
        const data = await getTrashClients({
          page,
          limit: trashPageSize,
        });

        if (data) {
          setTrashClients(data.rows);
          setTrashTotalPages(data.totalPages);
          setTrashTotalCount(data.count);
        }
      } finally {
        setIsTrashLoading(false);
      }
    },
    [getTrashClients, trashCurrentPage, trashPageSize]
  );

  // View Soft Deleted Clients
  const handleViewTrash = useCallback(() => {
    setTrashCurrentPage(1);
    setIsTrashOpen(true);
  }, []);

  useEffect(() => {
    if (!isTrashOpen) {
      return;
    }

    loadTrashClients();
  }, [isTrashOpen, trashCurrentPage, loadTrashClients]);

  // Restore Deleted Client
  const handleRestoreClient = useCallback(
    async (client: Client) => {
      if (!client.uuid) {
        return;
      }

      const restoredClient = await restoreClient(client.uuid);

      if (!restoredClient) {
        return;
      }

      // Refresh normal client list
      await loadClients();

      // If last item was removed from current page
      if (trashClients.length === 1 && trashCurrentPage > 1) {
        setTrashCurrentPage((prev) => prev - 1);
        return;
      }

      // Refresh current trash page
      await loadTrashClients();
    },
    [
      restoreClient,
      loadClients,
      trashClients.length,
      trashCurrentPage,
      loadTrashClients,
    ]
  );

  // Permanently Delete Client
  const handleForceDeleteClient = useCallback(
    async (client: Client) => {
      if (!client.uuid) {
        return;
      }

      const deleted = await forceDeleteClient(client.uuid);

      if (!deleted) {
        return;
      }

      // If last item was removed from current page
      if (trashClients.length === 1 && trashCurrentPage > 1) {
        setTrashCurrentPage((prev) => prev - 1);
        return;
      }

      // Refresh current trash page
      await loadTrashClients();
    },
    [
      forceDeleteClient,
      trashClients.length,
      trashCurrentPage,
      loadTrashClients,
    ]
  );

  // Edit Client
  const handleEditClient = useCallback(
    async (client: Client) => {
      clearError();

      // Get latest client details from backend. This ensures edit form has fresh services/budgets/details.
      const uuid = client.uuid;

      if (!uuid) {
        return;
      }

      const latestClient = await getClient(uuid);

      if (!latestClient) {
        return;
      }

      setSelectedClient(latestClient);
      setIsEditMode(true);
      setIsClientFormOpen(true);
    },
    [clearError, getClient]
  );

  const handleViewClient = useCallback(
    async (client: Client) => {
      clearError();

      if (!client.uuid) {
        return;
      }

      const latestClient = await getClient(client.uuid);

      if (!latestClient) {
        return;
      }

      setViewClient(latestClient);
      setIsClientDetailsOpen(true);
    },
    [clearError, getClient]
  );

  // View Client Portal
  const handleViewClientPortal = useCallback(
    async (client: Client) => {
      if (!client.uuid) {
        return;
      }

      const portalAccess =
        await createClientPortalAccess(client.uuid);

      if (!portalAccess?.token) {
        return;
      }

      const portalUrl =
        `/client/dashboard#preview_token=${encodeURIComponent(
          portalAccess.token
        )}`;

      window.open(
        portalUrl,
        "_blank",
        "noopener,noreferrer"
      );
    },
    [createClientPortalAccess]
  );

  const handleCloseClientDetails = useCallback(() => {
    setIsClientDetailsOpen(false);
    setViewClient(null);
  }, []);

  // Disable / Enable Client
  const handleToggleClientStatus = useCallback(
    async (client: Client) => {
      if (!client.uuid) {
        return;
      }

      const nextStatus =
        client.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      const updatedClient = await updateClientStatus(client.uuid, {
        status: nextStatus,
      });

      if (!updatedClient) {
        return;
      }

      // Refresh client list so status immediately updates in the table.
      await loadClients();
    },
    [updateClientStatus, loadClients]
  );

  // Delete Client - Soft Delete
  const handleDeleteClient = useCallback(
    async (client: Client) => {
      if (!client.uuid) {
        return;
      }

      const deleted = await deleteClient(client.uuid);

      if (!deleted) {
        return;
      }

      // Refresh active client list. Because backend uses Sequelize paranoid mode, the soft-deleted client will no longer appear in the normal client list.
      await loadClients();
    },
    [deleteClient, loadClients]
  );

  // Close Client Modal
  const handleCloseClientModal = useCallback(() => {
    clearError();
    setIsClientFormOpen(false);
    setSelectedClient(null);
    setIsEditMode(false);
  }, [clearError]);

  // Create Client
  const handleCreateClient = async (data: ClientFormData) => {
    const payload: CreateClientPayload = {
      ...data,
      monthly_service_fee: Number(data.monthly_service_fee),
      services: data.services.map((service) => ({
        service_name: service.service_name,
        monthly_budget: Number(service.monthly_budget),
      })),
    };

    const createdClient = await createClient(payload);

    if (!createdClient) {
      return;
    }

    setIsClientFormOpen(false);
    await loadClients();
  };

  // Update Client
  const handleUpdateClient = async (data: ClientFormData) => {
    if (!selectedClient?.uuid) {
      return;
    }

    const payload: UpdateClientPayload = {
      name: data.name.trim(),
      email: data.email.trim(),
      login_id: data.login_id.trim(),
      monthly_service_fee: Number(data.monthly_service_fee),
      website_url: data.website_url.trim() || undefined,
      instagram_url: data.instagram_url.trim() || undefined,
      facebook_url: data.facebook_url.trim() || undefined,
      linkedin_url: data.linkedin_url.trim() || undefined,
      youtube_url: data.youtube_url.trim() || undefined,
      services: data.services.map((service) => ({
        service_name: service.service_name,
        monthly_budget: Number(service.monthly_budget),
      })),
      profile_photo: data.profile_photo || null,
      agreement_contract: data.agreement_contract || null,
    };

    // Only send password if user entered a new one.
    if (data.password.trim()) {
      payload.password = data.password.trim();
    }

    const updatedClient = await updateClient(
      selectedClient.uuid,
      payload
    );

    if (!updatedClient) {
      return;
    }

    // Close edit modal
    setIsClientFormOpen(false);
    setSelectedClient(null);
    setIsEditMode(false);

    // Reload client list
    await loadClients();
  };

  // Form Submit
  const handleClientSubmit = async (data: ClientFormData) => {
    if (isEditMode) {
      await handleUpdateClient(data);
      return;
    }

    await handleCreateClient(data);
  };

  // Convert Client -> Form Data
  const getEditInitialData = useCallback(
    (client: Client): Partial<ClientFormData> => {
      const getBudget = (
        serviceName:
          | "META_ADS"
          | "GOOGLE_ADS"
          | "WEBSITE_SALES"
          | "ORGANIC_SOCIAL"
      ) => {
        const service = client.clientServices?.find(
          (item) => item.service_name === serviceName
        );

        return service ? String(service.monthly_budget ?? "") : "";
      };

      return {
        name: client.name || "",
        email: client.email || "",
        login_id: client.login_id || "",
        // Password intentionally empty during edit. User only enters it if they want to change it.
        password: "",
        monthly_service_fee: String(client.monthly_service_fee ?? ""),
        website_url: client.website_url || "",
        instagram_url: client.instagram_url || "",
        facebook_url: client.facebook_url || "",
        linkedin_url: client.linkedin_url || "",
        youtube_url: client.youtube_url || "",
        profile_photo: null,
        agreement_contract: null,
        meta_ads_budget: getBudget("META_ADS"),
        google_ads_budget: getBudget("GOOGLE_ADS"),
        website_sales_budget: getBudget("WEBSITE_SALES"),
        organic_social_budget: getBudget("ORGANIC_SOCIAL"),
        services: (client.clientServices || []).map((service) => ({
          service_name: service.service_name,
          monthly_budget: String(service.monthly_budget ?? 0),
        })),
      };
    },
    []
  );

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((value: string) => {
    setFilter(value);
    setCurrentPage(1);
  }, []);

  // Render
  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="min-h-screen bg-slate-50">
        <AdminNavbar />

        <main className="w-full">
          <div className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-5 lg:px-6 xl:px-8">
            {!hasLoadedClients ? (
                <ClientSkeleton />
              ) : (
                <>
                  <ClientSearch
                    search={search}
                    filter={filter}
                    onAddClient={handleAddClient}
                    onClearClients={handleViewTrash}
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                  />

                 <ClientTable
                    clients={clients}
                    onView={handleViewClient}
                    onViewPortal={handleViewClientPortal}
                    onEdit={handleEditClient}
                    onDisable={handleToggleClientStatus}
                    onDelete={handleDeleteClient}
                  />

                  <ClientPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
          </div>
        </main>

        {/* CLIENT FORM MODAL */}
        <ClientModal
          isOpen={isClientFormOpen}
          onClose={handleCloseClientModal}
          title={isEditMode ? "Edit Client" : "Add New Client"}
          description={
            isEditMode
              ? "Update the client profile, services, budgets and agreement record."
              : "Create the client profile, services, budgets and agreement record."
          }
        >
          <ClientForm
            key={selectedClient?.uuid || "new-client"}
            mode={isEditMode ? "edit" : "add"}
            initialData={
              selectedClient
                ? getEditInitialData(selectedClient)
                : undefined
            }
            onClose={handleCloseClientModal}
            onSubmit={handleClientSubmit}
            isLoading={isLoading}
            error={error}
          />
        </ClientModal>

        {/* CLIENT DETAILS MODAL */}
        <ClientModal
          isOpen={isClientDetailsOpen}
          onClose={handleCloseClientDetails}
          title="Client Details"
          description={
            viewClient
              ? `Complete profile details for ${viewClient.name}`
              : "Client details"
          }
        >
          {viewClient && <ClientDetails client={viewClient} />}
        </ClientModal>

        {/* SOFT DELETED CLIENTS MODAL */}
        <ClientModal
          isOpen={isTrashOpen}
          onClose={() => setIsTrashOpen(false)}
          title="Deleted Clients"
          description="Clients that have been moved to trash."
        >
          {isTrashLoading ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500">
                Loading deleted clients...
              </p>
            </div>
          ) : trashClients.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-slate-600">
                Trash is empty
              </p>
              <p className="mt-1 text-xs text-slate-400">
                No soft-deleted clients found.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {trashClients.map((client) => (
                <div
                  key={client.uuid}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600">
                      {client.name
                        ?.split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {client.name}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {client.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    {/* Restore */}
                    <button
                      type="button"
                      onClick={() => handleRestoreClient(client)}
                      title="Restore client"
                      aria-label={`Restore ${client.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#B9BAFF] hover:bg-[#F8F8FF] hover:text-[#2E3192]"
                    >
                      <RotateCcw size={15} strokeWidth={1.8} />
                    </button>

                    {/* Permanent Delete */}
                    <button
                      type="button"
                      onClick={() => handleForceDeleteClient(client)}
                      title="Permanently delete"
                      aria-label={`Permanently delete ${client.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trash Pagination */}
          <ClientPagination
            currentPage={trashCurrentPage}
            totalPages={trashTotalPages}
            onPageChange={setTrashCurrentPage}
          />
        </ClientModal>
      </div>
    </ProtectedRoute>
  );
}