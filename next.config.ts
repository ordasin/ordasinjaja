import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Eliminamos output: 'export' para que las APIs funcionen en Netlify
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;