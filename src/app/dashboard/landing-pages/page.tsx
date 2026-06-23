"use client";

import Link from "next/link";
import {
  useGetAllLandingPagesQuery,
} from "@/services/api/landing-pages/landing-page.api";

export default function LandingPagesPage() {
  const {
    data,
    isLoading,
    error,
  } = useGetAllLandingPagesQuery();

  const landingPages =
    data?.data?.items || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading landing pages
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Landing Pages
          </h1>

          <p className="text-gray-500 mt-1">
            Manage promotional banners and festival campaigns.
          </p>
        </div>

        <Link
          href="/dashboard/landing-pages/create"
          className="
          bg-black
          text-white
          px-4
          py-2
          rounded-lg
          hover:opacity-90
          transition
          "
        >
          + Create Landing Page
        </Link>
      </div>

      {/* Empty State */}
      {landingPages.length === 0 ? (
        <div
          className="
          bg-white
          border
          rounded-xl
          p-12
          text-center
          "
        >
          <h2 className="text-xl font-semibold">
            No Landing Pages Found
          </h2>

          <p className="text-gray-500 mt-2">
            Create your first landing page to start
            promoting offers and campaigns.
          </p>
        </div>
      ) : (
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
          "
        >
          {landingPages.map((item) => (
            <div
              key={item.id}
              className="
              bg-white
              border
              rounded-xl
              overflow-hidden
              shadow-sm
              hover:shadow-lg
              transition-all
              duration-200
              "
            >
              {/* Image */}
              <div className="h-56 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="
                  w-full
                  h-full
                  object-cover
                  hover:scale-105
                  transition-transform
                  duration-300
                  "
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-lg">
                    {item.title}
                  </h2>

                  <span
                    className={`
                    text-xs
                    font-medium
                    px-3
                    py-1
                    rounded-full
                    ${
                      item.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                  >
                    {item.isPublished
                      ? "Published"
                      : "Draft"}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  /{item.slug}
                </p>

                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {item.description}
                  </p>
                )}

                <div className="text-xs text-gray-400">
                  Created:
                  {" "}
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    className="
                    flex-1
                    border
                    rounded-lg
                    py-2
                    hover:bg-gray-50
                    "
                  >
                    Edit
                  </button>

                  <button
                    className="
                    flex-1
                    border
                    border-red-200
                    text-red-600
                    rounded-lg
                    py-2
                    hover:bg-red-50
                    "
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}