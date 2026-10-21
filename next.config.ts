import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Direct imports for the `radix-ui` umbrella package (not on Next's
    // built-in list; lucide-react, date-fns and recharts already are).
    optimizePackageImports: ["radix-ui"],
  },
};

export default nextConfig;
