import { baseApi } from "./base-api";

export interface BaseResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

export interface OrderItem {
  id: string;
  productId: string | null;
  variantId: string | null;
  name: string;
  sku: string | null;
  image: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  orderId: string;
  appliedOfferId?: string | null;
  appliedOfferName?: string | null;
  offerDiscountAmount?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: "RAZORPAY" | "COD";
  method: string;
  status: "PENDING" | "AUTHORIZED" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  amount: string;
  currency: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt?: string | null;
  capturedAt?: string | null;
  failedAt?: string | null;
  order?: {
    orderNumber: string;
    fullname: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "ON_HOLD" | "PARTIALLY_SHIPPED" | "RETURNED" | "FAILED";
  paymentStatus: "PENDING" | "AUTHORIZED" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  currency: string;
  subtotalAmount: string;
  shippingAmount: string;
  taxAmount: string;
  discountAmount: string;
  totalAmount: string;
  trackingNumber: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  fullname: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  payments?: Payment[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation<
      BaseResponse<{ order: Order; payment: Payment; razorpayOrder?: any }>,
      any
    >({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart", "Orders"],
    }),
    verifyPayment: builder.mutation<BaseResponse<Order>, any>({
      query: (body) => ({
        url: "/payments/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart", "Orders", "Payments"],
    }),
    getMyOrders: builder.query<BaseResponse<PaginatedResponse<Order>>, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/orders/mine",
        params,
      }),
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query<BaseResponse<Order>, string>({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: ["Orders"],
    }),
    getOrders: builder.query<BaseResponse<PaginatedResponse<Order>>, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/orders",
        params,
      }),
      providesTags: ["Orders"],
    }),
    updateOrderStatus: builder.mutation<BaseResponse<Order>, { orderId: string; status: string; trackingNumber?: string }>({
      query: ({ orderId, ...body }) => ({
        url: `/orders/${orderId}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
    getPayments: builder.query<BaseResponse<PaginatedResponse<Payment>>, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/payments",
        params,
      }),
      providesTags: ["Payments"],
    }),
    cancelOrder: builder.mutation<BaseResponse<Order>, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Orders", "Cart"],
    }),
  }),
  overrideExisting: true,
});

export const {
  usePlaceOrderMutation,
  useVerifyPaymentMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetPaymentsQuery,
  useCancelOrderMutation,
} = checkoutApi;
