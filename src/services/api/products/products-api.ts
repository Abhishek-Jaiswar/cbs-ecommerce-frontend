import { baseApi } from "../base-api";
import {
  IProductDetailsResponse,
  ProductApiResponse,
  ProductListingParams,
  ICategoriesApiResponse,
  IBrandsApiResponse,
  ITagsApiResponse,
} from "./products-api.types";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductListing: builder.query<ProductApiResponse, ProductListingParams>({
      query: ({ page = 1, limit = 10 }) =>
        `/products?page=${page}&limit=${limit}`,
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

    getCategories: builder.query<ICategoriesApiResponse, void>({
      query: () => "/categories",
    }),

    getBrands: builder.query<IBrandsApiResponse, void>({
      query: () => "/brands",
    }),

    getProductTags: builder.query<ITagsApiResponse, void>({
      query: () => "/product-tags",
    }),
  }),
});

export const {
  useGetProductListingQuery,
  useGetProductDetailsQuery,
  useGetProductByIdQuery,
  useUpdateBasicInfoMutation,
  useUpdateStatusMutation,
  useCreateVariantMutation,
  useDeleteVariantMutation,
  useCreateSpecificationMutation,
  useDeleteSpecificationMutation,
  useUploadImagesMutation,
  useDeleteImageMutation,
  useCreateProductMutation,
  useCreateColorMutation,
  useDeleteColorMutation,
  useCreateSizeMutation,
  useDeleteSizeMutation,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetProductTagsQuery,
} = productApi;


