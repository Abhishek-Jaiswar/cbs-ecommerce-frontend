import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  async rewrites() {
    const rawBackendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
    // Strip trailing slashes, /api/v1, or /api to prevent duplicated paths
    const cleanedBackendUrl = rawBackendUrl.replace(/\/api(\/v1)?\/?$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${cleanedBackendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
