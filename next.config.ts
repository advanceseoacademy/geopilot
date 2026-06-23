import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit", "fontkit"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
