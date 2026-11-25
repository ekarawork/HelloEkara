"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import ClientNavbar from "@/src/components/client/ClientNavbar";
import ClientPortalGuard from "@/src/components/admin/auth/ClientPortalGuard";

import SocialCalendarToolbar from "@/src/components/client/social-calendar/SocialCalendarToolbar";
import SocialCalendarFilters from "@/src/components/client/social-calendar/SocialCalendarFilters";
import SocialCalendarCalendar from "@/src/components/client/social-calendar/SocialCalendarCalendar";
import SocialCalendarPostDetails from "@/src/components/client/social-calendar/SocialCalendarPostDetails";
import SocialCalendarSkeleton from "@/src/components/client/social-calendar/SocialCalendarSkeleton";
import SocialCalendarEmpty from "@/src/components/client/social-calendar/SocialCalendarEmpty";

import useSocialCalendar from "@/src/hooks/client/useSocialCalendar";

import {
  ClientSocialCalendarPost,
  SocialCalendarContentType,
  SocialCalendarPlatform,
  SocialCalendarStatus,
} from "@/src/types/client/socialCalendar.types";

/* ========================= Helpers ========================= */

const getMonthStart = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}-01`;
};

const getMonthEnd = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const lastDay = new Date(
    year,
    month + 1,
    0
  ).getDate();

  return `${year}-${String(month + 1).padStart(
    2,
    "0"
  )}-${String(lastDay).padStart(2, "0")}`;
};

/* ========================= Page ========================= */

export default function ClientSocialCalendarPage() {
  const [currentDate, setCurrentDate] =
    useState<Date>(new Date());

  const [platform, setPlatform] =
    useState<SocialCalendarPlatform | undefined>(
      undefined
    );

  const [status, setStatus] =
    useState<SocialCalendarStatus | undefined>(
      undefined
    );

  const [contentType, setContentType] =
    useState<
      SocialCalendarContentType | undefined
    >(undefined);

  const [selectedPost, setSelectedPost] =
    useState<ClientSocialCalendarPost | null>(
      null
    );

  const [isDetailsOpen, setIsDetailsOpen] =
    useState<boolean>(false);

  const {
    getSocialCalendarDashboard,
    isLoading,
    error,
    clearError,
  } = useSocialCalendar();

  /* ========================= Month Range ========================= */

  const monthRange = useMemo(() => {
    return {
      startDate: getMonthStart(currentDate),
      endDate: getMonthEnd(currentDate),
    };
  }, [currentDate]);

  /* ========================= Fetch Calendar ========================= */

  const fetchCalendar = useCallback(
    async () => {
      await getSocialCalendarDashboard({
        startDate: monthRange.startDate,
        endDate: monthRange.endDate,
        platform,
        status,
        contentType,
      });
    },
    [
      getSocialCalendarDashboard,
      monthRange.startDate,
      monthRange.endDate,
      platform,
      status,
      contentType,
    ]
  );

  /* ========================= Initial / Filter / Month Fetch ========================= */

  useEffect(() => {
    void fetchCalendar();
  }, [fetchCalendar]);

  /* ========================= Month Navigation ========================= */

  const handlePreviousMonth = useCallback(() => {
    clearError();

    setCurrentDate((previousDate) => {
      return new Date(
        previousDate.getFullYear(),
        previousDate.getMonth() - 1,
        1
      );
    });
  }, [clearError]);

  const handleNextMonth = useCallback(() => {
    clearError();

    setCurrentDate((previousDate) => {
      return new Date(
        previousDate.getFullYear(),
        previousDate.getMonth() + 1,
        1
      );
    });
  }, [clearError]);

  const handleToday = useCallback(() => {
    clearError();

    setCurrentDate(new Date());
  }, [clearError]);

  /* ========================= Refresh ========================= */

  const handleRefresh = useCallback(() => {
    void fetchCalendar();
  }, [fetchCalendar]);

  /* ========================= Filters ========================= */

  const handlePlatformChange = useCallback(
    (value?: SocialCalendarPlatform) => {
      clearError();
      setPlatform(value);
    },
    [clearError]
  );

  const handleStatusChange = useCallback(
    (value?: SocialCalendarStatus) => {
      clearError();
      setStatus(value);
    },
    [clearError]
  );

  const handleContentTypeChange =
    useCallback(
      (
        value?: SocialCalendarContentType
      ) => {
        clearError();
        setContentType(value);
      },
      [clearError]
    );

  const handleResetFilters = useCallback(() => {
    clearError();

    setPlatform(undefined);
    setStatus(undefined);
    setContentType(undefined);
  }, [clearError]);

  /* ========================= Active Filters ========================= */

  const hasActiveFilters =
    Boolean(platform) ||
    Boolean(status) ||
    Boolean(contentType);

  /* ========================= Posts ========================= */

  /*
   * The hook returns the fetched data directly.
   * Keep the page-level post state so the calendar
   * can remain controlled by the fetched response.
   */

  const [posts, setPosts] = useState<
    ClientSocialCalendarPost[]
  >([]);

  const loadCalendarData = useCallback(
    async () => {
      const data =
        await getSocialCalendarDashboard({
          startDate: monthRange.startDate,
          endDate: monthRange.endDate,
          platform,
          status,
          contentType,
        });

      if (data) {
        setPosts(data.rows);
      } else {
        setPosts([]);
      }
    },
    [
      getSocialCalendarDashboard,
      monthRange.startDate,
      monthRange.endDate,
      platform,
      status,
      contentType,
    ]
  );

  /*
   * Use one data-loading flow for the actual page data.
   * This keeps refresh, month changes and filters consistent.
   */

  useEffect(() => {
    void loadCalendarData();
  }, [loadCalendarData]);

  /* ========================= Post Details ========================= */

  const handlePostClick = useCallback(
    (post: ClientSocialCalendarPost) => {
      setSelectedPost(post);
      setIsDetailsOpen(true);
    },
    []
  );

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedPost(null);
  }, []);

  /* ========================= Render ========================= */

  return (
    <ClientPortalGuard>
        <div className="min-h-screen bg-slate-50">
          <ClientNavbar />

          <main className="w-full bg-slate-50">
            {/* ========================= HEADER ========================= */}

            <header className="w-full px-4 pt-5 sm:px-5 lg:px-6 lg:pt-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                  Social Calendar
                </h1>

                <p className="text-xs text-slate-500 sm:text-sm">
                  View your social media posting schedule
                  and planned content.
                </p>
              </div>
            </header>

            {/* ========================= CONTENT ========================= */}

            <section className="w-full px-4 pb-6 pt-5 sm:px-5 lg:px-6 lg:pt-6">
              <div className="space-y-5">
                {/* ========================= ERROR ========================= */}

                {error && !isLoading && (
                  <div className="flex w-full items-start justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold text-red-700">
                        Failed to load Social Calendar
                      </p>

                      <p className="mt-0.5 text-[11px] leading-5 text-red-600">
                        {error}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRefresh}
                      className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[10px] font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* ========================= TOOLBAR ========================= */}

                <SocialCalendarToolbar
                  currentDate={currentDate}
                  isLoading={isLoading}
                  onPreviousMonth={
                    handlePreviousMonth
                  }
                  onNextMonth={handleNextMonth}
                  onToday={handleToday}
                  onRefresh={handleRefresh}
                />

                {/* ========================= LOADING ========================= */}

                {isLoading && posts.length === 0 ? (
                  <SocialCalendarSkeleton />
                ) : (
                  <>
                    {/* ========================= FILTERS ========================= */}

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                    {/* ========================= LEFT SIDEBAR ========================= */}

                    <SocialCalendarFilters
                      currentDate={currentDate}
                      onDateChange={setCurrentDate}
                      platform={platform}
                      status={status}
                      contentType={contentType}
                      onPlatformChange={handlePlatformChange}
                      onStatusChange={handleStatusChange}
                      onContentTypeChange={handleContentTypeChange}
                      onReset={handleResetFilters}
                    />

                    {/* ========================= RIGHT CALENDAR ========================= */}

                    <div className="min-w-0 flex-1">
                      {posts.length > 0 ? (
                        <SocialCalendarCalendar
                          currentDate={currentDate}
                          posts={posts}
                          onViewPost={handlePostClick}
                        />
                      ) : (
                        <SocialCalendarEmpty
                          hasFilters={hasActiveFilters}
                          onReset={
                            hasActiveFilters
                              ? handleResetFilters
                              : undefined
                          }
                        />
                      )}
                    </div>
                  </div>
                  </>
                )}
              </div>
            </section>
          </main>

          {/* ========================= POST DETAILS MODAL ========================= */}

          {isDetailsOpen &&
            selectedPost && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-[2px]"
                onMouseDown={(event) => {
                  if (
                    event.target ===
                    event.currentTarget
                  ) {
                    handleCloseDetails();
                  }
                }}
              >
                <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  {/* ========================= MODAL HEADER ========================= */}

                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                        Post Details
                      </h2>

                      <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">
                        View social media post information
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleCloseDetails
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2E3192]/10"
                      aria-label="Close post details"
                    >
                      <span className="text-lg leading-none">
                        ×
                      </span>
                    </button>
                  </div>

                  {/* ========================= MODAL CONTENT ========================= */}

                  <div className="task-scroll max-h-[calc(90vh-73px)] overflow-y-auto px-5 py-5">
                    <SocialCalendarPostDetails
                        post={selectedPost}
                    />
                </div>
                </div>
              </div>
            )}
        </div>
    </ClientPortalGuard>
  );
}