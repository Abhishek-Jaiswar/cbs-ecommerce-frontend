import { baseApi } from "../base-api";
import {
  BaseResponse,
  LoginPayload,
  OtpRequestPayload,
  OtpVerifyPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from "./auth-api.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<BaseResponse<User>, RegisterPayload>({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
    }),

    login: builder.mutation<BaseResponse<User>, LoginPayload>({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Users", "Cart", "Wishlist"],
    }),

    logout: builder.mutation<BaseResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Users", "Cart", "Wishlist"],
    }),

    me: builder.query<BaseResponse<User>, void>({
      query: () => "/auth/get-me",
      providesTags: ["Users"],
    }),

    requestEmailOtp: builder.mutation<BaseResponse, OtpRequestPayload>({
      query: (payload) => ({
        url: "/auth/email-verification/request-otp",
        method: "POST",
        body: payload,
      }),
    }),

    verifyEmailOtp: builder.mutation<
      BaseResponse<User & { verified: boolean }>,
      OtpVerifyPayload
    >({
      query: (payload) => ({
        url: "/auth/email-verification/verify-otp",
        method: "POST",
        body: payload,
      }),
    }),

    requestPasswordResetOtp: builder.mutation<BaseResponse, OtpRequestPayload>({
      query: (payload) => ({
        url: "/auth/forgot-password/request-otp",
        method: "POST",
        body: payload,
      }),
    }),

    verifyPasswordResetOtp: builder.mutation<
      BaseResponse<{ email: string; verified: boolean }>,
      OtpVerifyPayload
    >({
      query: (payload) => ({
        url: "/auth/forgot-password/verify-otp",
        method: "POST",
        body: payload,
      }),
    }),

    resetPassword: builder.mutation<BaseResponse<User>, ResetPasswordPayload>({
      query: (payload) => ({
        url: "/auth/forgot-password/reset-password",
        method: "PUT",
        body: payload,
      }),
    }),

    getUsers: builder.query<
      BaseResponse<{
        items: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        if (params) {
          const { page = 1, limit = 10 } = params;
          return `/auth/get-all?page=${page}&limit=${limit}`;
        }
        return "/auth/get-all?limit=1000";
      },
      providesTags: ["Users"],
    }),

    getUserById: builder.query<
      BaseResponse<User & { addresses: any[] }>,
      string
    >({
      query: (id) => `/auth/${id}`,
      providesTags: ["Users"],
    }),

    updateUserRole: builder.mutation<
      BaseResponse<User>,
      { id: string; role: "USER" | "ADMIN" }
    >({
      query: ({ id, role }) => ({
        url: `/auth/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation<BaseResponse<void>, string>({
      query: (id) => ({
        url: `/auth/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useRegisterMutation,
  useRequestEmailOtpMutation,
  useVerifyEmailOtpMutation,
  useRequestPasswordResetOtpMutation,
  useVerifyPasswordResetOtpMutation,
  useResetPasswordMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = authApi;
