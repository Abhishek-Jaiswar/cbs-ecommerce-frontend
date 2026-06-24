import { baseApi } from "../base-api";
import { BaseResponse } from "../auth/auth-api.types";

export interface LandingPage {
  id: string;

  title: string;

  slug: string;

  description?: string | null;

  imageUrl: string;

  imagePublicId: string;

  sections?: unknown;

  isPublished: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface LandingPageListResponse {
  items: LandingPage[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

export const landingPageApi =
baseApi.injectEndpoints({

 endpoints: (builder) => ({

  getAllLandingPages:
  builder.query<
    BaseResponse<
      LandingPageListResponse
    >,

    {
      page?: number;
      limit?: number;
    } | void
  >({

    query: (
      params
    ) => {

      if (params) {

        const {
          page = 1,
          limit = 10
        } = params;

        return (
          `/landing-pages?page=${page}&limit=${limit}`
        );

      }

      return (
        "/landing-pages"
      );

    },

    providesTags:
    ["LandingPages"]

  }),

  getLandingPage:
  builder.query<
    BaseResponse<
      LandingPage
    >,

    string
  >({

    query:
    (id) =>
      `/landing-pages/${id}`,

    providesTags:
    ["LandingPages"]

  }),

  getLandingPageBySlug:
  builder.query<
    BaseResponse<
      LandingPage
    >,

    string
  >({

    query:
    (slug) =>
      `/landing-pages/slug/${slug}`

  }),

  createLandingPage:
  builder.mutation<
    BaseResponse<
      LandingPage
    >,
    FormData
  >({
    query: (body) => ({
      url: "/landing-pages",
      method: "POST",
      body,
    }),
    invalidatesTags: ["LandingPages"]
  }),

  updateLandingPage:
  builder.mutation<
    BaseResponse<
      LandingPage
    >,
    {
      id: string;
      body: FormData;
    }
  >({
    query: ({ id, body }) => ({
      url: `/landing-pages/${id}`,
      method: "PUT",
      body,
    }),
    invalidatesTags: ["LandingPages"]
  }),

  deleteLandingPage:
  builder.mutation<
    BaseResponse<void>,
    string
  >({

    query:
    (id) => ({

      url:
      `/landing-pages/${id}`,

      method:
      "DELETE"

    }),

    invalidatesTags:
    ["LandingPages"]

  }),

  publishLandingPage:
  builder.mutation<
    BaseResponse<
      LandingPage
    >,

    string
  >({

    query:
    (id) => ({

      url:
      `/landing-pages/${id}/publish`,

      method:
      "PATCH"

    }),

    invalidatesTags:
    ["LandingPages"]

  }),

  unpublishLandingPage:
  builder.mutation<
    BaseResponse<
      LandingPage
    >,

    string
  >({

    query:
    (id) => ({

      url:
      `/landing-pages/${id}/unpublish`,

      method:
      "PATCH"

    }),

    invalidatesTags:
    ["LandingPages"]

  }),

 }),

 overrideExisting:
 true,

});

export const {

 useGetAllLandingPagesQuery,

 useGetLandingPageQuery,

 useGetLandingPageBySlugQuery,

 useCreateLandingPageMutation,

 useUpdateLandingPageMutation,

 useDeleteLandingPageMutation,

 usePublishLandingPageMutation,

 useUnpublishLandingPageMutation,

} =
landingPageApi;