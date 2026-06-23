"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  useCreateLandingPageMutation,
} from "@/services/api/landing-pages/landing-page.api";

import ImageUpload from "./image-upload";

export default function LandingPageForm() {
  const router = useRouter();

  const [
    createLandingPage,
    { isLoading },
  ] = useCreateLandingPageMutation();

  const [form, setForm] = useState({
    title: "",

    slug: "",

    description: "",

    imageUrl: "",

    imagePublicId: "",

    isPublished: false,
  });

  const updateField = (
    key: string,
    value: unknown
  ) => {

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  };

 const submit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("FORM DATA:", form);

  if (!form.imageUrl) {
    alert("Please upload an image first");
    return;
  }

  try {
    const result = await createLandingPage(form).unwrap();

    console.log("Landing Page Created:", result);

    router.push("/dashboard/landing-pages");
  } catch (error) {
    console.error("CREATE LANDING PAGE ERROR:", error);

    alert("Unable to create landing page");
  }
};

 console.log("CURRENT FORM:", form);

  return (

    <form
      onSubmit={submit}
      className="
      flex
      flex-col
      gap-5
      max-w-3xl
      "
    >

      <div>

        <label>

          Title

        </label>

        <input
          value={form.title}
          onChange={(e) =>
            updateField(
              "title",
              e.target.value
            )
          }
          className="
          w-full
          border
          rounded
          p-3
          "
        />

      </div>

      <div>

        <label>

          Slug

        </label>

        <input
          value={form.slug}
          onChange={(e) =>
            updateField(
              "slug",
              e.target.value
            )
          }
          className="
          w-full
          border
          rounded
          p-3
          "
        />

      </div>

      <div>

        <label>

          Description

        </label>

        <textarea
          value={form.description}
          onChange={(e) =>
            updateField(
              "description",
              e.target.value
            )
          }
          rows={4}
          className="
          w-full
          border
          rounded
          p-3
          "
        />

      </div>

      <div>

        <label>

          Banner Image

        </label>

        <ImageUpload
          onChange={(
            imageUrl,
            imagePublicId
          ) => {

            setForm(
              (
                prev
              ) => ({
                ...prev,

                imageUrl,

                imagePublicId,
              })
            );

          }}
        />

      </div>

      <div>

        <label
          className="
          flex
          items-center
          gap-3
          "
        >

          <input
            type="checkbox"
            checked={
              form.isPublished
            }
            onChange={(e) =>
              updateField(
                "isPublished",
                e.target.checked
              )
            }
          />

          Publish

        </label>

      </div>

      <button
        type="submit"
        disabled={
          isLoading
        }
        className="
        px-5
        py-3
        border
        rounded
        "
      >

        {

        isLoading
          ? "Saving..."
          : "Create Landing Page"

        }

      </button>

    </form>

  );

}