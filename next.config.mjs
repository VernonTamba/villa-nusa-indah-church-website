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
    qualities: [35, 40, 75, 90],
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
