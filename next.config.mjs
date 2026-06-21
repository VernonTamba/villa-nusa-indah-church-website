import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  experimental: {
    serverActions: {
      // Raise body limit to 5 MB so larger member/hero photos can be uploaded
      bodySizeLimit: "5mb",
    },
  },
  images: {
    formats: ["image/webp", "image/avif"],
    qualities: [35, 60, 75, 80],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uftppczakjnsxgoyoolx.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
