import { baseApi } from "../base-api";

export interface BaseResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

export interface Media {
  id: string;
  url: string;
  altText: string | null;
}

export interface ProductImage {
  id: string;
  position: number;
  isPrimary: boolean;
  media: Media;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
}

export interface Size {
  id: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  excerpt: string;
  price: string;
  originalPrice: string | null;
  images: ProductImage[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: string;
  originalPrice: string | null;
  stock: number;
  color: Color | null;
  size: Size | null;
  product: Product;
}

export interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  variant: ProductVariant;
}

export interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<BaseResponse<Cart>, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<BaseResponse<CartItem>, { variantId: string; quantity: number }>({
      query: (body) => ({
        url: "/cart/items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItemQuantity: builder.mutation<BaseResponse<CartItem>, { cartItemId: string; quantity: number }>({
      query: ({ cartItemId, quantity }) => ({
        url: `/cart/items/${cartItemId}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<BaseResponse<{ success: boolean }>, string>({
      query: (cartItemId) => ({
        url: `/cart/items/${cartItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<BaseResponse<{ success: boolean }>, void>({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemQuantityMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
