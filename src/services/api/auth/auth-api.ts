import { baseApi } from "../base-api";

export interface BaseResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface OtpRequestPayload {
  email: string;
}

export interface OtpVerifyPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword?: string;
}

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
    }),

    logout: builder.mutation<BaseResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    me: builder.query<BaseResponse<User>, void>({
      query: () => "/auth/get-me",
    }),

    requestEmailOtp: builder.mutation<BaseResponse, OtpRequestPayload>({
      query: (payload) => ({
        url: "/auth/email-verification/request-otp",
        method: "POST",
        body: payload,
      }),
    }),

    verifyEmailOtp: builder.mutation<BaseResponse<{ email: string; verified: boolean }>, OtpVerifyPayload>({
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

    verifyPasswordResetOtp: builder.mutation<BaseResponse<{ email: string; verified: boolean }>, OtpVerifyPayload>({
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
  }),
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
} = authApi;
