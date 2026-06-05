import { baseApi } from "../base-api";
import { BaseResponse } from "../auth/auth-api";

export interface Address {
  id: string;
  fullname: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const addressesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAddresses: builder.query<
      BaseResponse<{ items: Address[]; total: number; page: number; limit: number; totalPages: number }>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        if (params) {
          const { page = 1, limit = 10 } = params;
          return `/addresses/admin/get-all?page=${page}&limit=${limit}`;
        }
        return "/addresses/admin/get-all?limit=1000";
      },
      providesTags: ["Addresses"],
    }),

    deleteAddress: builder.mutation<BaseResponse<void>, string>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Addresses"],
    }),
  }),
});

export const {
  useGetAllAddressesQuery,
  useDeleteAddressMutation,
} = addressesApi;
