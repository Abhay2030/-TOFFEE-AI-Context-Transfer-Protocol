import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@toffee/shared"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
