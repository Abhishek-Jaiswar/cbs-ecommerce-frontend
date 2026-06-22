import { baseApi } from "../base-api";

export interface IBlogCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface IBlogTag {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface IBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image: string;
  storageKey: string;
  altText: string;
  status: "DRAFT" | "PUBLISHED";
  isFeatured: boolean;
  publishedAt?: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email?: string;
  };
  categoryId: string;
  category: IBlogCategory;
  tags: IBlogTag[];
  createdAt: string;
  updatedAt: string;
}

export interface IBlogPostsResponse {
  items: IBlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBlogCategoriesResponse {
  items: IBlogCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBlogTagsResponse {
  items: IBlogTag[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogPosts: builder.query<IBlogPostsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => `/blog-posts?page=${page}&limit=${limit}`,
      transformResponse: (response: { success: boolean; data: IBlogPostsResponse }) => response.data,
      providesTags: ["Blogs"],
    }),

    getBlogPostBySlug: builder.query<IBlogPost, string>({
      query: (slug: string) => `/blog-posts/slug/${slug}`,
      transformResponse: (response: { success: boolean; data: IBlogPost }) => response.data,
      providesTags: ["Blogs"],
    }),

    getBlogPostById: builder.query<IBlogPost, string>({
      query: (id: string) => `/blog-posts/${id}`,
      transformResponse: (response: { success: boolean; data: IBlogPost }) => response.data,
      providesTags: ["Blogs"],
    }),

    createBlogPost: builder.mutation<IBlogPost, Partial<IBlogPost> & { tagIds?: string[] }>({
      query: (body) => ({
        url: "/blog-posts",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: boolean; data: IBlogPost }) => response.data,
      invalidatesTags: ["Blogs"],
    }),

    updateBlogPost: builder.mutation<IBlogPost, { id: string; body: Partial<IBlogPost> & { tagIds?: string[] } }>({
      query: ({ id, body }) => ({
        url: `/blog-posts/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: { success: boolean; data: IBlogPost }) => response.data,
      invalidatesTags: ["Blogs"],
    }),

    deleteBlogPost: builder.mutation<{ success: boolean }, string>({
      query: (id: string) => ({
        url: `/blog-posts/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { success: boolean; data: { success: boolean } }) => response.data,
      invalidatesTags: ["Blogs"],
    }),

    getBlogCategories: builder.query<IBlogCategoriesResponse, { page?: number; limit?: number } | void>({
      query: (params) => {
        const page = params?.page || 1;
        const limit = params?.limit || 100;
        return `/blog-categories?page=${page}&limit=${limit}`;
      },
      transformResponse: (response: { success: boolean; data: IBlogCategoriesResponse }) => response.data,
      providesTags: ["BlogCategories"],
    }),

    getBlogTags: builder.query<IBlogTagsResponse, { page?: number; limit?: number } | void>({
      query: (params) => {
        const page = params?.page || 1;
        const limit = params?.limit || 100;
        return `/blog-tags?page=${page}&limit=${limit}`;
      },
      transformResponse: (response: { success: boolean; data: IBlogTagsResponse }) => response.data,
      providesTags: ["BlogTags"],
    }),

    createBlogCategory: builder.mutation<IBlogCategory, Partial<IBlogCategory>>({
      query: (body) => ({
        url: "/blog-categories",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: boolean; data: IBlogCategory }) => response.data,
      invalidatesTags: ["BlogCategories"],
    }),

    updateBlogCategory: builder.mutation<IBlogCategory, { id: string; body: Partial<IBlogCategory> }>({
      query: ({ id, body }) => ({
        url: `/blog-categories/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: { success: boolean; data: IBlogCategory }) => response.data,
      invalidatesTags: ["BlogCategories"],
    }),

    deleteBlogCategory: builder.mutation<{ success: boolean }, string>({
      query: (id: string) => ({
        url: `/blog-categories/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { success: boolean; data: { success: boolean } }) => response.data,
      invalidatesTags: ["BlogCategories"],
    }),

    createBlogTag: builder.mutation<IBlogTag, Partial<IBlogTag>>({
      query: (body) => ({
        url: "/blog-tags",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: boolean; data: IBlogTag }) => response.data,
      invalidatesTags: ["BlogTags"],
    }),

    updateBlogTag: builder.mutation<IBlogTag, { id: string; body: Partial<IBlogTag> }>({
      query: ({ id, body }) => ({
        url: `/blog-tags/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: { success: boolean; data: IBlogTag }) => response.data,
      invalidatesTags: ["BlogTags"],
    }),

    deleteBlogTag: builder.mutation<{ success: boolean }, string>({
      query: (id: string) => ({
        url: `/blog-tags/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { success: boolean; data: { success: boolean } }) => response.data,
      invalidatesTags: ["BlogTags"],
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useGetBlogPostBySlugQuery,
  useGetBlogPostByIdQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
  useGetBlogCategoriesQuery,
  useGetBlogTagsQuery,
  useCreateBlogCategoryMutation,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
  useCreateBlogTagMutation,
  useUpdateBlogTagMutation,
  useDeleteBlogTagMutation,
} = blogApi;
