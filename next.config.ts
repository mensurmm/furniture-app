import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Side tip: change '://unsplash.com' to 'images.unsplash.com' for correct Unsplash images
        pathname: '/**',
      },
    ],
  },
};

// Replace lines 16 and 17 with this clean export:
export default withNextIntl(nextConfig);