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
<<<<<<< HEAD
    "LandingPages"
=======
    "Suppliers",
    "Warehouses",
    "PurchaseOrders",
    "Transactions",
    "Blogs",
    "BlogCategories",
    "BlogTags",
>>>>>>> 7be61498b77c489bd11e38e779de21409097b54a
  ],
  endpoints: () => ({}),
});
