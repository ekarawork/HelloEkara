"use client";

import { useCallback, useEffect, useState } from "react";

import ProtectedRoute from "@/src/components/admin/auth/ProtectedRoute";
import AdminNavbar from "@/src/components/admin/AdminNavbar";

import PaymentForm, {
  PaymentClientOption,
} from "@/src/components/admin/payment/PaymentForm";

import PaymentModal from "@/src/components/admin/payment/PaymentModal";
import PaymentDetails from "@/src/components/admin/payment/PaymentDetails";
import PaymentPagination from "@/src/components/admin/payment/PaymentPagination";
import PaymentSearch from "@/src/components/admin/payment/PaymentSearch";
import PaymentSkeleton from "@/src/components/admin/payment/PaymentSkeleton";
import PaymentStats from "@/src/components/admin/payment/PaymentDashboardStats";
import PaymentTable from "@/src/components/admin/payment/PaymentTable";

import usePayment from "@/src/hooks/admin/usePayment";
import useClient from "@/src/hooks/admin/useClient";

import type {
  Payment,
  PaymentStatus,
  CreatePaymentPayload,
  UpdatePaymentPayload,
  UpdatePaymentStatusPayload,
} from "@/src/types/admin/payment.types";

/* ============================================================================
   PAGE
============================================================================ */

export default function AdminPaymentPage() {
  /* ==========================================================================
     STATE
  ========================================================================== */

  const [payments, setPayments] = useState<Payment[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<PaymentStatus | "">("");

  const [currentPage, setCurrentPage] = useState(1);

  const [pageSize] = useState(10);

  const [totalPages, setTotalPages] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const [clients, setClients] = useState<
    PaymentClientOption[]
  >([]);

  const [hasLoadedPayments, setHasLoadedPayments] =
    useState(false);

  /* ==========================================================================
     SELECTED PAYMENT
  ========================================================================== */

  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  /* ==========================================================================
     DETAILS MODAL
  ========================================================================== */

  const [
    isPaymentDetailsOpen,
    setIsPaymentDetailsOpen,
  ] = useState(false);

  /* ==========================================================================
     PAYMENT FORM
  ========================================================================== */

  const [
    isPaymentFormOpen,
    setIsPaymentFormOpen,
  ] = useState(false);

  const [paymentFormMode, setPaymentFormMode] =
    useState<"add" | "edit">("add");

  /* ==========================================================================
     HOOKS
  ========================================================================== */

  const {
    createPayment,
    updatePayment,
    getPayments,
    getPayment,
    updatePaymentStatus,
    updatePaymentReminders,
    deletePayment,
    isLoading,
    clearError,
  } = usePayment();

  const { getClients } = useClient();

  /* ==========================================================================
     LOAD CLIENTS
  ========================================================================== */

  useEffect(() => {
    let isMounted = true;

    const loadClientsForPayments = async () => {
      const data = await getClients({
        page: 1,
        limit: 100,
      });

      if (!data || !isMounted) {
        return;
      }

      const clientOptions: PaymentClientOption[] =
        data.rows.map((client) => ({
          id: client.id,
          uuid: client.uuid,
          name: client.name,
        }));

      setClients(clientOptions);
    };

    loadClientsForPayments();

    return () => {
      isMounted = false;
    };
  }, [getClients]);

  /* ==========================================================================
     LOAD PAYMENTS
  ========================================================================== */

  const loadPayments = useCallback(async () => {
    const data = await getPayments({
      page: currentPage,
      limit: pageSize,
      search: search.trim() || undefined,
      status: status || undefined,
    });

    if (data) {
      setPayments(data.rows);
      setTotalPages(data.totalPages);
      setTotalCount(data.count);
    }

    setHasLoadedPayments(true);
  }, [
    currentPage,
    pageSize,
    search,
    status,
    getPayments,
  ]);

  /* ==========================================================================
     INITIAL / FILTER LOAD
  ========================================================================== */

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  /* ==========================================================================
     SEARCH
  ========================================================================== */

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      setCurrentPage(1);
    },
    []
  );

  /* ==========================================================================
     STATUS FILTER
  ========================================================================== */

  const handleStatusChange = useCallback(
    (value: PaymentStatus | "") => {
      setStatus(value);
      setCurrentPage(1);
    },
    []
  );

  /* ==========================================================================
     REFRESH
  ========================================================================== */

  const handleRefresh = useCallback(async () => {
    clearError();
    await loadPayments();
  }, [clearError, loadPayments]);

  /* ==========================================================================
     ADD PAYMENT
  ========================================================================== */

  const handleAddPayment = useCallback(() => {
    clearError();

    setSelectedPayment(null);
    setPaymentFormMode("add");
    setIsPaymentFormOpen(true);
  }, [clearError]);

  /* ==========================================================================
     VIEW PAYMENT
  ========================================================================== */

  const handleViewPayment = useCallback(
    async (payment: Payment) => {
      clearError();

      if (!payment.uuid) {
        return;
      }

      const latestPayment = await getPayment(
        payment.uuid
      );

      if (!latestPayment) {
        return;
      }

      setSelectedPayment(latestPayment);
      setIsPaymentDetailsOpen(true);
    },
    [clearError, getPayment]
  );

  /* ==========================================================================
     EDIT PAYMENT
  ========================================================================== */

  const handleEditPayment = useCallback(
    async (payment: Payment) => {
      clearError();

      if (!payment.uuid) {
        return;
      }

      const latestPayment = await getPayment(
        payment.uuid
      );

      if (!latestPayment) {
        return;
      }

      setSelectedPayment(latestPayment);
      setPaymentFormMode("edit");
      setIsPaymentFormOpen(true);
    },
    [clearError, getPayment]
  );

  
  /* ==========================================================================
     CLOSE PAYMENT FORM
  ========================================================================== */

  const handleClosePaymentForm =
    useCallback(() => {
      if (isLoading) {
        return;
      }

      setIsPaymentFormOpen(false);
      setSelectedPayment(null);
    }, [isLoading]);

  /* ==========================================================================
     CREATE PAYMENT
  ========================================================================== */

  const handleCreatePayment = useCallback(
    async (data: CreatePaymentPayload) => {
      const created = await createPayment(data);

      if (!created) {
        return;
      }

      setIsPaymentFormOpen(false);
      setSelectedPayment(null);

      await loadPayments();
    },
    [createPayment, loadPayments]
  );

  /* ==========================================================================
     UPDATE PAYMENT
  ========================================================================== */

  /* ==========================================================================
     UPDATE PAYMENT
  ========================================================================== */

  const handleUpdatePayment = useCallback(
    async (data: UpdatePaymentPayload) => {
      if (!selectedPayment?.uuid) {
        return;
      }

      const updated = await updatePayment(
        selectedPayment.uuid,
        data
      );

      if (!updated) {
        return;
      }

      setIsPaymentFormOpen(false);
      setSelectedPayment(null);

      await loadPayments();
    },
    [
      selectedPayment,
      updatePayment,
      loadPayments,
    ]
  );

  /* ==========================================================================
     CLOSE DETAILS
  ========================================================================== */

  const handleClosePaymentDetails =
    useCallback(() => {
      setIsPaymentDetailsOpen(false);
      setSelectedPayment(null);
    }, []);

  /* ==========================================================================
     UPDATE PAYMENT STATUS
  ========================================================================== */

  const handlePaymentStatusChange =
    useCallback(
      async (
        payment: Payment,
        newStatus: PaymentStatus
      ) => {
        if (!payment.uuid) {
          return;
        }

        const updated =
          await updatePaymentStatus(
            payment.uuid,
            {
              status: newStatus,
            }
          );

        if (!updated) {
          return;
        }

        await loadPayments();

        /*
         * Refresh details when the same payment
         * is currently open.
         */
        if (
          selectedPayment?.uuid ===
          payment.uuid
        ) {
          const latestPayment =
            await getPayment(payment.uuid);

          if (latestPayment) {
            setSelectedPayment(
              latestPayment
            );
          }
        }
      },
      [
        updatePaymentStatus,
        loadPayments,
        selectedPayment,
        getPayment,
      ]
    );


    /* ==========================================================================
   TOGGLE PAYMENT REMINDERS
========================================================================== */

const handlePaymentReminderToggle = useCallback(
  async (payment: Payment) => {
    if (!payment.uuid) {
      return;
    }

    const updated = await updatePaymentReminders(
      payment.uuid,
      {
        enabled: !payment.enable_reminders,
      }
    );

    if (!updated) {
      return;
    }

    await loadPayments();

    /*
     * Refresh details when the same payment
     * is currently open.
     */
    if (
      selectedPayment?.uuid === payment.uuid
    ) {
      const latestPayment =
        await getPayment(payment.uuid);

      if (latestPayment) {
        setSelectedPayment(latestPayment);
      }
    }
  },
  [
    updatePaymentReminders,
    loadPayments,
    selectedPayment,
    getPayment,
  ]
);



  /* ==========================================================================
     DELETE PAYMENT
  ========================================================================== */

  const handleDeletePayment = useCallback(
    async (payment: Payment) => {
      if (!payment.uuid) {
        return;
      }

      const deleted = await deletePayment(
        payment.uuid
      );

      if (!deleted) {
        return;
      }

      /*
       * If the deleted payment was the only
       * record on the current page, move to
       * the previous page.
       */
      if (
        payments.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage(
          (previous) => previous - 1
        );

        return;
      }

      await loadPayments();
    },
    [
      deletePayment,
      payments.length,
      currentPage,
      loadPayments,
    ]
  );

  /* ==========================================================================
     RENDER
  ========================================================================== */

  return (
    <ProtectedRoute
      allowedRoles={[
        "SUPER_ADMIN",
        "ADMIN",
      ]}
    >
      <div className="min-h-screen bg-slate-50">

        {/* ====================================================================
            NAVBAR
        ==================================================================== */}

        <AdminNavbar />

        {/* ====================================================================
            MAIN
        ==================================================================== */}

        <main className="w-full">
          <div className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-5 lg:px-6 xl:px-8">

            {!hasLoadedPayments ? (
              <PaymentSkeleton />
            ) : (
              <>
                {/* ============================================================
                    SEARCH / HEADER
                ============================================================ */}

                <PaymentSearch
                  search={search}
                  status={status}
                  onSearch={handleSearch}
                  onStatusChange={
                    handleStatusChange
                  }
                  onAddPayment={
                    handleAddPayment
                  }
                  onRefresh={
                    handleRefresh
                  }
                />

                {/* ============================================================
                    PAYMENT STATS
                ============================================================ */}

                <div className="mt-5">
                  <PaymentStats
                    payments={payments}
                  />
                </div>

                {/* ============================================================
                    PAYMENT TABLE
                ============================================================ */}

                <div className="mt-6">
                  <PaymentTable
                    payments={payments}
                    onView={handleViewPayment}
                    onEdit={handleEditPayment}
                    onDelete={handleDeletePayment}
                    onStatusChange={handlePaymentStatusChange}
                    onReminderToggle={handlePaymentReminderToggle}
                  />
                </div>

                {/* ============================================================
                    PAGINATION
                ============================================================ */}

                <PaymentPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />

                {/* ============================================================
                    TOTAL RECORDS
                ============================================================ */}

                {totalCount > 0 && (
                  <div className="mt-2 text-center text-[10px] font-medium text-slate-400">
                    {totalCount} payment
                    {totalCount === 1
                      ? ""
                      : "s"} found
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* ====================================================================
            PAYMENT FORM
        ==================================================================== */}

        {/* ====================================================================
            PAYMENT FORM
        ==================================================================== */}

        {isPaymentFormOpen && (
          paymentFormMode === "edit" ? (
            <PaymentForm
              mode="edit"
              clients={clients}
             initialData={
              selectedPayment
                ? {
                    client_id: String(
                      selectedPayment.client_id
                    ),

                    payment_month:
                      selectedPayment.payment_month,

                    amount: String(
                      selectedPayment.amount ?? 0
                    ),

                    due_date:
                      selectedPayment.due_date,

                    status:
                      selectedPayment.status,

                    enable_reminders:
                      Boolean(
                        selectedPayment.enable_reminders
                      ),

                    reminders:
                      selectedPayment.reminders?.map(
                        (reminder) => ({
                          reminder_type:
                            reminder.reminder_type,

                          enabled:
                            Boolean(
                              reminder.enabled
                            ),

                          days_offset:
                            reminder.days_offset !== null &&
                            reminder.days_offset !== undefined
                              ? String(
                                  reminder.days_offset
                                )
                              : reminder.reminder_type ===
                                  "due_day"
                                ? "0"
                                : "3",

                          message:
                            reminder.message ?? "",
                        })
                      ) ?? [],
                  }
                : undefined
            }
              onClose={
                handleClosePaymentForm
              }
              onSubmit={
                handleUpdatePayment
              }
              isLoading={isLoading}
              error={null}
            />
          ) : (
            <PaymentForm
              mode="add"
              clients={clients}
              initialData={undefined}
              onClose={
                handleClosePaymentForm
              }
              onSubmit={
                handleCreatePayment
              }
              isLoading={isLoading}
              error={null}
            />
          )
        )}

        {/* ====================================================================
            PAYMENT DETAILS MODAL
        ==================================================================== */}
        {/* ====================================================================
            PAYMENT DETAILS MODAL
        ==================================================================== */}

        <PaymentModal
          isOpen={isPaymentDetailsOpen}
          onClose={
            handleClosePaymentDetails
          }
          title="Payment Details"
          description={
            selectedPayment?.client?.name
              ? `Payment details for ${selectedPayment.client.name}`
              : "Complete payment details"
          }
        >
          {selectedPayment && (
            <PaymentDetails
              payment={selectedPayment}
            />
          )}
        </PaymentModal>
      </div>
    </ProtectedRoute>
  );
}