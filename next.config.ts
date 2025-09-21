import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "@react-spring/web",
      "lucide-react",
    ],
    // optimizeCss: true, // Temporarily disabled due to critters dependency issue
    webVitalsAttribution: ["CLS", "LCP", "INP", "FCP", "TTFB"],
  },
  images: {
    formats: ["image/webp", "image/avif"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  env: {
    CUSTOM_KEY: "daily-companion",
  },
};

export default nextConfig;
