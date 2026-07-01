import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@toffee/shared"],
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
