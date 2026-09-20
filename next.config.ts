import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@aws-sdk/client-s3",
    "@aws-sdk/s3-request-presigner",
    "@smithy/core",
    "@smithy/types",
    "sharp",
  ],
  typescript: {
    // Ensure strict type-checking
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
