import { socialCalendarApi } from "@/src/api/admin/socialCalendar.api";

import {
  CreateSocialCalendarPostPayload,
  SocialCalendarPost,
  SocialCalendarListQuery,
  SocialCalendarListResponseData,
  UpdateSocialCalendarPostPayload,
} from "@/src/types/admin/socialCalendar.types";

// Create Social Calendar Post
const createPost = async (
  payload: CreateSocialCalendarPostPayload
): Promise<SocialCalendarPost> => {
  const response = await socialCalendarApi.createPost(payload);

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Social calendar post creation failed."
    );
  }

  return response.data;
};

// Get All Social Calendar Posts
const getPosts = async (
  query?: SocialCalendarListQuery
): Promise<SocialCalendarListResponseData> => {
  const response = await socialCalendarApi.getPosts(query);

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Failed to fetch social calendar posts."
    );
  }

  return response.data;
};

// Get Social Calendar Post Details
const getPost = async (
  postUuid: string
): Promise<SocialCalendarPost> => {
  const response = await socialCalendarApi.getPost(postUuid);

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Failed to fetch social calendar post details."
    );
  }

  return response.data;
};

// Update Social Calendar Post
const updatePost = async (
  postUuid: string,
  payload: UpdateSocialCalendarPostPayload
): Promise<SocialCalendarPost> => {
  const response = await socialCalendarApi.updatePost(
    postUuid,
    payload
  );

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Social calendar post update failed."
    );
  }

  return response.data;
};

// Permanently Delete Social Calendar Post
const deletePost = async (
  postUuid: string
): Promise<boolean> => {
  const response = await socialCalendarApi.deletePost(postUuid);

  if (!response.success) {
    throw new Error(
      response.message || "Social calendar post deletion failed."
    );
  }

  return true;
};

// Export
export const socialCalendarService = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};