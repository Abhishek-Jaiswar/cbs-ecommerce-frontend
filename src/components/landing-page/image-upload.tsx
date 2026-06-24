"use client";

import { useState, useEffect } from "react";

interface Props {
  value?: string;
  onChange: (file: File | null) => void;
}

export default function ImageUpload({
  value,
  onChange,
}: Props) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  return (
    <div className="space-y-4">

      <div>
        <label className="block text-sm font-medium mb-2">
          Banner Image
        </label>

        <p className="text-sm text-gray-500">
          Upload a promotional banner for your landing page.
        </p>
      </div>

      {/* Hidden Input */}
      <input
        id="banner-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          setPreview(URL.createObjectURL(file));
          onChange(file);
        }}
      />

      {/* Upload Box */}
      {!preview && (
        <label
          htmlFor="banner-upload"
          className="
          flex
          flex-col
          items-center
          justify-center
          h-72
          w-full
          border-2
          border-dashed
          border-gray-300
          rounded-2xl
          bg-gray-50
          cursor-pointer
          hover:border-black
          hover:bg-gray-100
          transition
          "
        >
          <div className="text-6xl mb-4">
            🖼️
          </div>

          <h3 className="text-lg font-semibold">
            Upload Banner Image
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Click to browse files
          </p>

          <p className="text-xs text-gray-400 mt-3">
            PNG, JPG, WEBP • Max 10MB
          </p>

          <p className="text-xs text-gray-400">
            Recommended: 1920 × 700 px
          </p>
        </label>
      )}

      {/* Preview */}
      {preview && (
        <div className="space-y-4">

          <div className="relative">

            <img
              src={preview}
              alt="Banner Preview"
              className="
              w-full
              h-80
              object-cover
              rounded-2xl
              border
              "
            />

            <div
              className="
              absolute
              top-4
              right-4
              bg-green-500
              text-white
              px-3
              py-1
              rounded-full
              text-xs
              font-medium
              "
            >
              Selected
            </div>

          </div>

          <div className="flex gap-3">

            <label
              htmlFor="banner-upload"
              className="
              px-4
              py-2
              border
              rounded-lg
              cursor-pointer
              hover:bg-gray-100
              transition
              "
            >
              Replace Image
            </label>

            <button
              type="button"
              onClick={() => {
                setPreview("");
                onChange(null);
              }}
              className="
              px-4
              py-2
              border
              border-red-200
              text-red-600
              rounded-lg
              hover:bg-red-50
              transition
              "
            >
              Remove
            </button>

          </div>

        </div>
      )}

    </div>
  );
}