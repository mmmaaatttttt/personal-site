import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({});

const nextConfig: NextConfig = {
  experimental: {
    mdxRs: true,
  },
  output: "export",
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

export default withMDX(nextConfig);
