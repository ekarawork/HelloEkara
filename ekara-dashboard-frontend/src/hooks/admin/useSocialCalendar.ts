"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { socialCalendarService } from "@/src/services/admin/socialCalendar.service";

import {
  CreateSocialCalendarPostPayload,
  SocialCalendarPost,
  SocialCalendarListQuery,
  SocialCalendarListResponseData,
  UpdateSocialCalendarPostPayload,
} from "@/src/types/admin/socialCalendar.types";

interface UseSocialCalendarReturn {
  createPost: (
    payload: CreateSocialCalendarPostPayload
  ) => Promise<SocialCalendarPost | null>;

  getPosts: (
    query?: SocialCalendarListQuery
  ) => Promise<SocialCalendarListResponseData | null>;

  getPost: (
    postUuid: string
  ) => Promise<SocialCalendarPost | null>;

  updatePost: (
    postUuid: string,
    payload: UpdateSocialCalendarPostPayload
  ) => Promise<SocialCalendarPost | null>;

  deletePost: (
    postUuid: string
  ) => Promise<boolean>;

  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

// Error Helper
const getErrorMessage = (
  error: unknown,
  fallbackMessage: string
): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

// Hook
const useSocialCalendar = (): UseSocialCalendarReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ========================= Create Post =========================

  const createPost = useCallback(
    async (
      payload: CreateSocialCalendarPostPayload
    ): Promise<SocialCalendarPost | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await socialCalendarService.createPost(
          payload
        );

        toast.success("Post created successfully", {
          description:
            "The social calendar post has been added successfully.",
        });

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to create post. Please try again."
        );

        setError(message);

        toast.error("Post creation failed", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ========================= Get Posts =========================

  const getPosts = useCallback(
    async (
      query?: SocialCalendarListQuery
    ): Promise<SocialCalendarListResponseData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await socialCalendarService.getPosts(
          query
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch social calendar posts."
        );

        setError(message);

        toast.error("Failed to load posts", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ========================= Get Post Details =========================

  const getPost = useCallback(
    async (
      postUuid: string
    ): Promise<SocialCalendarPost | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await socialCalendarService.getPost(
          postUuid
        );

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to fetch social calendar post details."
        );

        setError(message);

        toast.error("Failed to load post", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ========================= Update Post =========================

  const updatePost = useCallback(
    async (
      postUuid: string,
      payload: UpdateSocialCalendarPostPayload
    ): Promise<SocialCalendarPost | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await socialCalendarService.updatePost(
          postUuid,
          payload
        );

        toast.success("Post updated successfully", {
          description:
            "The social calendar post has been updated successfully.",
        });

        return data;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to update social calendar post."
        );

        setError(message);

        toast.error("Post update failed", {
          description: message,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ========================= Delete Post =========================

  const deletePost = useCallback(
    async (
      postUuid: string
    ): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        await socialCalendarService.deletePost(postUuid);

        toast.success("Post deleted successfully", {
          description:
            "The social calendar post has been permanently deleted.",
        });

        return true;
      } catch (error: unknown) {
        const message = getErrorMessage(
          error,
          "Unable to delete social calendar post."
        );

        setError(message);

        toast.error("Post deletion failed", {
          description: message,
        });

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ========================= Clear Error =========================

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // ========================= Return =========================

  return {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    isLoading,
    error,
    clearError,
  };
};

export default useSocialCalendar;