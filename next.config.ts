import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      // DigitalOcean Spaces (uploaded images)
      { protocol: "https", hostname: "*.digitaloceanspaces.com" },
      // Placeholder images (fallback data)
      { protocol: "https", hostname: "picsum.photos" },
      // Clerk user avatars
      { protocol: "https", hostname: "img.clerk.com" },
      // Unsplash dummy images (Layanan page)
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
