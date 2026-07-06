import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@toffee/shared"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
