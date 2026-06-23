import LandingPageForm from "@/components/landing-page/landing-page-form";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Create Landing Page
          </h1>

          <p className="text-gray-500 mt-2">
            Create promotional pages for festivals,
            offers, sales campaigns, and seasonal events.
          </p>
        </div>

        {/* Form Card */}
        <div
          className="
          bg-white
          border
          rounded-2xl
          shadow-sm
          p-8
          "
        >
          <LandingPageForm />
        </div>
      </div>
    </div>
  );
}