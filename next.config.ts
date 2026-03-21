import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // Static export doesn't support Next.js image optimization server,
    // so we use unoptimized mode. Images are still served from S3/CloudFront.
    unoptimized: true,
  },
};

export default nextConfig;
