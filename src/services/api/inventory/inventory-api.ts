import { baseApi } from "../base-api";

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventory: builder.query<any, { page: number; limit: number; search?: string; stockStatus?: string }>({
      query: (params) => ({
        url: "/inventory",
        params,
      }),
      providesTags: ["Products", "ProductDetails"],
    }),

    updateInventory: builder.mutation<any, { variantId: string; body: { price: number | null; stock: number } }>({
      query: ({ variantId, body }) => ({
        url: `/inventory/${variantId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Products", "ProductDetails"],
    }),

    adjustStock: builder.mutation<any, { variantId: string; warehouseId?: string; qtyChange: number; type: string; reason?: string }>({
      query: (body) => ({
        url: "/inventory/adjust",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products", "ProductDetails", "Transactions"],
    }),

    getTransactions: builder.query<any, { page: number; limit: number; type?: string; variantId?: string }>({
      query: (params) => ({
        url: "/inventory/transactions",
        params,
      }),
      providesTags: ["Transactions"],
    }),

    getSuppliers: builder.query<any, void>({
      query: () => "/inventory/suppliers",
      providesTags: ["Suppliers"],
    }),

    createSupplier: builder.mutation<any, { name: string; contactName?: string; email: string; phone?: string; address?: string }>({
      query: (body) => ({
        url: "/inventory/suppliers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Suppliers"],
    }),

    updateSupplier: builder.mutation<any, { id: string; body: { name?: string; contactName?: string | null; email?: string; phone?: string | null; address?: string | null; status?: string } }>({
      query: ({ id, body }) => ({
        url: `/inventory/suppliers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Suppliers"],
    }),

    getPurchaseOrders: builder.query<any, { page: number; limit: number }>({
      query: (params) => ({
        url: "/inventory/purchase-orders",
        params,
      }),
      providesTags: ["PurchaseOrders"],
    }),

    getPurchaseOrderById: builder.query<any, string>({
      query: (id) => `/inventory/purchase-orders/${id}`,
      providesTags: ["PurchaseOrders"],
    }),

    createPurchaseOrder: builder.mutation<any, { supplierId: string; notes?: string; items: { variantId: string; quantityOrdered: number; unitCost: number }[] }>({
      query: (body) => ({
        url: "/inventory/purchase-orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PurchaseOrders"],
    }),

    updatePurchaseOrderStatus: builder.mutation<
      any,
      { id: string; status: "DRAFT" | "SENT" | "CANCELLED"; email?: string; subject?: string; customNotes?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/inventory/purchase-orders/${id}/status`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PurchaseOrders"],
    }),

    receivePurchaseOrder: builder.mutation<any, { poId: string; items: { variantId: string; quantityReceived: number }[] }>({
      query: ({ poId, items }) => ({
        url: `/inventory/purchase-orders/${poId}/receive`,
        method: "POST",
        body: { items },
      }),
      invalidatesTags: ["Products", "ProductDetails", "PurchaseOrders", "Transactions"],
    }),

    getWarehouses: builder.query<any, void>({
      query: () => "/inventory/warehouses",
      providesTags: ["Warehouses"],
    }),

    createWarehouse: builder.mutation<any, { name: string; code: string; addressLine: string; city: string; state: string; postalCode: string; country: string }>({
      query: (body) => ({
        url: "/inventory/warehouses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Warehouses"],
    }),

    updateWarehouse: builder.mutation<any, { id: string; body: { name?: string; code?: string; addressLine?: string; city?: string; state?: string; postalCode?: string; country?: string; status?: string } }>({
      query: ({ id, body }) => ({
        url: `/inventory/warehouses/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Warehouses"],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useUpdateInventoryMutation,
  useAdjustStockMutation,
  useGetTransactionsQuery,
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useGetPurchaseOrdersQuery,
  useGetPurchaseOrderByIdQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderStatusMutation,
  useReceivePurchaseOrderMutation,
  useGetWarehousesQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
} = inventoryApi;
