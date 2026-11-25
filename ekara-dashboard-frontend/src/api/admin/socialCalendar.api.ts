import axiosInstance from "@/src/lib/axios";

import {
  CreateSocialCalendarPostPayload,
  CreateSocialCalendarPostResponse,
  GetSocialCalendarPostResponse,
  GetSocialCalendarPostsResponse,
  UpdateSocialCalendarPostPayload,
  UpdateSocialCalendarPostResponse,
  DeleteSocialCalendarPostResponse,
  SocialCalendarListQuery,
} from "@/src/types/admin/socialCalendar.types";

// Create Social Calendar Post
const createPost = async (
  payload: CreateSocialCalendarPostPayload
): Promise<CreateSocialCalendarPostResponse> => {
  const response =
    await axiosInstance.post<CreateSocialCalendarPostResponse>(
      "/admin/social-calendar/create",
      payload
    );

  return response.data;
};

// Get All Social Calendar Posts
const getPosts = async (
  query: SocialCalendarListQuery = {}
): Promise<GetSocialCalendarPostsResponse> => {
  const response =
    await axiosInstance.get<GetSocialCalendarPostsResponse>(
      "/admin/social-calendar/list",
      {
        params: query,
      }
    );

  return response.data;
};

// Get Single Social Calendar Post
const getPost = async (
  postUuid: string
): Promise<GetSocialCalendarPostResponse> => {
  const response =
    await axiosInstance.get<GetSocialCalendarPostResponse>(
      `/admin/social-calendar/list/${postUuid}`
    );

  return response.data;
};

// Update Social Calendar Post
const updatePost = async (
  postUuid: string,
  payload: UpdateSocialCalendarPostPayload
): Promise<UpdateSocialCalendarPostResponse> => {
  const response =
    await axiosInstance.patch<UpdateSocialCalendarPostResponse>(
      `/admin/social-calendar/update/${postUuid}`,
      payload
    );

  return response.data;
};

// Permanently Delete Social Calendar Post
const deletePost = async (
  postUuid: string
): Promise<DeleteSocialCalendarPostResponse> => {
  const response =
    await axiosInstance.delete<DeleteSocialCalendarPostResponse>(
      `/admin/social-calendar/delete/${postUuid}`
    );

  return response.data;
};

// Export
export const socialCalendarApi = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};