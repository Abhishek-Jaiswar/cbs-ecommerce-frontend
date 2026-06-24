"use client";

import Link from "next/link";
import {
  useGetAllLandingPagesQuery,
  useDeleteLandingPageMutation,
  usePublishLandingPageMutation,
  useUnpublishLandingPageMutation,
} from "@/services/api/landing-pages/landing-page.api";
import { Loader2 } from "lucide-react";

export default function LandingPagesPage() {
  const {
    data,
    isLoading,
    error,
  } = useGetAllLandingPagesQuery();

  const [deleteLandingPage] = useDeleteLandingPageMutation();
  const [publishLandingPage] = usePublishLandingPageMutation();
  const [unpublishLandingPage] = useUnpublishLandingPageMutation();

  const landingPages = data?.data?.items || [];

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this landing page?")) {
      try {
        await deleteLandingPage(id).unwrap();
      } catch (err) {
        console.error("Failed to delete landing page:", err);
        alert("Failed to delete landing page.");
      }
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await unpublishLandingPage(id).unwrap();
      } else {
        await publishLandingPage(id).unwrap();
      }
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
      alert("Failed to update landing page status.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500 font-medium">Loading landing pages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 font-medium">
        Error loading landing pages. Please try again.
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
          text-sm
          font-medium
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
            Create your first landing page to start promoting offers and campaigns.
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
              flex
              flex-col
              "
            >
              {/* Image */}
              <div className="h-56 overflow-hidden bg-gray-100 relative">
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
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="font-semibold text-lg line-clamp-1">
                      {item.title}
                    </h2>

                    <button
                      onClick={() => handleTogglePublish(item.id, item.isPublished)}
                      className={`
                      text-xs
                      font-medium
                      px-3
                      py-1
                      rounded-full
                      transition-all
                      cursor-pointer
                      hover:opacity-80
                      shrink-0
                      ${
                        item.isPublished
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }
                    `}
                      title="Click to toggle publish status"
                    >
                      {item.isPublished ? "Published" : "Draft"}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 font-mono">
                    /{item.slug}
                  </p>

                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <div className="text-xs text-gray-400">
                    Created:{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Link
                      href={`/dashboard/landing-pages/edit/${item.id}`}
                      className="
                      flex-1
                      border
                      rounded-lg
                      py-2
                      text-center
                      text-sm
                      font-medium
                      hover:bg-gray-50
                      transition
                      "
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="
                      flex-1
                      border
                      border-red-200
                      text-red-600
                      rounded-lg
                      py-2
                      text-sm
                      font-medium
                      hover:bg-red-50
                      transition
                      "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}