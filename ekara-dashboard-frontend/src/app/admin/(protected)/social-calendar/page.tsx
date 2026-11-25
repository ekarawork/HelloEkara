"use client";

import { useCallback, useEffect, useState } from "react";

import ProtectedRoute from "@/src/components/admin/auth/ProtectedRoute";
import AdminNavbar from "@/src/components/admin/AdminNavbar";

import SocialCalendarToolbar from "@/src/components/admin/social-calendar/SocialCalendarToolbar";
import SocialCalendarFilters from "@/src/components/admin/social-calendar/SocialCalendarFilters";
import SocialCalendarCalendar from "@/src/components/admin/social-calendar/SocialCalendarCalendar";
import SocialCalendarPostModal from "@/src/components/admin/social-calendar/SocialCalendarPostModal";
import SocialCalendarDetails from "@/src/components/admin/social-calendar/SocialCalendarDetails";
import SocialCalendarSkeleton from "@/src/components/admin/social-calendar/SocialCalendarSkeleton";
import SocialCalendarForm from "@/src/components/admin/social-calendar/SocialCalendarForm";

import useSocialCalendar from "@/src/hooks/admin/useSocialCalendar";
import useClient from "@/src/hooks/admin/useClient";

import {
  SocialCalendarPost,
  SocialCalendarListQuery,
  SocialCalendarPlatform,
  SocialCalendarStatus,
  SocialCalendarContentType,
  CreateSocialCalendarPostPayload,
} from "@/src/types/admin/socialCalendar.types";

import {
  SocialCalendarClientOption,
} from "@/src/components/admin/social-calendar/SocialCalendarFilters";

/* ========================= Helpers ========================= */

const getMonthStart = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getMonthEnd = (date: Date): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  );
};

/* ========================= Component ========================= */

export default function SocialCalendarPage() {
  const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    isLoading,
    error,
    clearError,
  } = useSocialCalendar();

  const {
    getClients,
  } = useClient();

  /* ========================= Calendar State ========================= */

  const [currentDate, setCurrentDate] = useState<Date>(
    getMonthStart(new Date())
  );

  /* ========================= Data State ========================= */

  const [posts, setPosts] = useState<SocialCalendarPost[]>([]);

  const [clients, setClients] = useState<
    SocialCalendarClientOption[]
  >([]);

  /* ========================= Filter State ========================= */

  const [clientId, setClientId] =
    useState<string>("");

  const [platform, setPlatform] =
    useState<SocialCalendarPlatform | "">("");

  const [status, setStatus] =
    useState<SocialCalendarStatus | "">("");

  const [contentType, setContentType] =
    useState<SocialCalendarContentType | "">("");

  /* ========================= Modal State ========================= */

  const [isPostModalOpen, setIsPostModalOpen] =
    useState<boolean>(false);

  const [isDetailsOpen, setIsDetailsOpen] =
    useState<boolean>(false);

  const [selectedPost, setSelectedPost] =
    useState<SocialCalendarPost | null>(null);
  const [selectedPostDate, setSelectedPostDate] =
    useState<string>("");

  const [isEditMode, setIsEditMode] =
    useState<boolean>(false);

  /* ========================= Load Clients ========================= */

  const loadClients = useCallback(async () => {
    const result = await getClients({
      limit: 1000,
      status: "ACTIVE",
    });

    if (result) {
      const clientOptions: SocialCalendarClientOption[] =
        result.rows.map((client) => ({
          id: client.id,
          uuid: client.uuid,
          name: client.name,
        }));

      setClients(clientOptions);
    } else {
      setClients([]);
    }
  }, [getClients]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  /* ========================= Load Posts ========================= */

  const loadPosts = useCallback(async () => {
    clearError();

    const startDate = formatDate(
      getMonthStart(currentDate)
    );

    const endDate = formatDate(
      getMonthEnd(currentDate)
    );

    const query: SocialCalendarListQuery = {
      start_date: startDate,
      end_date: endDate,
    };

    /* ========================= Client Filter ========================= */

    if (clientId) {
      query.client_id = Number(clientId);
    }

    /* ========================= Platform Filter ========================= */

    if (platform) {
      query.platform = platform;
    }

    /* ========================= Status Filter ========================= */

    if (status) {
      query.status = status;
    }

    /* ========================= Content Type Filter ========================= */

    if (contentType) {
      query.content_type = contentType;
    }

    const result = await getPosts(query);

    if (result) {
      setPosts(result.rows || []);
    } else {
      setPosts([]);
    }
  }, [
    currentDate,
    clientId,
    platform,
    status,
    contentType,
    getPosts,
    clearError,
  ]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  /* ========================= Month Navigation ========================= */

  const handlePreviousMonth = useCallback(() => {
    setCurrentDate((previousDate) => {
      return new Date(
        previousDate.getFullYear(),
        previousDate.getMonth() - 1,
        1
      );
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((previousDate) => {
      return new Date(
        previousDate.getFullYear(),
        previousDate.getMonth() + 1,
        1
      );
    });
  }, []);

  const handleToday = useCallback(() => {
    setCurrentDate(getMonthStart(new Date()));
  }, []);

  /* ========================= Reset Filters ========================= */

  const handleResetFilters = useCallback(() => {
    setClientId("");
    setPlatform("");
    setStatus("");
    setContentType("");
  }, []);

  /* ========================= Create ========================= */

const handleCreate = useCallback(
  (postDate?: string) => {
    setSelectedPost(null);
    setIsEditMode(false);

    setSelectedPostDate(
      postDate || formatDate(new Date())
    );

    setIsPostModalOpen(true);
  },
  []
);

  /* ========================= Edit ========================= */

  const handleEdit = useCallback(
    async (post: SocialCalendarPost) => {
      const data = await getPost(post.uuid);

      if (!data) {
        return;
      }

      setSelectedPost(data);
      setIsEditMode(true);
      setIsDetailsOpen(false);
      setIsPostModalOpen(true);
    },
    [getPost]
  );

  /* ========================= View Details ========================= */

  const handleView = useCallback(
    async (post: SocialCalendarPost) => {
      const data = await getPost(post.uuid);

      if (!data) {
        return;
      }

      setSelectedPost(data);
      setIsDetailsOpen(true);
    },
    [getPost]
  );


/* ========================= Delete ========================= */

const handleDelete = useCallback(
  async (post: SocialCalendarPost) => {
    const success = await deletePost(post.uuid);

    if (!success) {
      return;
    }

    setPosts((previousPosts) =>
      previousPosts.filter(
        (item) => item.uuid !== post.uuid
      )
    );

    if (selectedPost?.uuid === post.uuid) {
      setSelectedPost(null);
      setIsDetailsOpen(false);
      setIsPostModalOpen(false);
    }
  },
  [deletePost, selectedPost]
);

  /* ========================= Submit Form ========================= */

  const handleSubmit = useCallback(
    async (
      payload: CreateSocialCalendarPostPayload
    ): Promise<void> => {
      if (isEditMode && selectedPost) {
        const updatedPost = await updatePost(
          selectedPost.uuid,
          payload
        );

        if (!updatedPost) {
          return;
        }

        setIsPostModalOpen(false);
        setSelectedPost(null);
        setIsEditMode(false);

        await loadPosts();

        return;
      }

      const createdPost = await createPost(payload);

      if (!createdPost) {
        return;
      }

      setIsPostModalOpen(false);
      setSelectedPost(null);
      setIsEditMode(false);

      await loadPosts();
    },
    [
      isEditMode,
      selectedPost,
      updatePost,
      createPost,
      loadPosts,
    ]
  );

  /* ========================= Close Post Modal ========================= */

  const handleClosePostModal = useCallback(() => {
    if (isLoading) {
      return;
    }

    setIsPostModalOpen(false);
    setSelectedPost(null);
    setIsEditMode(false);
  }, [isLoading]);

  /* ========================= Close Details ========================= */

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedPost(null);
  }, []);

  /* ========================= Render ========================= */

  return (
    <ProtectedRoute
      allowedRoles={["SUPER_ADMIN", "ADMIN"]}
    >
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <AdminNavbar />

        <main className="w-full px-4 py-6 sm:px-6 lg:px-8">


          {/* ========================= CALENDAR WORKSPACE ========================= */}

<div className="grid grid-cols-1 gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">

  {/* ========================= LEFT SIDEBAR ========================= */}

  <aside className="min-w-0">
    <SocialCalendarFilters
  clients={clients}

  currentDate={currentDate}
  onDateChange={setCurrentDate}

  clientId={clientId}
  platform={platform}
  status={status}
  contentType={contentType}

  onClientChange={setClientId}
  onPlatformChange={setPlatform}
  onStatusChange={setStatus}
  onContentTypeChange={setContentType}

  onReset={handleResetFilters}
/>
  </aside>

  {/* ========================= RIGHT CALENDAR ========================= */}

  <section className="min-w-0">

    {/* ========================= TOOLBAR ========================= */}

    <div className="mb-4">
      <SocialCalendarToolbar
  currentDate={currentDate}
  onPreviousMonth={handlePreviousMonth}
  onNextMonth={handleNextMonth}
  onToday={handleToday}
  onCreatePost={handleCreate}
/>
    </div>

    {/* ========================= ERROR ========================= */}

    {error && (
      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        {error}
      </div>
    )}

    {/* ========================= CALENDAR ========================= */}

    {isLoading && posts.length === 0 ? (
      <SocialCalendarSkeleton />
    ) : (
      <SocialCalendarCalendar
        currentDate={currentDate}
        posts={posts}
        onAddPost={handleCreate}
        onViewPost={handleView}
        onEditPost={handleEdit}
        onDeletePost={handleDelete}
      />
    )}
  </section>
</div>
        </main>

        {/* ========================= CREATE / EDIT MODAL ========================= */}

        <SocialCalendarPostModal
          open={isPostModalOpen}
          onClose={handleClosePostModal}
          title={
            isEditMode
              ? "Edit Social Post"
              : "Create Social Post"
          }
        >
         <SocialCalendarForm
          mode={isEditMode ? "edit" : "create"}
          post={selectedPost}
          clients={clients}
          isLoading={isLoading}
          defaultPostDate={selectedPostDate}
          onSubmit={handleSubmit}
          onCancel={handleClosePostModal}
        />
        </SocialCalendarPostModal>

        {/* ========================= DETAILS ========================= */}

        {/* ========================= DETAILS MODAL ========================= */}

        <SocialCalendarPostModal
          open={isDetailsOpen}
          onClose={handleCloseDetails}
          title="Social Post Details"
          isLoading={isLoading}
        >
          {selectedPost && (
            <SocialCalendarDetails
              post={selectedPost}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          )}
        </SocialCalendarPostModal>
      </div>
    </ProtectedRoute>
  );
}