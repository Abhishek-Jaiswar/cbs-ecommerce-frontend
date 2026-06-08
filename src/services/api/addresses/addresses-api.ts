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

    getMyAddresses: builder.query<BaseResponse<Address[]>, void>({
      query: () => "/addresses",
      providesTags: ["Addresses"],
    }),

    createAddress: builder.mutation<BaseResponse<Address>, Partial<Address>>({
      query: (body) => ({
        url: "/addresses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Addresses"],
    }),

    deleteAddress: builder.mutation<BaseResponse<void>, string>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Addresses"],
    }),

    updateAddress: builder.mutation<BaseResponse<Address>, { id: string; body: Partial<Address> }>({
      query: ({ id, body }) => ({
        url: `/addresses/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Addresses"],
    }),
  }),
});

export const {
  useGetAllAddressesQuery,
  useGetMyAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressesApi;
