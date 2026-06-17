import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: rawBaseQuery,
  tagTypes: [
    "Products",
    "ProductDetails",
    "Categories",
    "Brands",
    "Tags",
    "Users",
    "Addresses",
    "Cart",
    "Wishlist",
    "Reviews",
    "Coupons",
    "Offers",
    "Redemptions",
    "Orders",
    "Payments",
    "Announcements",
    "Reports",
  ],
  endpoints: () => ({}),
});
