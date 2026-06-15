import { baseApi } from "../base-api";
import { PaginatedResponse } from "../base-types";

export interface BaseResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ReviewUser {
  id: string;
  name: string;
  email?: string;
}

export interface ReviewProduct {
  id: string;
  name: string;
  slug: string;
  images?: Array<{
    id: string;
    media: {
      url: string;
      altText: string | null;
    };
  }>;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
  product?: ReviewProduct;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment: string;
}

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<BaseResponse<PaginatedResponse<Review>>, { productId: string; page?: number; limit?: number }>({
      query: ({ productId, page = 1, limit = 10 }) => `/reviews/product/${productId}?page=${page}&limit=${limit}`,
      providesTags: ["Reviews"],
    }),
    createReview: builder.mutation<BaseResponse<Review>, CreateReviewPayload>({
      query: (body) => ({
        url: "/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reviews"],
    }),
    getAdminAllReviews: builder.query<BaseResponse<PaginatedResponse<Review>>, { page?: number; limit?: number; search?: string; rating?: number }>({
      query: ({ page = 1, limit = 10, search = "", rating }) => {
        let url = `/reviews/admin/get-all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
        if (rating !== undefined && rating > 0) {
          url += `&rating=${rating}`;
        }
        return url;
      },
      providesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation<BaseResponse<{ success: boolean }>, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useGetAdminAllReviewsQuery,
  useDeleteReviewMutation,
} = reviewsApi;
