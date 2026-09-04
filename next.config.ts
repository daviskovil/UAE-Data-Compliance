import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Vendor logos will eventually be remote (Supabase storage / vendor sites).
    // Add allowed hostnames here as real listings come in.
    remotePatterns: [],
  },
};

export default nextConfig;
