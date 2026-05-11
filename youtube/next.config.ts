import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },

  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

export default nextConfig;