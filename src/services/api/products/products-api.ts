import { baseApi } from "../base-api";
import {
  IProductDetailsResponse,
  ProductApiResponse,
  ProductListingParams,
  ICategoriesApiResponse,
  IBrandsApiResponse,
  ITagsApiResponse,
  ShopListingFilters,
  ShopListingResponse,
} from "./products-api.types";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductListing: builder.query<ProductApiResponse, ProductListingParams>({
      query: ({ page = 1, limit = 10 }) =>
        `/products?page=${page}&limit=${limit}`,
      providesTags: ["Products"],
    }),

    /** Shop: filtered listing loaded in chunks (page 1 also carries facets). */
    getShopListing: builder.infiniteQuery<ShopListingResponse, ShopListingFilters, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, _all, lastPageParam) =>
          lastPage.data.page < lastPage.data.totalPages ? lastPageParam + 1 : undefined,
      },
      query: ({ queryArg, pageParam }) => {
        const q = new URLSearchParams({ page: String(pageParam), limit: String(queryArg.limit ?? 20) });
        if (queryArg.category) q.set("category", queryArg.category);
        if (queryArg.tags?.length) q.set("tags", queryArg.tags.join(","));
        if (queryArg.search) q.set("search", queryArg.search);
        if (queryArg.minPrice !== undefined) q.set("minPrice", String(queryArg.minPrice));
        if (queryArg.maxPrice !== undefined) q.set("maxPrice", String(queryArg.maxPrice));
        if (queryArg.sale) q.set("sale", "true");
        if (queryArg.isNew) q.set("new", "true");
        if (queryArg.featured) q.set("featured", "true");
        if (queryArg.sort) q.set("sort", queryArg.sort);
        if (pageParam === 1) q.set("facets", "true");
        return `/products?${q.toString()}`;
      },
      providesTags: ["Products"],
    }),

    getAdminProductListing: builder.query<ProductApiResponse, ProductListingParams>({
      query: ({ page = 1, limit = 100 }) =>
        `/products/admin/all?page=${page}&limit=${limit}`,
      providesTags: ["Products"],
    }),

    getProductDetails: builder.query<IProductDetailsResponse, string>({
      query: (slug: string) => `/products/slug/${slug}`,
      providesTags: ["ProductDetails"],
    }),

    getProductById: builder.query<IProductDetailsResponse, string>({
      query: (id: string) => `/products/${id}`,
      providesTags: ["ProductDetails"],
    }),

    updateBasicInfo: builder.mutation<unknown, { id: string; body: unknown }>({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ProductDetails", "Products"],
    }),

    updateStatus: builder.mutation<unknown, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/products/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["ProductDetails", "Products"],
    }),

    createVariant: builder.mutation<unknown, { productId: string; body: unknown }>({
      query: ({ productId, body }) => ({
        url: `/products/${productId}/variants`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProductDetails"],
    }),

    deleteVariant: builder.mutation<unknown, string>({
      query: (variantId) => ({
        url: `/products/variants/${variantId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductDetails"],
    }),

    getVariants: builder.query<any, { page: number; limit: number; search?: string; stockStatus?: string }>({
      query: (params) => ({
        url: "/inventory",
        params,
      }),
      providesTags: ["ProductDetails", "Products"],
    }),

    updateVariant: builder.mutation<unknown, { variantId: string; body: { price: number | null; stock: number } }>({
      query: ({ variantId, body }) => ({
        url: `/inventory/${variantId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ProductDetails", "Products"],
    }),

    createSpecification: builder.mutation<unknown, { productId: string; body: unknown }>({
      query: ({ productId, body }) => ({
        url: `/products/${productId}/specifications`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProductDetails"],
    }),

    deleteSpecification: builder.mutation<unknown, { productId: string; specificationId: string }>({
      query: ({ productId, specificationId }) => ({
        url: `/products/${productId}/specifications/${specificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductDetails"],
    }),

    uploadImages: builder.mutation<unknown, { productId: string; formData: FormData }>({
      query: ({ productId, formData }) => ({
        url: `/products/${productId}/images`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ProductDetails"],
    }),

    deleteImage: builder.mutation<unknown, { productId: string; imageId: string }>({
      query: ({ productId, imageId }) => ({
        url: `/products/${productId}/images/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductDetails"],
    }),

    createProduct: builder.mutation<unknown, unknown>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    createColor: builder.mutation<unknown, { productId: string; body: { name: string; hex: string } }>({
      query: ({ productId, body }) => ({
        url: `/products/${productId}/colors`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProductDetails"],
    }),

    deleteColor: builder.mutation<unknown, string>({
      query: (colorId) => ({
        url: `/products/colors/${colorId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductDetails"],
    }),

    createSize: builder.mutation<unknown, { productId: string; body: { value: string } }>({
      query: ({ productId, body }) => ({
        url: `/products/${productId}/sizes`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProductDetails"],
    }),

    deleteSize: builder.mutation<unknown, string>({
      query: (sizeId) => ({
        url: `/products/sizes/${sizeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductDetails"],
    }),

    getCategories: builder.query<ICategoriesApiResponse, { page?: number; limit?: number } | void>({
      query: (params) => {
        if (params) {
          const { page = 1, limit = 10 } = params;
          return `/categories?page=${page}&limit=${limit}`;
        }
        return "/categories?limit=1000";
      },
      providesTags: ["Categories"],
    }),

    createCategory: builder.mutation<unknown, FormData>({
      query: (formData) => ({
        url: "/categories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),

    updateCategory: builder.mutation<unknown, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),

    deleteCategory: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    getBrands: builder.query<IBrandsApiResponse, { page?: number; limit?: number } | void>({
      query: (params) => {
        if (params) {
          const { page = 1, limit = 10 } = params;
          return `/brands?page=${page}&limit=${limit}`;
        }
        return "/brands?limit=1000";
      },
      providesTags: ["Brands"],
    }),

    createBrand: builder.mutation<unknown, FormData>({
      query: (formData) => ({
        url: "/brands",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Brands"],
    }),

    updateBrand: builder.mutation<unknown, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/brands/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Brands"],
    }),

    deleteBrand: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brands"],
    }),

    getProductTags: builder.query<ITagsApiResponse, { page?: number; limit?: number } | void>({
      query: (params) => {
        if (params) {
          const { page = 1, limit = 10 } = params;
          return `/product-tags?page=${page}&limit=${limit}`;
        }
        return "/product-tags?limit=1000";
      },
      providesTags: ["Tags"],
    }),

    createProductTag: builder.mutation<unknown, { name: string; slug: string }>({
      query: (body) => ({
        url: "/product-tags",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tags"],
    }),

    updateProductTag: builder.mutation<unknown, { id: string; body: { name?: string; slug?: string } }>({
      query: ({ id, body }) => ({
        url: `/product-tags/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tags"],
    }),

    deleteProductTag: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/product-tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tags"],
    }),
    searchProducts: builder.query<
      {
        status: string;
        data: {
          items: any[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
          facets: {
            categories: { id: string; name: string; slug: string; count: number }[];
            brands: { id: string; name: string; count: number }[];
            minPrice: number;
            maxPrice: number;
          };
        };
      },
      {
        q?: string;
        page?: number;
        limit?: number;
        categoryId?: string;
        brandId?: string;
        minPrice?: number;
        maxPrice?: number;
        minRating?: number;
        isSale?: boolean;
        isFeatured?: boolean;
        inStockOnly?: boolean;
        sort?: string;
      }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.q) searchParams.append("q", params.q);
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.categoryId) searchParams.append("categoryId", params.categoryId);
        if (params.brandId) searchParams.append("brandId", params.brandId);
        if (params.minPrice !== undefined) searchParams.append("minPrice", params.minPrice.toString());
        if (params.maxPrice !== undefined) searchParams.append("maxPrice", params.maxPrice.toString());
        if (params.minRating !== undefined) searchParams.append("minRating", params.minRating.toString());
        if (params.isSale) searchParams.append("isSale", "true");
        if (params.isFeatured) searchParams.append("isFeatured", "true");
        if (params.inStockOnly) searchParams.append("inStockOnly", "true");
        if (params.sort) searchParams.append("sort", params.sort);

        return `/search?${searchParams.toString()}`;
      },
      providesTags: ["Products"],
    }),
    getSearchSuggestions: builder.query<
      {
        status: string;
        data: {
          categories: { id: string; name: string; slug: string }[];
          products: {
            id: string;
            name: string;
            slug: string;
            excerpt: string;
            price: number;
            originalPrice: number | null;
            categoryName: string | null;
            imageUrl: string | null;
          }[];
        };
      },
      string
    >({
      query: (q) => `/search/suggestions?q=${encodeURIComponent(q)}`,
      providesTags: ["Products"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProductListingQuery,
  useGetShopListingInfiniteQuery,
  useGetAdminProductListingQuery,
  useGetProductDetailsQuery,
  useGetProductByIdQuery,
  useUpdateBasicInfoMutation,
  useUpdateStatusMutation,
  useCreateVariantMutation,
  useDeleteVariantMutation,
  useGetVariantsQuery,
  useUpdateVariantMutation,
  useCreateSpecificationMutation,
  useDeleteSpecificationMutation,
  useUploadImagesMutation,
  useDeleteImageMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useCreateColorMutation,
  useDeleteColorMutation,
  useCreateSizeMutation,
  useDeleteSizeMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetProductTagsQuery,
  useCreateProductTagMutation,
  useUpdateProductTagMutation,
  useDeleteProductTagMutation,
  useSearchProductsQuery,
  useGetSearchSuggestionsQuery,
} = productApi;


