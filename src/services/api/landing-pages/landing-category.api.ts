import { baseApi } from "../base-api";
import { BaseResponse } from "../auth/auth-api.types";

export interface LandingCategory {
  id: string;
  categoryId: string;
  label: string;
  image: string;
  storageKey: string;
  slot: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export const landingCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveLandingCategories: builder.query<BaseResponse<LandingCategory[]>, void>({
      query: () => "/landing-categories/active",
      providesTags: ["LandingCategories" as any],
    }),

    getAllLandingCategories: builder.query<BaseResponse<LandingCategory[]>, void>({
      query: () => "/landing-categories",
      providesTags: ["LandingCategories" as any],
    }),

    createLandingCategory: builder.mutation<BaseResponse<LandingCategory>, FormData>({
      query: (body) => ({
        url: "/landing-categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LandingCategories" as any],
    }),

    updateLandingCategory: builder.mutation<
      BaseResponse<LandingCategory>,
      { id: string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/landing-categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["LandingCategories" as any],
    }),

    updateLandingCategoryStatus: builder.mutation<
      BaseResponse<LandingCategory>,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/landing-categories/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["LandingCategories" as any],
    }),

    deleteLandingCategory: builder.mutation<BaseResponse<{ success: boolean; message: string }>, string>({
      query: (id) => ({
        url: `/landing-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LandingCategories" as any],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetActiveLandingCategoriesQuery,
  useGetAllLandingCategoriesQuery,
  useCreateLandingCategoryMutation,
  useUpdateLandingCategoryMutation,
  useUpdateLandingCategoryStatusMutation,
  useDeleteLandingCategoryMutation,
} = landingCategoryApi;
