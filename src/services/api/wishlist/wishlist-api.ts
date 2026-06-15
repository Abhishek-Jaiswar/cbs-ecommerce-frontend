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

export interface Product {
  id: string;
  name: string;
  slug: string;
  excerpt: string;
  price: string;
  originalPrice: string | null;
  images: ProductImage[];
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  createdAt: string;
  product: Product;
}

export interface Wishlist {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: WishlistItem[];
}

export interface ToggleResponse {
  liked: boolean;
  message: string;
}

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<BaseResponse<Wishlist>, void>({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),
    toggleWishlistItem: builder.mutation<BaseResponse<ToggleResponse>, { productId: string }>({
      query: (body) => ({
        url: "/wishlist/toggle",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeWishlistItem: builder.mutation<BaseResponse<{ success: boolean }>, string>({
      query: (wishlistItemId) => ({
        url: `/wishlist/items/${wishlistItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetWishlistQuery,
  useToggleWishlistItemMutation,
  useRemoveWishlistItemMutation,
} = wishlistApi;
