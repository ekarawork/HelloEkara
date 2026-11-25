"use client";

import { useCallback, useEffect, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";

import ProtectedRoute from "@/src/components/admin/auth/ProtectedRoute";
import AdminNavbar from "@/src/components/admin/AdminNavbar";

import ClientPerformanceDashboardStats from "@/src/components/admin/client-performance/ClientPerformanceDashboardStats";
import ClientPerformanceDailyLeadsChart from "@/src/components/admin/client-performance/ClientPerformanceDailyLeadsChart";
import ClientPerformanceSearch from "@/src/components/admin/client-performance/ClientPerformanceSearch";
import ClientPerformanceTable from "@/src/components/admin/client-performance/ClientPerformanceTable";
import ClientPerformanceSkeleton from "@/src/components/admin/client-performance/ClientPerformanceSkeleton";
import ClientPerformanceDetails from "@/src/components/admin/client-performance/ClientPerformanceDetails";
import ClientPerformancePagination from "@/src/components/admin/client-performance/ClientPerformancePagination";
import ClientPerformanceForm, {
  ClientOption,
} from "@/src/components/admin/client-performance/ClientPerformanceForm";
import ClientModal from "@/src/components/admin/client/ClientModal";

import useClientPerformance from "@/src/hooks/admin/useClientPerformance";
import useClient from "@/src/hooks/admin/useClient";

import {
  ClientPerformance,
  ClientPerformanceServiceName,
  ClientServiceOption,
  CreateClientPerformancePayload,
  UpdateClientPerformancePayload,
  ClientPerformanceDashboardData,
} from "@/src/types/admin/clientPerformance.types";

export default function AdminClientPerformancePage() {

  /* -------------------------------------------------------------------------- */
  /* STATE                                                                      */
  /* -------------------------------------------------------------------------- */

  const [performances, setPerformances] = useState<ClientPerformance[]>([]);

const [search, setSearch] = useState("");

const [serviceName, setServiceName] =
  useState<ClientPerformanceServiceName | "">("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
const [clients, setClients] = useState<ClientOption[]>([]);

const [services, setServices] =
  useState<ClientServiceOption[]>([]);

const [serviceFilterOptions, setServiceFilterOptions] =
  useState<ClientPerformanceServiceName[]>([]);

  const [hasLoadedPerformances, setHasLoadedPerformances] =
    useState(false);

  /* Selected Performance */
  const [selectedPerformance, setSelectedPerformance] =
    useState<ClientPerformance | null>(null);

  const [isPerformanceDetailsOpen, setIsPerformanceDetailsOpen] =
    useState(false);

  /* Trash */
  const [trashPerformances, setTrashPerformances] = useState<
    ClientPerformance[]
  >([]);

  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isTrashLoading, setIsTrashLoading] = useState(false);

  /* Trash Pagination */
  const [trashCurrentPage, setTrashCurrentPage] = useState(1);
  const [trashPageSize] = useState(10);
  const [trashTotalPages, setTrashTotalPages] = useState(1);
  const [trashTotalCount, setTrashTotalCount] = useState(0);

    const [isPerformanceFormOpen, setIsPerformanceFormOpen] =
  useState(false);
  const [performanceFormMode, setPerformanceFormMode] =
  useState<"add" | "edit">("add");

  const [dashboardData, setDashboardData] =
  useState<ClientPerformanceDashboardData | null>(null);

const {
  createPerformance,
  updatePerformance,
  getPerformances,
  getPerformance,
  getDashboardPerformance,
  deletePerformance,
  getTrashPerformances,
  restorePerformance,
  forceDeletePerformance,
  isLoading,
  clearError,
} = useClientPerformance();

const { getClients } = useClient();

useEffect(() => {
  const loadClientsForPerformance = async () => {
    const data = await getClients({
      page: 1,
      limit: 100,
    });

    if (!data) {
      return;
    }

    const clientOptions: ClientOption[] = data.rows.map(
      (client) => ({
        id: client.id,
        uuid: client.uuid,
        name: client.name,
      })
    );

const serviceMap = new Map<
  ClientPerformanceServiceName,
  ClientServiceOption
>();

data.rows.forEach((client) => {
  (client.clientServices ?? []).forEach((service) => {
    if (!serviceMap.has(service.service_name)) {
      serviceMap.set(service.service_name, {
        id: service.id,
        uuid: service.uuid,
        client_id: service.client_id,
        service_name: service.service_name,
        monthly_budget: Number(service.monthly_budget),
      });
    }
  });
});

setClients(clientOptions);

setServices(Array.from(serviceMap.values()));

setServiceFilterOptions(
  Array.from(serviceMap.keys())
);
  };

  loadClientsForPerformance();
}, [getClients]);
  /* -------------------------------------------------------------------------- */
  /* LOAD PERFORMANCES                                                          */
  /* -------------------------------------------------------------------------- */

  const loadPerformances = useCallback(async () => {
   const data = await getPerformances({
  page: currentPage,
  limit: pageSize,
  search: search.trim() || undefined,
  serviceName: serviceName || undefined,
});

    if (data) {
      setPerformances(data.rows);
      setTotalPages(data.totalPages);
      setTotalCount(data.count);
    }

    setHasLoadedPerformances(true);
}, [
  currentPage,
  pageSize,
  search,
  serviceName,
  getPerformances,
]);

  /* -------------------------------------------------------------------------- */
  /* INITIAL / FILTER LOAD                                                      */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    loadPerformances();
  }, [loadPerformances]);


  /* -------------------------------------------------------------------------- */
/* LOAD DASHBOARD                                                             */
/* -------------------------------------------------------------------------- */

const loadDashboard = useCallback(async () => {
  const data = await getDashboardPerformance({
    serviceName: serviceName || undefined,
  });

  if (data) {
    setDashboardData(data);
  }
}, [getDashboardPerformance, serviceName]);

useEffect(() => {
  loadDashboard();
}, [loadDashboard]);

  /* -------------------------------------------------------------------------- */
  /* SEARCH                                                                     */
  /* -------------------------------------------------------------------------- */

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  /* -------------------------------------------------------------------------- */
  /* FILTER                                                                     */
  /* -------------------------------------------------------------------------- */

const handleServiceChange = useCallback(
  (value: ClientPerformanceServiceName | "") => {
    setServiceName(value);
    setCurrentPage(1);
  },
  []
);

  /* -------------------------------------------------------------------------- */
  /* REFRESH                                                                    */
  /* -------------------------------------------------------------------------- */

  const handleRefresh = useCallback(async () => {
    clearError();
    await loadPerformances();
  }, [clearError, loadPerformances]);


const handleAddPerformance = useCallback(() => {
  clearError();

  setSelectedPerformance(null);
  setPerformanceFormMode("add");
  setIsPerformanceFormOpen(true);
}, [clearError]);

  /* -------------------------------------------------------------------------- */
  /* VIEW PERFORMANCE                                                           */
  /* -------------------------------------------------------------------------- */

  const handleViewPerformance = useCallback(
    async (performance: ClientPerformance) => {
      clearError();

      if (!performance.uuid) {
        return;
      }

      const latestPerformance = await getPerformance(
        performance.uuid
      );

      if (!latestPerformance) {
        return;
      }

      setSelectedPerformance(latestPerformance);
      setIsPerformanceDetailsOpen(true);
    },
    [clearError, getPerformance]
  );


  const handleEditPerformance = useCallback(
    async (performance: ClientPerformance) => {
      clearError();

      if (!performance.uuid) {
        return;
      }

      const latestPerformance = await getPerformance(
        performance.uuid
      );

      if (!latestPerformance) {
        return;
      }

      setSelectedPerformance(latestPerformance);
      setPerformanceFormMode("edit");
      setIsPerformanceFormOpen(true);
    },
    [clearError, getPerformance]
  );

  const handleClosePerformanceForm = useCallback(() => {
    setIsPerformanceFormOpen(false);
  }, []);

const handleCreatePerformance = useCallback(
  async (data: CreateClientPerformancePayload) => {
    const created = await createPerformance(data);

    if (!created) {
      return;
    }

    setIsPerformanceFormOpen(false);

    // Refresh performance table
    await loadPerformances();

    // Refresh dashboard stats + chart
    await loadDashboard();
  },
  [
    createPerformance,
    loadPerformances,
    loadDashboard,
  ]
);

const handleUpdatePerformance = useCallback(
  async (data: UpdateClientPerformancePayload) => {
    if (!selectedPerformance?.uuid) {
      return;
    }

    const updated = await updatePerformance(
      selectedPerformance.uuid,
      data
    );

    if (!updated) {
      return;
    }

    setIsPerformanceFormOpen(false);
    setSelectedPerformance(null);

    // Refresh table
    await loadPerformances();

    // Refresh dashboard
    await loadDashboard();
  },
  [
    selectedPerformance,
    updatePerformance,
    loadPerformances,
    loadDashboard,
  ]
);

  /* -------------------------------------------------------------------------- */
  /* CLOSE DETAILS                                                              */
  /* -------------------------------------------------------------------------- */

  const handleClosePerformanceDetails = useCallback(() => {
    setIsPerformanceDetailsOpen(false);
    setSelectedPerformance(null);
  }, []);

  /* -------------------------------------------------------------------------- */
  /* DELETE PERFORMANCE                                                         */
  /* -------------------------------------------------------------------------- */

  const handleDeletePerformance = useCallback(
    async (performance: ClientPerformance) => {
      if (!performance.uuid) {
        return;
      }

      const deleted = await deletePerformance(
        performance.uuid
      );

      if (!deleted) {
        return;
      }

      /*
       * If the deleted item was the last item on the current page,
       * move one page backward when possible.
       */
      if (
        performances.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage((previous) => previous - 1);
        return;
      }

      await loadPerformances();
      await loadDashboard();  
    },
    [
      deletePerformance,
      performances.length,
      currentPage,
      loadPerformances,
    ]
  );

  /* -------------------------------------------------------------------------- */
  /* LOAD TRASH                                                                 */
  /* -------------------------------------------------------------------------- */

  const loadTrashPerformances = useCallback(
    async (page = trashCurrentPage) => {
      setIsTrashLoading(true);

      try {
        const data = await getTrashPerformances({
          page,
          limit: trashPageSize,
        });

        if (data) {
          setTrashPerformances(data.rows);
          setTrashTotalPages(data.totalPages);
          setTrashTotalCount(data.count);
        }
      } finally {
        setIsTrashLoading(false);
      }
    },
    [
      getTrashPerformances,
      trashCurrentPage,
      trashPageSize,
    ]
  );

  /* -------------------------------------------------------------------------- */
  /* OPEN TRASH                                                                 */
  /* -------------------------------------------------------------------------- */

  const handleViewTrash = useCallback(() => {
    setTrashCurrentPage(1);
    setIsTrashOpen(true);
  }, []);

  /* -------------------------------------------------------------------------- */
  /* LOAD TRASH WHEN OPEN                                                       */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!isTrashOpen) {
      return;
    }

    loadTrashPerformances();
  }, [
    isTrashOpen,
    trashCurrentPage,
    loadTrashPerformances,
  ]);
  /* -------------------------------------------------------------------------- */
  /* RESTORE PERFORMANCE                                                        */
  /* -------------------------------------------------------------------------- */

const handleRestorePerformance = useCallback(
  async (performance: ClientPerformance) => {
    if (!performance.uuid) {
      return;
    }

    const restored = await restorePerformance(
      performance.uuid
    );

    if (!restored) {
      return;
    }

    /* Refresh normal performance table */
    await loadPerformances();

    /* Refresh dashboard stats + chart */
    await loadDashboard();

    /*
     * If last item was removed from the current trash page,
     * move one page backward.
     */
    if (
      trashPerformances.length === 1 &&
      trashCurrentPage > 1
    ) {
      setTrashCurrentPage((previous) => previous - 1);
      return;
    }

    /* Refresh trash */
    await loadTrashPerformances();
  },
  [
    restorePerformance,
    loadPerformances,
    loadDashboard,
    trashPerformances.length,
    trashCurrentPage,
    loadTrashPerformances,
  ]
);

  /* -------------------------------------------------------------------------- */
  /* FORCE DELETE                                                              */
  /* -------------------------------------------------------------------------- */

  const handleForceDeletePerformance = useCallback(
    async (performance: ClientPerformance) => {
      if (!performance.uuid) {
        return;
      }

      const deleted = await forceDeletePerformance(
        performance.uuid
      );

      if (!deleted) {
        return;
      }

      if (
        trashPerformances.length === 1 &&
        trashCurrentPage > 1
      ) {
        setTrashCurrentPage((previous) => previous - 1);
        return;
      }

      await loadTrashPerformances();
    },
    [
      forceDeletePerformance,
      trashPerformances.length,
      trashCurrentPage,
      loadTrashPerformances,
    ]
  );

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="min-h-screen bg-slate-50">
        <AdminNavbar />

        <main className="w-full">
          <div className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-5 lg:px-6 xl:px-8">

            {!hasLoadedPerformances ? (
              <ClientPerformanceSkeleton />
            ) : (
              <>
              {/* ------------------------------------------------------------------ */}
              {/* PERFORMANCE DASHBOARD                                             */}
              {/* ------------------------------------------------------------------ */}

              {dashboardData && (
                <div className="mb-6 space-y-5">
                  {/* Dashboard Stats */}
                  <ClientPerformanceDashboardStats
                    stats={dashboardData.stats}
                  />

                  <ClientPerformanceDailyLeadsChart
                  dailyLeads={dashboardData.dailyLeads}
                />
                </div>
              )}

              {/* SEARCH / HEADER */}
              <ClientPerformanceSearch
                  search={search}
                  service={serviceName}
                  services={serviceFilterOptions}
                  onSearch={handleSearch}
                  onServiceChange={handleServiceChange}
                  onTrashPerformances={handleViewTrash}
                  onAddPerformance={handleAddPerformance}
                />

                <ClientPerformanceTable
                  performances={performances}
                  onView={handleViewPerformance}
                  onEdit={handleEditPerformance}
                  onDelete={handleDeletePerformance}
                />

                <ClientPerformancePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </main>

{isPerformanceFormOpen &&
  (performanceFormMode === "edit" ? (
    <ClientPerformanceForm
      mode="edit"
      clients={clients}
      services={services}
      initialData={
        selectedPerformance
          ? {
              client_id: String(
                selectedPerformance.client_id
              ),
              client_service_id: String(
                selectedPerformance.client_service_id
              ),
              performance_date:
                selectedPerformance.performance_date,
              daily_spend: String(
                selectedPerformance.daily_spend ?? 0
              ),
              impressions: String(
                selectedPerformance.impressions ?? 0
              ),
              clicks: String(
                selectedPerformance.clicks ?? 0
              ),
              leads: String(
                selectedPerformance.leads ?? 0
              ),
            }
          : undefined
      }
      onClose={handleClosePerformanceForm}
      onSubmit={handleUpdatePerformance}
      isLoading={isLoading}
      error={null}
    />
  ) : (
    <ClientPerformanceForm
      mode="add"
      clients={clients}
      services={services}
      initialData={undefined}
      onClose={handleClosePerformanceForm}
      onSubmit={handleCreatePerformance}
      isLoading={isLoading}
      error={null}
    />
  ))}
        {/* ------------------------------------------------------------------ */}
        {/* PERFORMANCE DETAILS MODAL                                          */}
        {/* ------------------------------------------------------------------ */}

        <ClientModal
          isOpen={isPerformanceDetailsOpen}
          onClose={handleClosePerformanceDetails}
          title="Performance Details"
          description={
            selectedPerformance?.client?.name
              ? `Performance details for ${selectedPerformance.client.name}`
              : "Complete performance details"
          }
        >
          {selectedPerformance && (
            <ClientPerformanceDetails
              performance={selectedPerformance}
            />
          )}
        </ClientModal>

        {/* ------------------------------------------------------------------ */}
        {/* TRASH MODAL                                                        */}
        {/* ------------------------------------------------------------------ */}

        <ClientModal
          isOpen={isTrashOpen}
          onClose={() => setIsTrashOpen(false)}
          title="Deleted Performances"
          description="Performance records that have been moved to trash."
        >
{isTrashLoading ? (
  <div className="py-10 text-center">
    <p className="text-sm text-slate-500">
      Loading deleted performances...
    </p>
  </div>
) : trashPerformances.length === 0 ? (
  <div className="py-10 text-center">
    <p className="text-sm font-medium text-slate-600">
      Trash is empty
    </p>

    <p className="mt-1 text-xs text-slate-400">
      No soft-deleted performance records found.
    </p>
  </div>
) : (
  <>
    <div className="space-y-2">
      {trashPerformances.map((performance) => {
        const serviceName =
          performance.clientService?.service_name ||
          "Performance";

        const date = performance.performance_date
          ? new Date(
              performance.performance_date
            ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "No date";

        return (
          <div
            key={performance.uuid}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600">
    {(performance.client?.name || "Client")
      .slice(0, 2)
      .toUpperCase()}
  </div>

  <div className="min-w-0">
    <p className="truncate text-sm font-semibold text-slate-800">
      {performance.client?.name || "Unknown Client"}
    </p>

    <p className="truncate text-xs text-slate-400">
      {date}
    </p>
  </div>
</div>

            <div className="flex shrink-0 items-center gap-1.5">
              {/* Restore */}
              <button
                type="button"
                onClick={() =>
                  handleRestorePerformance(performance)
                }
                title="Restore performance"
                aria-label="Restore performance"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#B9BAFF] hover:bg-[#F8F8FF] hover:text-[#2E3192]"
              >
                <RotateCcw
                  size={15}
                  strokeWidth={1.8}
                />
              </button>

              {/* Permanent Delete */}
              <button
                type="button"
                onClick={() =>
                  handleForceDeletePerformance(performance)
                }
                title="Permanently delete"
                aria-label="Permanently delete performance"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2
                  size={15}
                  strokeWidth={1.8}
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>

    {/* Trash Pagination */}
    <div className="mt-4">
      <ClientPerformancePagination
        currentPage={trashCurrentPage}
        totalPages={trashTotalPages}
        onPageChange={setTrashCurrentPage}
      />
    </div>
  </>
)}
        </ClientModal>
      </div>
    </ProtectedRoute>
  );
}