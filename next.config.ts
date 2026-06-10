import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-markdown", "remark-gfm"],
  experimental: {
    useWasmBinary: true,
  },
};

export default nextConfig;
