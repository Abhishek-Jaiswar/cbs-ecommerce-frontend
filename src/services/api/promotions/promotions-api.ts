import { baseApi } from "../base-api";
import type {
  ICoupon,
  IOffer,
  ICouponRedemption,
  IPaginatedResponse,
  ISingleResponse,
  IValidateCouponPayload,
  IValidateCouponResult,
} from "./promotions-api.types";

export const promotionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Coupons
    getCoupons: builder.query<IPaginatedResponse<ICoupon>, { page: number; limit: number }>({
      query: ({ page, limit }) => `/coupons?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Coupons" as const, id })),
              { type: "Coupons", id: "LIST" },
            ]
          : [{ type: "Coupons", id: "LIST" }],
    }),

    getCouponById: builder.query<ISingleResponse<ICoupon>, string>({
      query: (id) => `/coupons/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Coupons", id }],
    }),

    createCoupon: builder.mutation<ISingleResponse<ICoupon>, Partial<ICoupon>>({
      query: (body) => ({
        url: "/coupons",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Coupons", id: "LIST" }],
    }),

    updateCoupon: builder.mutation<ISingleResponse<ICoupon>, { id: string; body: Partial<ICoupon> }>({
      query: ({ id, body }) => ({
        url: `/coupons/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Coupons", id },
        { type: "Coupons", id: "LIST" },
      ],
    }),

    toggleCouponStatus: builder.mutation<ISingleResponse<ICoupon>, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/coupons/${id}/status`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Coupons", id },
        { type: "Coupons", id: "LIST" },
      ],
    }),

    deleteCoupon: builder.mutation<ISingleResponse<void>, string>({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Coupons", id: "LIST" }],
    }),

    validateCoupon: builder.mutation<ISingleResponse<IValidateCouponResult>, IValidateCouponPayload>({
      query: (body) => ({
        url: "/coupons/validate",
        method: "POST",
        body,
      }),
    }),

    // Coupon Redemptions
    getCouponRedemptions: builder.query<IPaginatedResponse<ICouponRedemption>, { page: number; limit: number }>({
      query: ({ page, limit }) => `/coupons/redemptions?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Redemptions" as const, id })),
              { type: "Redemptions", id: "LIST" },
            ]
          : [{ type: "Redemptions", id: "LIST" }],
    }),

    // Offers
    getOffers: builder.query<IPaginatedResponse<IOffer>, { page: number; limit: number }>({
      query: ({ page, limit }) => `/offers?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Offers" as const, id })),
              { type: "Offers", id: "LIST" },
            ]
          : [{ type: "Offers", id: "LIST" }],
    }),

    getOfferById: builder.query<ISingleResponse<IOffer>, string>({
      query: (id) => `/offers/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Offers", id }],
    }),

    createOffer: builder.mutation<ISingleResponse<IOffer>, Partial<IOffer> & { productIds?: string[]; categoryIds?: string[] }>({
      query: (body) => ({
        url: "/offers",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Offers", id: "LIST" }],
    }),

    updateOffer: builder.mutation<ISingleResponse<IOffer>, { id: string; body: Partial<IOffer> & { productIds?: string[]; categoryIds?: string[] } }>({
      query: ({ id, body }) => ({
        url: `/offers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Offers", id },
        { type: "Offers", id: "LIST" },
      ],
    }),

    toggleOfferStatus: builder.mutation<ISingleResponse<IOffer>, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/offers/${id}/status`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Offers", id },
        { type: "Offers", id: "LIST" },
      ],
    }),

    deleteOffer: builder.mutation<ISingleResponse<void>, string>({
      query: (id) => ({
        url: `/offers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Offers", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useToggleCouponStatusMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation,
  useGetCouponRedemptionsQuery,
  useGetOffersQuery,
  useGetOfferByIdQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useToggleOfferStatusMutation,
  useDeleteOfferMutation,
} = promotionsApi;
