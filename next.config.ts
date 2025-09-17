import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["framer-motion", "@react-spring/web"],
  },
  images: {
    formats: ["image/webp", "image/avif"],
  },
  env: {
    CUSTOM_KEY: "daily-companion",
  },
};

export default nextConfig;
