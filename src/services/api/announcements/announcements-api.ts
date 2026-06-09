import { baseApi } from "../base-api";
import { PaginatedResponse } from "../base-types";

export interface BaseResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

export interface IAnnouncement {
  id: string;
  text: string;
  link: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementPayload {
  text: string;
  link?: string | null;
  isActive?: boolean;
}

export interface UpdateAnnouncementPayload {
  text?: string;
  link?: string | null;
  isActive?: boolean;
}

export const announcementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveAnnouncements: builder.query<BaseResponse<IAnnouncement[]>, void>({
      query: () => "/announcements",
      providesTags: ["Announcements"],
    }),

    getAdminAnnouncements: builder.query<BaseResponse<PaginatedResponse<IAnnouncement>>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => `/announcements/admin?page=${page}&limit=${limit}`,
      providesTags: ["Announcements"],
    }),

    getAnnouncementById: builder.query<BaseResponse<IAnnouncement>, string>({
      query: (id) => `/announcements/${id}`,
      providesTags: ["Announcements"],
    }),

    createAnnouncement: builder.mutation<BaseResponse<IAnnouncement>, CreateAnnouncementPayload>({
      query: (body) => ({
        url: "/announcements",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Announcements"],
    }),

    updateAnnouncement: builder.mutation<BaseResponse<IAnnouncement>, { id: string; body: UpdateAnnouncementPayload }>({
      query: ({ id, body }) => ({
        url: `/announcements/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Announcements"],
    }),

    deleteAnnouncement: builder.mutation<BaseResponse<{ success: boolean }>, string>({
      query: (id) => ({
        url: `/announcements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Announcements"],
    }),
  }),
});

export const {
  useGetActiveAnnouncementsQuery,
  useGetAdminAnnouncementsQuery,
  useGetAnnouncementByIdQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementsApi;
